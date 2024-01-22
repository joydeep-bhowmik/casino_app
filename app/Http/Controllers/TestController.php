<?php

namespace App\Http\Controllers;

use App\Models\Round;
use Illuminate\Http\Request;
use App\Http\Controllers\Games\MinerGameController;

class TestController extends Controller
{
    function create(Request $request)
    {

        $column1 = [];
        $column2 = [];
        $column3 = [];
        $main_array = range(1, 9);

        // Shuffle the main array
        shuffle($main_array);

        // Assign the first three elements to $column1
        $column1 = array_slice($main_array, 0, 3);
        sort($column1);

        // Assign the next three elements to $column2
        $column2 = array_slice($main_array, 3, 3);
        sort($column2);

        // Assign the last three elements to $column3
        $column3 = array_slice($main_array, 6, 3);
        sort($column3);



        return response()->json(compact('column1', 'column2', 'column3'));
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
