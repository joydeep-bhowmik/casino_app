<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;
use App\Models\Country;
use Illuminate\Http\Request;
use App\Models\ShippingAddress;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;
use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit/index', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'address' => $request->user()->address,
            'countries' => Country::all()
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }

    function updateAvatar(Request $request)
    {
        $request->validate(['avatars' => 'dimensions:min_width=184,min_height=184']);

        $file = $request->file('avatar');

        $user = $request->user();



        $filename = $user->id . time() . $file->getClientOriginalName();

        $path = $file->storeAs(
            'avatars',
            $filename,
            'public'
        );

        if ($path) {

            if ($user->avatar) {

                $existing_file = public_path('/storage/avatars/' . $user->avatar);

                if (file_exists($existing_file)) {
                    unlink($existing_file);
                }
            }

            $user->avatar = $filename;
            $user->save();
        }
    }

    function updateAddress(Request $request)
    {
        $user = $request->user();

        $country = Country::find($request->country_code);

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
            'phone_number' => 'required|phone:' . $country?->name
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
