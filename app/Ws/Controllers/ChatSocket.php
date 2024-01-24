<?php

namespace App\Ws\Controllers;

use Ratchet\ConnectionInterface;
use App\Ws\Controllers\WsController;

class ChatSocket  extends WsController
{


    public function onMessage(ConnectionInterface $from, $msg)
    {
        foreach ($this->clients as $client) {
            // The sender is not the receiver, send to each client connected
            $client->send($msg . json_encode($from->data));
        }
    }
}
