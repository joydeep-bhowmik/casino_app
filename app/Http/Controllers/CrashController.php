<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class CrashController extends Controller
{
    function index(Request $request)
    {
        return Inertia::render('Games/Crash');
    }
}
