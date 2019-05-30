//$(() => {
	const form = document.getElementById('message-form');
	const messageField = document.getElementById('message');
	const messagesList = document.getElementById('messages');
	const socketStatus = document.getElementById('status');
	const closeBtn = document.getElementById('close');

  let reqHandler = new RequestHandler('app.js');
  // nhin tao gui 1 cai khac ne`.
	reqHandler.on('Open', event => {
		socketStatus.innerHTML = `Connected to: ${event.currentTarget.url}`;
		socketStatus.className = 'open';
	})

	reqHandler.on('Error', error => {
		console.log(`WebSocket Error: ${error}`);
	})

	form.onsubmit = e => {
    e.preventDefault(); 

		var message = messageField.value;

		reqHandler.send(message); // dau

		messageField.value = '';
	};

	reqHandler.on('Request', data => {
    //messagesList.innerHTML += '<li class="received">' + data.data + '</li>';
    console.log(data.sender + ': ' + data.data);
	});

	reqHandler.on('Close', event => {
		socketStatus.innerHTML = 'Disconnected from WebSocket.';
		socketStatus.className = 'closed';
	});

	closeBtn.onclick = e => {
		e.preventDefault();
		reqHandler.close();
	};
//});
