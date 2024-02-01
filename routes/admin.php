<?php

use Livewire\Volt\Volt;

use Illuminate\Support\Facades\Route;

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

    Route::prefix('suitcases')->group(function () {

        Volt::route('/', 'pages.admin.suitcases')->name('admin.suitcases');

        Volt::route('new', 'pages.admin.save-suitcase')->name('admin.suitcases.new');

        Volt::route('edit/{id}', 'pages.admin.save-suitcase')->name('admin.suitcases.edit');
    });


    Route::prefix('products')->group(function () {

        Volt::route('/', 'pages.admin.products')->name('admin.products');

        Volt::route('new', 'pages.admin.save-product')->name('admin.products.new');

        Volt::route('edit/{id}', 'pages.admin.save-product')->name('admin.products.edit');
    });


    Route::prefix('orders')->group(function () {

        Volt::route('/', 'pages.admin.orders')->name('admin.orders');

        Volt::route('new', 'pages.admin.save-order')->name('admin.orders.new');

        Volt::route('edit/{id}', 'pages.admin.save-order')->name('admin.orders.edit');
    });

    Route::prefix('countries')->group(function () {

        Volt::route('/', 'pages.admin.countries')->name('admin.countries');

        Volt::route('new', 'pages.admin.save-country')->name('admin.countries.new');

        Volt::route('edit/{id}', 'pages.admin.save-country')->name('admin.countries.edit');
    });
});
