<?php

namespace App\Ws\Controllers;

use Ratchet\ConnectionInterface;
use App\Ws\Controllers\WsController;
use App\Http\Controllers\Games\RollGameController;

class RollSocket extends WsController
{


    public function onMessage(ConnectionInterface $from, $msg)
    {
        $data = (object)json_decode($msg);

        $response = [];

        $user = $from->user;

        if (!$user) {
            $response = ['error' => 'login'];
        }


        if ($data->type == 'start' && isset($data->bet, $data->item, $user) && is_int($data->bet)) {

            $game = new RollGameController(bet: $data->bet, item: $data->item, user_id: $user->id);

            $response = $game->start();
        }


        $from->send(json_encode($response));
    }
}
