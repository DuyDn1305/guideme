<?php
require_once('connect.php');

if (isset($_POST['createUser'])) {
	$data = $_POST['createUser'];
	$chatkit->createUser([
		'id' => $data['uniqueId'],
		'name' => $data['name']
	]);
	exit;
}

if (isset($_POST['deleteUser'])) {
	$chatkit->deleteUser(['id' => $_POST['deleteUser']]);
	exit;
}

if (isset($_POST['deleteMsg'])) {
	$chatkit->deleteMessage(['id' => $_POST['deleteMsg']]);
	exit;
}

if (isset($_POST['exist'])) {
	$id1 = $_POST['exist']['id1'];
	$id2 = $_POST['exist']['id2'];
	if (strcmp($id1, $id2) > 0) swap($id1, $id2);
	$res = $db->query("SELECT roomId from user WHERE id1='$id1' AND id2='$id2'");
	if (!$res->num_rows) echo 0;
	else echo $res->fetch_assoc()['roomId'];
	exit;
}

if (isset($_POST['mark'])) {
	$id1 = $_POST['mark']['id1'];
	$id2 = $_POST['mark']['id2'];
	$roomId = $_POST['mark']['roomId'];
	if (strcmp($id1, $id2) > 0) swap($id1, $id2);
	$db->query("INSERT INTO user VALUES ('$id1', '$id2', '$roomId')");
	exit;
}