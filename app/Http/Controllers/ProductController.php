<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public static function search(Request $request)
    {
        $key = $request->input('key');

        $sort_by = $request->input('sortBy');

        $min_price = $request->input('minPrice');

        $max_price = $request->input('maxPrice');

        $products = Product::query();

        if ($sort_by === 'lowToHigh') {

            $products->orderBy('price', 'asc');
        } elseif ($sort_by === 'highToLow') {

            $products->orderBy('price', 'desc');
        }

        if ($min_price !== null && $max_price !== null) {

            $products->whereBetween('price', [$min_price, $max_price]);
        } elseif ($min_price !== null) {

            $products->where('price', '>=', $min_price);
        } elseif ($max_price !== null) {

            $products->where('price', '<=', $max_price);
        }

        if ($key) {

            $keywords = explode(' ', $key);


            $products->where(function ($query) use ($keywords) {

                foreach ($keywords as $word) {

                    $query->orWhere('name', 'like', '%' . $word . '%');
                }
            });
        }


        $result = $products->paginate(1);

        return response()->json($result);
    }
}
