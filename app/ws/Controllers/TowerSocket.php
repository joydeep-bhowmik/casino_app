<?php

namespace App\Ws\Controllers;

use Ratchet\ConnectionInterface;
use App\Ws\Controllers\WsController;
use App\Http\Controllers\Games\TowerGameController;

class TowerSocket extends WsController
{


    public function onMessage(ConnectionInterface $from, $msg)
    {
        $data = (object)json_decode($msg);
        $response = [];

        $user = $from->user;

        if (!$user) {
            $response = ['error' => 'Login'];
        }

        if ($data->type == 'start' && $user) {

            $game = new TowerGameController(bet: $data->bet, user_id: $user->id);

            $response = $game->start();
        }

        if ($data->type == 'check' && !in_array(null, [$data->number, $data->round_id, $from->user])) {

            $check = TowerGameController::check(number: $data->number, round_id: $data->round_id, user_id: $user->id);

            $response = $check;
        }

        foreach ($this->clients as $client) {
            if ($from == $client) {
                $client->send(json_encode($response));
            }
        }
    }
}
