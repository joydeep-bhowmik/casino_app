<?php

namespace App\Http\Controllers;

use App\Models\ShippingAddress;
use Illuminate\Http\Request;

class ShippingController extends Controller
{
    function updateAddress(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'first_name' => 'required',
            'last_name' => 'required',
            'address_1' => 'required',
            'address_2' => 'nullable',
            'pin_code' => 'required',
            'city' => 'required',
            'state' => 'required',
            'country' => 'required',
            'country_code' => 'required',
            'phone_number' => 'required'
        ]);

        $address = ShippingAddress::where('user_id', $user->id)->first();

        if (!$address) {

            $address = new ShippingAddress();

            $address->user_id = $user->id;
        }

        $address->first_name = $request->first_name;

        $address->last_name = $request->last_name;

        $address->address_1 = $request->address_1;

        $address->address_2 = $request->address_2;

        $address->pin_code = $request->pin_code;

        $address->city = $request->city;

        $address->state = $request->state;

        $address->country = $request->country;

        $address->country_code = $request->country_code;

        $address->phone_number = $request->phone_number;

        $address->save();
    }
}
