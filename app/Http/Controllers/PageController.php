<?php

namespace App\Http\Controllers;

use App\Models\Page;
use Inertia\Inertia;
use Illuminate\Http\Request;

class PageController extends Controller
{
    function index(Request $request)
    {
        $page = Page::where('slug', $request->slug)->first();
        return  Inertia::render('Page/index', compact('page'));
    }
}
