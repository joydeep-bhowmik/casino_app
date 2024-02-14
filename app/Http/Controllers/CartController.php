<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Item;
use App\Models\User;
use Illuminate\Http\Request;

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


    static function remove($product_id, $user_id)
    {
        $user = User::find($user_id);
        if ($user) {
            $cart = Cart::where('product_id', $product_id)->first();
            return $cart->delete();
        }
    }

    function paginate(Request $request)
    {
        $user = $request->user();

        if (!$user) return $request->user();

        $carts = Cart::where('user_id', $user->id)->with(['product'])->paginate(2);

        return response()->json($carts);
    }

    function delete(Request $request)
    {

        $user = $request->user()->with(['carts.product'])->first();

        $carts = $user->carts;

        foreach ($request->items as $item) {

            $item = $carts->first(function ($cart) use ($item) {
                return $cart->id == $item['id'];
            });

            $item &&  $item->delete();
        }
    }

    function add_items_to_cart(Request $request)
    {

        $items = $request->items;
        $user = $request->user();

        foreach ($items as $item) {


            $existing_item = Item::where('id', $item['id'])->where('user_id', $user->id)->first();

            if (!$existing_item) return response()->json(['error' => 'Item not found'], 422);

            $cart = new Cart();

            $cart->user_id = $user->id;

            $cart->product_id = $existing_item->product->id;

            $cart->quantity = 1;
            //adding to cart
            if ($cart->save()) {

                //removing from item
                $existing_item->delete();
            }
        }

        return response()->json([
            'items' => $user->items,
            'carts' => $user->carts,

        ]);
    }
}
