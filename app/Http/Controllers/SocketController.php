<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use BeyondCode\LaravelWebSockets\Apps\App;

class SocketController extends Controller
{
    static function configure($conn)
    {
    }
    function create(Request $request)
    {
        $cookieName = 'ws-token';

        // Get the value of the cookie by its name
        $cookieValue = request()->cookie($cookieName);

        if ($cookieValue) {
            // Cookie found, you can use $cookieValue as needed
            return response("Cookie value: $cookieValue");
        } else {
            // Cookie not found
            return response('Cookie not found');
        }
    }
}
