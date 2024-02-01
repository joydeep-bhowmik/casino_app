<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class KenoController extends Controller
{
    function index(Request $request)
    {
        return Inertia::render('Games/Keno/index');
    }
}
