<?php

namespace App\Http\Controllers;

use App\Models\Game;
use Inertia\Inertia;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public string  $bannel_url;

    function index()
    {
        return Inertia::render('Home/index', [
            'games' => Game::all()
        ]);
    }
    function get_banner()
    {
    }
}
