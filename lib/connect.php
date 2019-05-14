<?php
require_once('vendor/autoload.php');

$db = new mysqli('localhost', 'root', '', 'webchat')  or die('Falied while connecting to database');

const chat_instance_locator = 'v1:us1:c2c8e696-a9e8-407b-934b-5baa4fb0f4d0';
const chat_key = '5c26174d-8c83-436d-81d7-b9c012bd9b13:MKu5L3BHq8QdBKOnzhVwLyRHAzw6p+S4pySmKkdNW1E=';
const chat_token = 'https://us1.pusherplatform.io/services/chatkit_token_provider/v1/c2c8e696-a9e8-407b-934b-5baa4fb0f4d0/token';

$chatkit = new Chatkit\Chatkit([
	'instance_locator' => chat_instance_locator,
	'key' => chat_key
]);

function swap(&$x, &$y) {
	$tmp = $x; $x = $y; $y = $tmp;
}

function vardump($var) {
	echo '<pre>'; print_r($var); echo '<pre>';
}
