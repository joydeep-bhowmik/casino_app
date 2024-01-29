<?php

namespace App\Ws\Controllers;

use App\Http\Controllers\Games\MinerGameController;
use Ratchet\ConnectionInterface;
use App\Ws\Controllers\WsController;

class MinerSocket extends WsController
{


    public function onMessage(ConnectionInterface $from, $msg)
    {
        $data = (object)json_decode($msg);
        $response = [];

        $user = $from->user;

        if (!$user) {
            $response = ['error' => 'Login'];
        }

        if ($data->type == 'start' && !in_array(null, [$data->bet, $data->mines, $user])) {

            $game = new MinerGameController(bet: $data->bet, mines: $data->mines, user_id: $user->id);

            $response = $game->start();
        }

        if ($data->type == 'check' && !in_array(null, [$data->number, $data->round_id, $from->user])) {

            $check = MinerGameController::check(number: $data->number, round_id: $data->round_id, user_id: $user->id);

            $response = $check;
        }

        $from->send(json_encode($response));
    }
}
