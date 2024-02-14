<?php

namespace App\Http\Controllers\Games;

use App\Http\Controllers\Controller;

class BaseGameController extends Controller
{

    function success(string $message, array $data = []): array
    {
        return $this->response(message: $message, type: 'success', data: $data);
    }

    function error(string $message, array $data = []): array
    {
        return $this->response(message: $message, type: 'error', data: $data);
    }


    function response(string $message, string $type = 'success', array $data = []): array
    {
        return ['response' => [
            'message' => $message,
            'type' => $type,
            'data' => $data
        ]];
    }
}
