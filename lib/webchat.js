function ask(data, cb) {
	$.post({
		url: '/webchat/lib/webchat.php',
		data: data
	}).done(data => cb(data));
}

class MyEvent {
	constructor() { this.events = []; }

	add(cb) { this.events.push(cb); }

	trigger(...params) { this.events.forEach(event => event(...params)); }

	static createEventHandler(arr) {
		let events = {}
		arr.forEach(value => {events[value] = new MyEvent();});
		return events;
	}

	static createEventCallback(eventHandler, add) {
		let events = {}
		for (let key in eventHandler) {
			events[`on${key}`] = function(...params) {
				if (add) eventHandler[key].trigger(add, ...params);
				else eventHandler[key].trigger(...params);
			}
		}
		return events;
	}
}

const userEvents = [
	'AddedToRoom', //		(room) => The current user is added to a room.
	'RemovedFromRoom', //	(room) => The current user is removed from a room.
	'RoomUpdated', //		(room) => A room that the current user is a member of has been updated (name or new message has been sent)
	'RoomDeleted' //		(room) => A room that the current user is a member of is deleted.
]

const roomEvents = [
	'Message', // 			(roomId, message)
	'UserJoined', //		(roomId, user)
	'UserLeft', //			(roomId, user)
	'PresenceChanged' //	(roomId, state, user)
]

function getMessage(message) {
	let data = message.parts[0];
	let type = data.partType
	if (type == 'inline') return data.payload.content;
	if (type == 'url') return data.payload.url;
	return data.payload.name;
}

class WebChat {
	constructor(userID) {
		this.events = {
			user: MyEvent.createEventHandler(userEvents),
			room: MyEvent.createEventHandler(roomEvents)
		}

		ask({chatkey: userID}, key => {
			key = JSON.parse(key);
			new Chatkit.ChatManager({
				instanceLocator: key[0],
				userId: userID,
				tokenProvider: new Chatkit.TokenProvider({url: key[1]})
			}).connect(MyEvent.createEventCallback(this.events.user)).then(user => {
				this.user = user;
				this.getAllRooms(room => this.subscribe(room.id, 0));
				this.on('AddedToRoom', room => this.subscribe(room.id, 0));
				this.ready();
			});
		});
	}

	on(name, cb) {
		if (userEvents.includes(name)) this.events.user[name].add(cb);
		else this.events.room[name].add(cb);
	}

	// exam: createUser('uniqueId', 'Name')
	static createUser(id, name, cb = () => {}) {
		ask({createUser: {
			uniqueId: id,
			name: name
		}}, cb);
	}

	static deleteUser(userId, cb = () => {}) {
		ask({deleteUser: userId}, cb);
	}

	// disconnect the current user from all subscriptions
	disconnect() {
		this.user.disconnect();
	}

	// get the rooms that the current user is a member of
	getAllRooms(cb) {
		this.user.rooms.forEach(room => cb(room));
	}

	// exam: {name: 'abcd', addUserIds: ['id1', id2']}
	createRoom(data, cb = () => {}) {
		if (typeof(data.name) == 'undefined') data.name = `Room of ${this.user.id}`;
		if (typeof(data.addUserIds) == 'undefined') data.addUserIds = [];
		data.private = true;
		this.user.createRoom(data).then(room => cb(room));
	}

	// Add an user to a room
	// exam: {userId: 'id', roomId: 'id'}
	addUserToRoom(data, cb = () => {}) {
		this.user.addUserToRoom(data).then(cb);
	}

	// remove an user from a room
	removeUserFromRoom(data, cb = () => {}) {
		this.user.removeUserFromRoom(data).then(cb);
	}

	// join a room
	joinRoom(roomId, cb = () => {}) {
		this.user.joinRoom({roomId: roomId}).then(() => {
			this.subscribe(roomId, 0);
			cb();
		});
	}

	// leave a room which user is a member of
	leaveRoom(roomId, cb = () => {}) {
		this.user.leaveRoom({roomId: roomId}).then(cb);
	}

	// delete a room which user is a member of
	deleteRoom(roomId, cb = () => {}) {
		this.user.deleteRoom({roomId: roomId}).then(cb);
	}

	sendMessage(roomId, message, cb = () => {}) {
		this.user.sendSimpleMessage({
			roomId: roomId,
			text: message
		}).then(messageId => cb(messageId));
	}

	static deleteMessage(messageId, cb = () => {}) {
		ask({deleteMsg: messageId}, cb);
	}

	// initId: messageId to start for getting (default: newest message) | limit: number of message (max=100, default: 20)
	// return Array[] from older messages to newer messages
	// exam: get 20 newest messages getMessages(roomId, null, null, message => console.log(getMessage(message), message))
	getMessages(roomId, initId, limit, cb) {
		this.user.fetchMultipartMessages({
			roomId: roomId,
			initialId: initId ? initId : undefined,
			limit: limit ? Math.min(limit, 100) : undefined,
			direction: 'older'
		}).then(message => cb(message));
	}

	subscribe(roomId, messageLimit) {
		this.user.subscribeToRoomMultipart({
			roomId: roomId,
			messageLimit: messageLimit || 0,
			hooks: MyEvent.createEventCallback(this.events.room, roomId)
		});
	}
}

/**
	* @param User
		- rooms (array): The rooms that the connected user is a member of
		- users (array): The union of all the members of all the rooms that the current user is subscribed to
		- roomSubscriptions (object): The rooms a user is joined and subscribed to
		- id (string): The unique identifier for the user on the instance.
		- name (string): The human readable name of the user. This is not required to be unique.
		- presence (object): An object containing information regarding the user’s presence state (presence.state)
 	* @param Room
		- id (string): The global identifier for the room on the instance.
		- isPrivate	(bool): If true the room is private, otherwise the room is public.
		- name (string): The human readable name of the room (this needn’t be unique!)
		- users (array): An array of all the users that are members of this room. Only accessible when subscribed to the room
		- unreadCount (number): Count of unread messages for the given user in this room. Only defined if user is member of the room.
		- lastMessageAt (string): The timestamp at which the last message sent in this room was created. Only defined if user is member of the room and the room has messages.
	* @param Message
		- id (int): The ID assigned to the message by the Chatkit servers.
		- sender (User): The user who sent the message.
		- room (Room): The room to which the message belongs.
		- parts (array): The parts that make up the message.
		- createdAt (string): The timestamp at which the message was created.
		- updatedAt (string): The timestamp at which the message was last updated.
*/