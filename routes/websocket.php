<?php

use App\ws\ChatSocket;
use BeyondCode\LaravelWebSockets\Facades\WebSocketsRouter;

WebSocketsRouter::webSocket('/chat', ChatSocket::class);
