chat = new WebChat('nganhvu');
const form = document.getElementById('message-form');
const messageField = document.getElementById('message');
const messagesList = document.getElementById('messages');
const status = document.getElementById('status');

chat.ready = () => {
	status.innerHTML = 'connected';

	form.onsubmit = (e) => {
		e.preventDefault();

		var message = messageField.value;

		chat.sendMessage(chat.user.rooms[0].id, message, id => console.log(id));

		messageField.value = '';
	};

	chat.on('Message', m => {
		messagesList.innerHTML += '<li>' + getMessage(m) + '</li>';
	});
};
