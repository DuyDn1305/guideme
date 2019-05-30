<?php
	require('vendor/autoload.php');
	use Ratchet\MessageComponentInterface;
	use Ratchet\ConnectionInterface;
	use Ratchet\Server\IoServer;
	use Ratchet\Http\HttpServer;
	use Ratchet\WebSocket\WsServer;

	require_once('connect.php');

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
			foreach ($this->clients as $client) {
				$client->send($req);
			}
		}

		function onClose(ConnectionInterface $from) {
			$this->clients->detach($from);
			if (!$this->clients->count()) {
				global $db, $server;
				$db->query("UPDATE server SET status=0 WHERE port=$this->port");
				$server->loop->stop();
			}
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
?>