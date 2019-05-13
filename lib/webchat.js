(() => {
function ask(data, cb) {
	$.post({ url: '/guideme/lib/webchat.php', data: data }).done(cb);
}

class MyEvent {
	constructor() { this.events = []; }

	add(cb) { this.events.push(cb); }

	trigger(...params) { this.events.forEach(event => event(...params)); }

	static createEventHandler(arr) {
		let events = {};
		arr.forEach(value => {events[value] = new MyEvent();});
		return events;
	}

	static createEventCallback(eventHandler, add) {
		let events = {};
		for (let key in eventHandler) {
			events[`on${key}`] = function(...params) {
				if (add) eventHandler[key].trigger(add, ...params);
				else eventHandler[key].trigger(...params);
			}
		}
		return events;
	}
}

/* Events about the current user */
const userEvents = [
	'AddedToRoom', //		(room) => The current user is added to a room.
	'RemovedFromRoom', //	(room) => The current user is removed from a room.
	'RoomUpdated', //		(room) => A room that the current user is a member of has been updated (name or new message has been sent)
	'RoomDeleted' //		(room) => A room that the current user is a member of is deleted.
]

/* Events inside the rooms that the current user is a member of */
const roomEvents = [
	'Message', //			(roomId, message) // An user in the room posted a message
	'UserJoined', //		(roomId, user) // An user joined the room
	'UserLeft', //			(roomId, user) // An user left the room
	'PresenceChanged' //	(roomId, state, user) // User's state changed
]

function getMsg(message) {
	let data = message.parts[0];
	let type = data.partType;
	if (type == 'inline') return data.payload.content;
	if (type == 'url') return data.payload.url;
	return data.payload.name;
}

function emptyFn() {}

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
				this.on('AddedToRoom', room => this.subscribe(room.id));
				this.ready();
			});
		});
	}

	on(name, cb) {
		if (userEvents.includes(name)) this.events.user[name].add(cb);
		else this.events.room[name].add(cb);
	}

	// example: createUser('uniqueId', 'Name')
	static createUser(id, name, cb = emptyFn) {
		ask({createUser: {
			uniqueId: id,
			name: name
		}}, cb);
	}

	static deleteUser(userId, cb = emptyFn) {
		ask({deleteUser: userId}, cb);
	}

	// return 0 or roomID if UserId1 and UserId2 joined a 1-1 room  
	static existRoom(UserId1, UserId2, cb = emptyFn) {
		ask({exist: {
			id1: UserId1,
			id2: UserId2
		}}, cb);
	}

	static markRoom(UserId1, UserId2, roomId, cb = emptyFn) {
		ask({mark: {
			id1: UserId1,
			id2: UserId2,
			roomId: roomId
		}}, cb);
	}

	// disconnect the current user from all subscriptions
	disconnect() {
		this.user.disconnect();
	}

	// get the rooms that the current user is a member of
	getAllRooms(cb) {
		this.user.rooms.forEach(cb); // (room)
	}

	// example: data = {name: 'abcd', addUserIds: ['id1', id2']}
	createRoom(data, cb = emptyFn) {
		if (typeof(data.name) == 'undefined') data.name = `Room of ${this.user.id}`;
		if (typeof(data.addUserIds) == 'undefined') data.addUserIds = [];
		data.private = true;
		this.user.createRoom(data).then(cb); // (room)
	}

	// Add some users to a room
	// example: data = {userIds: ['id1', 'id2'], roomId: 'id'}
	addUsersToRoom(data, cb = emptyFn) {
		data.userIds.forEach(id => {
			this.user.addUserToRoom({userId: id, roomId: data.roomId}).then(cb);
		})
	}

	// remove an user from a room
	// example: data = {userId: 'ID', roomId: 'roomID'}
	removeUserFromRoom(data, cb = emptyFn) {
		this.user.removeUserFromRoom(data).then(cb);
	}

	// join a existential room
	joinRoom(roomId, cb = emptyFn) {
		this.user.joinRoom({roomId: roomId}).then(room => {
			this.subscribe(roomId, 0);
			cb(room);
		});
	}

	// leave a room that the current user is a member of
	leaveRoom(roomId, cb = emptyFn) {
		this.user.leaveRoom({roomId: roomId}).then(cb); // (room)
	}

	// delete a room that the current user is a member of
	deleteRoom(roomId, cb = emptyFn) {
		this.user.deleteRoom({roomId: roomId}).then(cb);
	}

	// example: sendMessage('id', 'Hello im a text')
	sendMessage(roomId, message, cb = emptyFn) {
		this.user.sendSimpleMessage({
			roomId: roomId,
			text: message
		}).then(messageId => cb(messageId));
	}

	static deleteMessage(messageId, cb = emptyFn) {
		ask({deleteMsg: parseInt(messageId)}, cb);
	}

	/*
		initId: messageId to start for getting (default: newest message) | limit: number of message (max=100, default: 20)
		return Array[] from older to newer messages
		example of getting 20 newest messages:
		getMessages(roomId, null, null, message => console.log(getMessage(message), message))
	*/
	getMessages(roomId, initId, limit, cb) {
		this.user.fetchMultipartMessages({
			roomId: roomId,
			initialId: initId ? initId : undefined,
			limit: limit ? Math.min(limit, 100) : undefined,
			direction: 'older'
		}).then(cb); // (messages)
	}

	// subscribe to a room to active roomEvents
	subscribe(roomId, messageLimit) {
		this.user.subscribeToRoomMultipart({
			roomId: roomId,
			messageLimit: messageLimit || 0,
			hooks: MyEvent.createEventCallback(this.events.room, roomId)
		});
	}
}
window.getMsg = getMsg;
window.WebChat = WebChat;
})();

/**
	* @name User
		@property rooms (array): The rooms that the connected user is a member of
		@property users (array): The union of all the members of all the rooms that the current user is subscribed to
		@property roomSubscriptions (object): The rooms a user is joined and subscribed to
		@property id (string): The unique identifier for the user on the instance.
		@property name (string): The human readable name of the user. This is not required to be unique.
		@property presence (object): An object containing information regarding the user’s presence state (presence.state)
	* @name Room
		@property id (string): The global identifier for the room on the instance.
		@property isPrivate	(bool): If true the room is private, otherwise the room is public.
		@property name (string): The human readable name of the room (this needn’t be unique!)
		@property users (array): An array of all the users that are members of this room. Only accessible when subscribed to the room
		@property unreadCount (number): Count of unread messages for the given user in this room. Only defined if user is member of the room.
		@property lastMessageAt (string): The timestamp at which the last message sent in this room was created. Only defined if user is member of the room and the room has messages.
	* @name Message
		@property id (int): The ID assigned to the message by the Chatkit servers.
		@property sender (User): The user who sent the message.
		@property room (Room): The room to which the message belongs.
		@property parts (array): The parts that make up the message.
		@property createdAt (string): The timestamp at which the message was created.
		@property updatedAt (string): The timestamp at which the message was last updated.
*/