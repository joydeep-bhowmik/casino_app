<?php

use function Livewire\Volt\{state, title};

//
title('All Orders');

?>

<div class="space-y-5">
    <x-breadcrumbs :arr="[
        [
            'label' => 'Orders',
        ],
    ]" />

    <a class="block" href="{{ route('admin.orders.new') }}" wire:navigate>
        <x-primary-button> New Order</x-primary-button>
    </a>

    <x-section title="Orders">
        <livewire:datatables.orders-table lazy />
    </x-section>
</div>
