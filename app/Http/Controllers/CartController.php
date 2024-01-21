<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    static function add($product_id, $user_id)
    {
        $user = User::find($user_id);
        if ($user) {
            $cart = new Cart();
            $cart->product_id = $product_id;
            $cart->quantity = 1;
            $cart->user_id = $user->id;
            return $cart->save();
        }
    }

    static    function remove($product_id, $user_id)
    {
        $user = User::find($user_id);
        if ($user) {
            $cart = Cart::where('product_id', $product_id)->first();
            return $cart->delete();
        }
    }
}
