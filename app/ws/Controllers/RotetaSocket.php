<?php

namespace App\Ws\Controllers;

use App\Models\Cart;
use App\Models\Product;
use App\Models\Suitcase;
use Ratchet\ConnectionInterface;
use App\Ws\Controllers\WsController;
use App\Http\Controllers\CartController;

class RotetaSocket  extends WsController
{


    public function onMessage(ConnectionInterface $from, $msg)
    {
        $response = ['error' => '44'];

        $data = json_decode($msg);

        if (!isset($data->type)) return;

        if ($data->type == 'spin' && isset($data->slug)) {


            $response = [
                'type' => 'spin',
                'uid' => $this->select_random_product($data->slug, $from->user)
            ];
        }

        if ($data->type == 'sell' && isset($data->id)) {

            $response = [
                'type' => 'sell',
                'sold' => $this->sell_item($data->id, $from->user)
            ];
        }
        foreach ($this->clients as $client) {
            // The sender is not the receiver, send to each client connected
            if ($from == $client) {
                $client->send(json_encode($response));
            }
        }
    }

    function sell_item($id, $user)
    {

        $cart = Cart::where('product_id', $id)->where('user_id', $user->id)->first();

        if (!$cart) return;

        $product = Product::find($cart->product_id);

        if ($product  && CartController::remove($product->id, $user->id)) {
            return $user->withdraw($product->price);
        }
    }

    function select_random_product($slug, $user)
    {

        $suitcase = Suitcase::where('slug', $slug)->with('products')->first();

        if ($suitcase) {
            // Get the products from the suitcase
            $products = $suitcase->products;

            if ($products->count() > 0) {
                // Shuffle the products randomly
                $products = $products->shuffle();

                // Sort the products by price in ascending order
                $products = $products->sortBy('price');

                // Get the first product (lowest price) after shuffling
                $randomProduct = $products->first();

                if ($randomProduct) {

                    CartController::add($randomProduct->id, $user->id);

                    $user->deposit($randomProduct->price);
                }

                return  $randomProduct->id;
            }
        }
    }
}
