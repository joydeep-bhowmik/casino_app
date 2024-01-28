<?php

use function Livewire\Volt\{state, title};

//
title('All Products');
?>

<div class="space-y-5">
    <x-breadcrumbs :arr="[
        [
            'label' => 'products',
        ],
    ]" />

    <a class="block" href="{{ route('admin.products.new') }}" wire:navigate>
        <x-primary-button> New product</x-primary-button>
    </a>

    <x-section title="products">
        <livewire:datatables.products-table lazy />
    </x-section>
</div>
