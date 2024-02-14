<?php

namespace App\Http\Controllers;


use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Controllers\ProductController;

class DealsController extends Controller
{
    function index(Request $request)
    {

        return Inertia::render('Games/Deals/index');
    }
}
