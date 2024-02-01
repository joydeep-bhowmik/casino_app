<?php

use function Livewire\Volt\{state, title};

//
title('All Countries');

?>

<div class="space-y-5">
    <x-breadcrumbs :arr="[
        [
            'label' => 'Countries',
        ],
    ]" />

    <a class="block" href="{{ route('admin.countries.new') }}" wire:navigate>
        <x-primary-button> New country</x-primary-button>
    </a>

    <x-section title="countries">
        <livewire:datatables.countries-table lazy />
    </x-section>
</div>
