<?php

use function Livewire\Volt\{state};

//

?>

<div class="space-y-5">
    <x-breadcrumbs :arr="[
        [
            'label' => 'Socials',
        ],
    ]" />

    <a class="block" href="{{ route('admin.socials.new') }}" wire:navigate>
        <x-primary-button> New social</x-primary-button>
    </a>

    <x-section title="socials">
        <livewire:datatables.socials-table />
    </x-section>
</div>
