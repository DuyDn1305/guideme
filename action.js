var messageButton = document.getElementById('mes-btn');
var chatContainer = document.getElementById('chat-container');

console.log(messageButton);
messageButton.addEventListener('click', showChat);

function showChat() {
  chatContainer.style.display = 'flex';
}