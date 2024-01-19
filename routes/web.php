<?php

use App\Models\Game;
use App\Models\Page;
use Inertia\Inertia;
use Livewire\Volt\Volt;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProfileController;

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

$pages = Page::all();

foreach ($pages as $page) {
    Route::get($page->slug, function () use ($page) {
        return  Inertia::render('Page', compact('page'));
    });
}

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');


Route::prefix('admin')->middleware('auth')->group(function () {

    Volt::route('/', 'pages.admin.dashboard')->name('admin.dashboard');

    Route::prefix('games')->group(function () {

        Volt::route('/', 'pages.admin.games')->name('admin.games');

        Volt::route('new', 'pages.admin.save-game')->name('admin.games.new');

        Volt::route('edit/{id}', 'pages.admin.save-game')->name('admin.games.edit');
    });


    Route::prefix('pages')->group(function () {

        Volt::route('/', 'pages.admin.pages')->name('admin.pages');

        Volt::route('new', 'pages.admin.save-page')->name('admin.pages.new');

        Volt::route('edit/{id}', 'pages.admin.save-page')->name('admin.pages.edit');
    });

    Route::prefix('socials')->group(function () {

        Volt::route('/', 'pages.admin.socials')->name('admin.socials');

        Volt::route('new', 'pages.admin.save-social')->name('admin.socials.new');

        Volt::route('edit/{id}', 'pages.admin.save-social')->name('admin.socials.edit');
    });
});
require __DIR__ . '/auth.php';
