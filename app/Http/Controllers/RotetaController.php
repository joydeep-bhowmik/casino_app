<?php

namespace App\Http\Controllers;

use App\Models\Suitcase;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RotetaController extends Controller
{
    function index(Request $request)
    {
        $suitcase = Suitcase::where('slug', $request->slug)->with('products')->first();

        $recomended_suitcase = Suitcase::where('id', '!=', $suitcase->id)->get();

        return Inertia::render('Games/Roteta/index', compact('suitcase', 'recomended_suitcase'));
    }
}
