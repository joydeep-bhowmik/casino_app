<?php

namespace App\Ws\Controllers;



use App\Models\User;
use SplObjectStorage;
use Ratchet\ConnectionInterface;
use Illuminate\Support\Facades\DB;

use BeyondCode\LaravelWebSockets\Apps\App;
use Ratchet\WebSocket\MessageComponentInterface;


class WsController  implements MessageComponentInterface
{
    protected $clients;

    public final function __construct()
    {
        $this->clients = new SplObjectStorage;
        $this->withConstruct();
    }

    public final function onOpen(ConnectionInterface $conn)
    {
        // Store the new connection to send messages to later
        $socketId = sprintf('%d.%d', random_int(1, 1000000000), random_int(1, 1000000000));

        $conn->socketId = $socketId;

        $conn->app = App::findById(env('PUSHER_APP_ID'));


        $querystring = $conn->httpRequest->getUri()->getQuery();

        parse_str($querystring, $queryarray);

        $token = $queryarray['token'] ?? null;

        $user = $token ? $this->authenticate($conn, $token) : null;

        $conn->user = $user;

        $this->clients->attach($conn);

        $this->withOnOpen($conn);

        echo "New connection! ({$conn->resourceId})\n";
    }

    public function onMessage(ConnectionInterface $from, $msg)
    {
    }

    public final function onClose(ConnectionInterface $conn)
    {
        // The connection is closed, remove it, as we can no longer send it messages
        $this->clients->detach($conn);

        $this->withOnClsoe($conn);

        echo "Connection {$conn->resourceId} has disconnected\n";
    }

    public final function onError(ConnectionInterface $conn, \Exception $e)
    {
        $message = "An error has occurred: {$e->getMessage()}";
        $message .= " in {$e->getFile()} on line {$e->getLine()}\n";

        echo $message;

        $this->withOnError($conn);

        $conn->close();
    }

    final function authenticate(ConnectionInterface $conn, $token)
    {

        $token = DB::table('personal_access_tokens')->where('token', $token)->first();

        $user =  $token ? User::find($token->tokenable_id) : null;


        return $user;
    }



    function withOnOpen(ConnectionInterface $conn)
    {
    }
    function withOnClsoe(ConnectionInterface  $conn)
    {
    }
    function withOnError(ConnectionInterface  $conn)
    {
    }
    function withConstruct()
    {
    }


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
