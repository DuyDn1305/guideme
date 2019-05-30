<?php
	require_once('ws_impl.php');

	if (isset($_POST['open'])) {
		$port = (int)$_POST['open'];
		$status = $db->query("SELECT status FROM wsport WHERE port=$port")->fetch_assoc()['status'];
		if (!$status) {
			$db->query("UPDATE wsport SET status=1 WHERE port=$port");
			openOnPort($port);
		}
	}

	//$server->loop->addTimer(1, function);
?>