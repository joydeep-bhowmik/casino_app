<?php

namespace App\Http\Controllers\Games;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class CrashGameController extends Controller
{
    function _validate(array $arr)
    {
        $arr = (object)$arr;
    }
}
