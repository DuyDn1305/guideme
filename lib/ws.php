<?php
require('vendor/autoload.php');
use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;
use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;

$db = new mysqli('localhost', 'root', '', 'webchat')  or die('Falied while connecting to database');

class RequestHandler implements MessageComponentInterface {
	private $clients, $port;

	function __construct($port) {
		$this->clients = new SplObjectStorage;
		$this->port = $port;
	}

	function onOpen(ConnectionInterface $client) {
		$this->clients->attach($client);
	}

	function onMessage(ConnectionInterface $from, $req) {
		if ($req == '"[WS_SERVER]: STOP"') {
			global $db, $server;
			$db->query("UPDATE wsport SET status=0 WHERE port=$this->port");
			$server->loop->stop();
			return;
		}
		foreach ($this->clients as $client) {
			$client->send($req);
		}
	}

	function onClose(ConnectionInterface $from) {
		$this->clients->detach($from);
	}

	function onError(ConnectionInterface $from, Exception $e) {
		echo "An error has occurred: {$e->getMessage()}\n";
		$from->close();
	}
}

function openOnPort($port) {
	global $server;
	$server = IoServer::factory(new HttpServer(new WsServer(new RequestHandler($port))), $port);
	$server->run();
}

openOnPort(4000);

//$server->loop->addTimer(1, function);