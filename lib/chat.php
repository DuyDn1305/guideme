<?php
require_once('connect.php');

if (!empty($_POST['chatkey'])) {
	echo json_encode(array(chat_instance_locator, chat_token));
	exit;
}

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