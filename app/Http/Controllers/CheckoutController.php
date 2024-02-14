<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    function index(Request $request)
    {
        $user = $request->user()?->with('carts.product')->first();
        $carts = $user->carts;
        $address = $user->address;
        return Inertia::render('Checkout/index', compact('carts', 'address'));
    }
}
