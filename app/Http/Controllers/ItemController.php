<?php

namespace App\Http\Controllers;

use App\Models\Item;
use Inertia\Inertia;
use Illuminate\Http\Request;

class ItemController extends Controller
{
    function index(Request $request)
    {
        return Inertia::render('MyItems/index');
    }

    public static function search(Request $request)
    {
        $key = $request->input('key');
        $sort_by = $request->input('sortBy');
        $min_price = $request->input('minPrice');
        $max_price = $request->input('maxPrice');

        $items = Item::query()->with(['product' => function ($query) use ($request) {
            if ($request->has('sortBy') && $request->sortBy === 'lowToHigh') {
                $query->orderBy('price', 'asc');
            } elseif ($request->has('sortBy') && $request->sortBy === 'highToLow') {
                $query->orderBy('price', 'desc');
            }
        }]);
        if ($min_price !== null && $max_price !== null) {
            $items->whereHas('product', function ($query) use ($min_price, $max_price) {
                $query->whereBetween('price', [$min_price, $max_price]);
            });
        } elseif ($min_price !== null) {
            $items->whereHas('product', function ($query) use ($min_price) {
                $query->where('price', '>=', $min_price);
            });
        } elseif ($max_price !== null) {
            $items->whereHas('product', function ($query) use ($max_price) {
                $query->where('price', '<=', $max_price);
            });
        }

        if ($key) {
            $items->whereHas('product', function ($query) use ($key) {
                $query->where('name', 'like', '%' . $key . '%');
            });
        }

        $results = $items->paginate(10);

        return $results;
    }

    function sellitems(Request $request)
    {

        $user = $request->user()->with(['items.product'])->first();

        $items = $user->items;

        $soldItems = collect();

        foreach ($request->items as $i) {

            $item = $items->first(function ($item) use ($i) {
                return $item->id == $i['id'];
            });

            if (
                $item
                && $item->product->price
                && $user->deposit($item->product->price)
            ) {
                $soldItems->push($item);
                $item->delete();
            }
        }


        return response()->json([
            'balance' => $user->balanceInt,
            'success' =>  count($soldItems) ? true : false,
            'itemsSold' => $soldItems
        ]);
    }
}
