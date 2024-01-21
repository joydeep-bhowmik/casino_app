<?php

use App\Ws\Controllers\ChatSocket;
use App\Ws\Controllers\RotetaSocket;
use BeyondCode\LaravelWebSockets\Facades\WebSocketsRouter;

WebSocketsRouter::webSocket('/chat', ChatSocket::class);

WebSocketsRouter::webSocket('/roteta', RotetaSocket::class);
