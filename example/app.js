//WebChat.createUser('test2', 'abc');
// chat = new WebChat('nganhvu');
// const form = document.getElementById('message-form');
// const messageField = document.getElementById('message');
// const messagesList = document.getElementById('messages');
// const status = document.getElementById('status');

// chat.ready = () => {
// 	status.innerHTML = 'connected';

// 	form.onsubmit = (e) => {
// 		e.preventDefault();

// 		var message = messageField.value;

// 		chat.sendMessage(chat.user.rooms[0].id, message);

// 		messageField.value = '';
// 	};

// 	// get newest 20 messages
// 	chat.getMessages('19796396', null, null, m => {
// 		m.forEach(msg => {
// 			messagesList.innerHTML += '<li>' + getMessage(msg) + '</li>';
// 		});
// 	})

// 	chat.on('Message', (r, m) => {
// 		messagesList.innerHTML += `<li> ${r}: ` + getMessage(m) + '</li>';
// 	});
// };