<?php
	require_once('ws_impl.php');

	$port = 4000;
	$status = $db->query("SELECT status FROM wsport WHERE port=$port")->fetch_assoc()['status'];
	if (!$status) {
		$db->query("UPDATE wsport SET status=1 WHERE port=$port");
		openOnPort($port);
	}

	//$server->loop->addTimer(1, function);
?>