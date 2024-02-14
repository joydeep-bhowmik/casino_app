<?php

namespace App\Ws\Controllers;

use Ratchet\ConnectionInterface;
use App\Ws\Controllers\WsController;
use App\Http\Controllers\Games\DealsGameController;

class DealsSocket extends WsController
{


    public function onMessage(ConnectionInterface $from, $msg)
    {
        $data = (object)json_decode($msg);

        $response = [];

        $user = $from->user;

        if (!$user) {
            $response = $this->error('Login To Play');
        }

        if ($data->type == 'test') {
            $response = ['message' => 'test recieved'];
        }

        if (isset($data, $data->type, $data->product_id, $data->chance) && $data->type == 'start' && $user) {

            $game = new DealsGameController(user_id: $user->id, product_id: $data->product_id, chance: $data->chance);

            $response = $game->start();
        }


        $from->send(json_encode($response));
    }
}
