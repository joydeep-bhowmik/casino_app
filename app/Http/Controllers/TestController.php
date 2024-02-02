<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Round;
use Illuminate\Http\Request;
use App\Http\Controllers\Games\MinerGameController;

class TestController extends Controller
{
    function create(Request $request)
    {
        $user = User::first();

        //getBalanceIntAttribute()
        return response()->json($user->balanceInt);
    }

    function check(Request $request)
    {
    }

    function get(Request $request)
    {
    }


    function start(Request $request)
    {
    }
}
