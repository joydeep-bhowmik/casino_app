<?php

namespace App\Ws\Controllers;


use Exception;
use App\Models\User;
use SplObjectStorage;
use Ratchet\ConnectionInterface;
use Illuminate\Support\Facades\DB;

use Illuminate\Support\Facades\Crypt;
use Illuminate\Session\SessionManager;
use Illuminate\Support\Facades\Config;
use BeyondCode\LaravelWebSockets\Apps\App;
use Ratchet\WebSocket\MessageComponentInterface;


class WsController  implements MessageComponentInterface
{
    protected $clients;



    public final function __construct()
    {
        $this->clients = new SplObjectStorage;
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



        echo "New connection! ({$conn->resourceId})\n";
    }

    public function onMessage(ConnectionInterface $from, $msg)
    {
    }

    public final function onClose(ConnectionInterface $conn)
    {
        // The connection is closed, remove it, as we can no longer send it messages
        $this->clients->detach($conn);

        echo "Connection {$conn->resourceId} has disconnected\n";
    }

    public final function onError(ConnectionInterface $conn, \Exception $e)
    {
        echo "An error has occurred: {$e->getMessage()}\n";

        $conn->close();
    }


    final function authenticate(ConnectionInterface $conn, $token)
    {

        $token = DB::table('personal_access_tokens')->where('token', $token)->first();

        $user =  $token ? User::find($token->tokenable_id) : null;


        return $user;
    }

    protected function getUser(ConnectionInterface $conn)
    {
        // Check if the connection exists in SplObjectStorage
        if ($this->clients->contains($conn)) {
            // Get the user data associated with the connection
            $userData = $this->clients->offsetGet($conn);

            // Return the user object
            return $userData->user;
        }

        // Return null or handle the case where the connection is not found
        return null;
    }
}
