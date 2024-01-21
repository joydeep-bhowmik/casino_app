<?php


use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TestController;

Route::get('/test', [TestController::class, 'create']);
Route::get('/test/start', [TestController::class, 'start']);
Route::get('/test/check', [TestController::class, 'check']);
Route::get('/test/get', [TestController::class, 'get']);
