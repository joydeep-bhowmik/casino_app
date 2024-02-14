<?php

namespace App\Http\Controllers;

use App\Models\Suitcase;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SuitcaseController extends Controller
{
    function index()
    {
        return Inertia::render('Suitcases/index');
    }
    function livedrop_paginate(Request $request)
    {
        $searchTerm = $request->key;
        $sortBy = $request->sortBy;
        $flag = $request->flag;

        $query = Suitcase::with('products');


        if ($searchTerm) {
            $searchTerms = explode(' ', $searchTerm);
            $query->where(function ($query) use ($searchTerms) {
                foreach ($searchTerms as $term) {
                    $query->orWhere('name', 'like', '%' . $term . '%');
                }
            });
        }



        if ($sortBy && $sortBy === 'lowToHigh') {
            $query->orderBy('price', 'asc');
        } elseif ($sortBy && $sortBy === 'highToLow') {
            $query->orderBy('price', 'desc');
        }

        if ($flag) {
            $query->where('flag', $flag);
        }

        $suitcases =  $query->paginate(10);



        return response()->json($suitcases);
    }
}
