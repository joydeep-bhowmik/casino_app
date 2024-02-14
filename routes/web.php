<?php

use Inertia\Inertia;

use Livewire\Volt\Volt;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\KenoController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\RollController;
use App\Http\Controllers\CrashController;
use App\Http\Controllers\DealsController;
use App\Http\Controllers\MinerController;
use App\Http\Controllers\TowerController;
use App\Http\Controllers\PlinkoController;
use App\Http\Controllers\RotetaController;
use App\Http\Controllers\SocketController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SuitcaseController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
// return Inertia::render('Welcome', [
//     'canLogin' => Route::has('login'),
//     'canRegister' => Route::has('register'),
//     'laravelVersion' => Application::VERSION,
//     'phpVersion' => PHP_VERSION,
// ]);

Route::get('/', [HomeController::class, 'index']);



Route::get('/get-token', [SocketController::class, 'create']);

Volt::route('listen', 'websocket');

Route::get('/pages/{slug}', [PageController::class, 'index']);

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::prefix('games')->group(function () {
    Route::post('all', [HomeController::class, 'games'])->name('games.all');

    Route::get('roteta/{slug}', [RotetaController::class, "index"])->name('games.roteta');

    Route::get('miner', [MinerController::class, "index"])->name('games.miner');

    Route::get('crash', [CrashController::class, "index"])->name('games.crash');

    Route::get('keno', [KenoController::class, "index"])->name('games.keno');

    Route::get('tower', [TowerController::class, "index"])->name('games.tower');

    Route::get('plinko', [PlinkoController::class, "index"])->name('games.plinko');

    Route::get('roll', [RollController::class, "index"])->name('games.roll');

    Route::get('deals', [DealsController::class, "index"])->name('games.deals');
});

Route::get('/my-items', [ItemController::class, 'index'])->name('my.items');

Route::any('/user-balance', function (Request $request) {
    return $request->user()?->balanceInt;
});
Route::any('/add-user-balance', function (Request $request) {

    return $request->user()?->deposit($request->amount ?? 100) ? $request->user()?->balanceInt : '';
});

Route::post('products', [ProductController::class, 'search'])->name('products.search');

Route::post('items', [ItemController::class, 'search'])->name('items.search');

Route::post('livedrops/all', [SuitcaseController::class, 'livedrop_paginate'])->name('livedrops.paginate');

Route::get('suitcases', [SuitcaseController::class, 'index'])->name('suitcases.paginate');


Route::middleware('auth')->group(function () {

    Route::post('carts', [CartController::class, 'paginate'])->name('carts.paginate');

    Route::post('sell-items', [ItemController::class, 'sellItems'])->name('items.sell');

    Route::post('delete-carts', [CartController::class, 'delete'])->name('carts.delete');

    Route::post('add-to-cart', [CartController::class, 'add'])->name('carts.add');

    Route::post('add-items-to-cart', [CartController::class, 'add_items_to_cart'])->name('carts.add-valid-items');

    Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout');
});

require __DIR__ . '/auth.php';
require __DIR__ . '/websocket.php';
require __DIR__ . '/test.php';
require __DIR__ . '/admin.php';
