<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class RollController extends Controller
{
    function index(Request $request)
    {
        return Inertia::render('Games/Roll/index');
    }
}
