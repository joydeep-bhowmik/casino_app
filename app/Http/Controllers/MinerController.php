<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class MinerController extends Controller
{
    function index(Request $request)
    {

        return Inertia::render('Games/Miner');
    }
}
