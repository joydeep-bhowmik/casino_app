<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\ItemController;


class TestController extends Controller
{
    public function create(Request $request)
    {

        return ItemController::search(($request));
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

    function index()
    {
        return Inertia('Test');
    }
}
