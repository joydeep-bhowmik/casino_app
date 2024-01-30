<?php

namespace App\Ws\Controllers;


use Ratchet\ConnectionInterface;

use App\Ws\Controllers\WsController;
use App\Http\Controllers\Games\CrashGameController;

class CrashSocket extends WsController
{
    public function onMessage(ConnectionInterface $from, $msg)
    {

        $response = [];
        $user = $from->user;
        if (!$user) {

            $response = ['error' => 'Login to play'];
        }

        $data = (object) json_decode($msg);


        if ($data->type == "start" && isset($data->bet)) {

            $game = new CrashGameController($data->bet, $user->id);
            $response = $game->start();
        }

        if ($data->type == "cashout" && isset($data->round_id)) {

            $response = CrashGameController::cashout(round_id: $data->round_id, user_id: $user->id);

            return $from->send(json_encode($response));
        }
        if ($data->type == "check" && isset($data->number, $data->round_id)) {

            $response = CrashGameController::check(number: $data->number, round_id: $data->round_id, user_id: $user->id);
        }



        $from->send(json_encode($response));
    }
}
