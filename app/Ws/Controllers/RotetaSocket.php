<?php

namespace App\Ws\Controllers;

use App\Models\item;
use App\Models\User;
use App\Models\Product;
use App\Models\Suitcase;
use Ratchet\ConnectionInterface;
use App\Ws\Controllers\WsController;
use App\Http\Controllers\itemController;

class RotetaSocket  extends WsController
{


    public function onMessage(ConnectionInterface $from, $msg)
    {
        $response = ['error' => '44'];

        $data = json_decode($msg);

        $user = User::find($from->user?->id);

        if (!isset($data->type)) return;


        if ($data->type == 'spin' && isset($data->slug)) {

            $randomProduct = $this->select_random_product($data->slug, $user);

            if ($randomProduct) {

                $user->deposit($randomProduct->price);
            }
            $response = [
                'type' => 'spin',
                'uid' => $randomProduct?->id,
            ];
        }

        if ($data->type == 'sell' && isset($data->id)) {

            $response = [
                'type' => 'sell',
                'sold' => $this->sell_item($data->id, $user),
                'balance' => $user->balanceInt
            ];
        }
        $from->send(json_encode($response));
    }

    function sell_item($id, $user)
    {

        $item = Item::where('product_id', $id)->where('user_id', $user->id)->first();

        if (!$item) return;

        $product = Product::find($item->product_id);
        $item = Item::where('product_id', $product->id)->where('user_id', $user->id)->first();


        if ($product &&   $item  &&   $item->delete()) {

            return $user->deposit($product->price);
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

                    $item = new Item();
                    $item->product_id = $randomProduct->id;
                    $item->user_id = $user->id;
                    $item->save();;
                }

                return  $randomProduct;
            }
        }
    }
}
