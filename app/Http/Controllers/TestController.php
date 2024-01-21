<?php

namespace App\Http\Controllers;

use App\Models\Round;
use Illuminate\Http\Request;
use App\Http\Controllers\Games\MinerGameController;

class TestController extends Controller
{
    function create(Request $request)
    {
    }

    function check(Request $request)
    {
        return  MinerGameController::check(round_id: $request->round, user_id: 1, number: $request->number);
    }

    function get(Request $request)
    {
        return   Round::find($request->id);
    }


    function start(Request $request)
    {

        $user = $request->user();
        $game = new MinerGameController(bid: 22, mines: 5, user_id: 1);
        return $game->start();
    }
}
