const events = [
	'Open', //		(event)		=> When connected to WebSocket
	'Request', //	(data)		=> When a request appear
	'Close', //		(evvent)	=> When disconnected
	'Error' //		(event)		=> When an error occured
]

class MyEvent {
	constructor() { this.events = []; }

	add(cb) { this.events.push(cb); }

	trigger(...params) { this.events.forEach(event => event(...params)); }

	static createEventHandler(arr) {
		let events = {};
		arr.forEach(value => {events[value] = new MyEvent();});
		return events;
	}
}

class RequestHandler {
	constructor(id) {
		this.id = id || 'general';
		this.event = MyEvent.createEventHandler(events);
		this.socket = new WebSocket('ws://localhost:4000');
		this.socket.onopen = event => this.event['Open'].trigger(event);
		this.socket.onmessage = event => this.event['Request'].trigger(JSON.parse(event.data));
		this.socket.onclose = event => this.event['Close'].trigger(event);
		this.socket.onerror = event => this.event['Error'].trigger(event);
	}

	on(name, cb) {
		this.event[name].add(cb);
	}

	send(data, id) {
		console.log(id)
		if (id == undefined) id = this.id;
		this.socket.send(JSON.stringify({sender: id, data: data}));
	}

	close() {
		this.socket.close();
	}
}