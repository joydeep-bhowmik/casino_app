<?php

use function Livewire\Volt\{state, title};

//
title('All Suitcases');

?>

<div class="space-y-5">
    <x-breadcrumbs :arr="[
        [
            'label' => 'suitcases',
        ],
    ]" />

    <a class="block" href="{{ route('admin.suitcases.new') }}" wire:navigate>
        <x-primary-button> New suitcase</x-primary-button>
    </a>

    <x-section title="Suitcases">
        <livewire:datatables.suitcases-table />
    </x-section>
</div>
