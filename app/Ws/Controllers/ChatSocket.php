<?php

namespace App\Ws\Controllers;

use Ratchet\ConnectionInterface;
use App\Ws\Controllers\WsController;

class ChatSocket  extends WsController
{


    public function onMessage(ConnectionInterface $from, $msg)
    {

        $user = $from->user;



        foreach ($this->clients as $client) {
            // The sender is not the receiver, send to each client connected
            $client->send('{"text":"' . substr($msg, 0, 100) . '", "time":"' . date('H:i') . '","user":' . json_encode($user) . '}');
        }
    }
}
