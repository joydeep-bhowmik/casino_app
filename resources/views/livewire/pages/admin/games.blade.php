<?php

use function Livewire\Volt\{state, title};

//
title('All games');

?>

<div class="space-y-5">
    <x-breadcrumbs :arr="[
        [
            'label' => 'games',
        ],
    ]" />

    <a class="block" href="{{ route('admin.games.new') }}" wire:navigate>
        <x-primary-button> New game</x-primary-button>
    </a>

    <x-section title="Games">
        <livewire:datatables.games-table lazy />
    </x-section>
</div>
