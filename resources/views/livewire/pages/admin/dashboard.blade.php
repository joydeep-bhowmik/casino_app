<?php

use App\Models\Game;
use App\Models\User;
use App\Models\Product;
use App\Models\Suitcase;
use function Livewire\Volt\{state, title, with};

title('dashboard');

//
with(function () {
    $games = Game::count();
    $users = User::count();
    $suitcases = Suitcase::count();
    $products = Product::count();

    $counts = compact('games', 'users', 'suitcases', 'products');

    return compact('counts');
});
?>

<div class="space-y-5">

    <x-breadcrumbs :arr="[
        [
            'label' => 'dashboard',
        ],
    ]" />

    <div class="gap-5 space-y-5 md:columns-2">
        @foreach ($counts as $key => $value)
            <x-section class="break-inside-avoid-column" :title="$key">
                <h2 class="text-4xl font-bold">{{ $value }}</h2>
            </x-section>
        @endforeach
    </div>
</div>
