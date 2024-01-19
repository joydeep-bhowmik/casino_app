<?php

use function Livewire\Volt\{state};

//

?>

<div class="space-y-5">
    <x-breadcrumbs :arr="[
        [
            'label' => 'pages',
        ],
    ]" />

    <a class="block" href="{{ route('admin.pages.new') }}" wire:navigate>
        <x-primary-button> New page</x-primary-button>
    </a>

    <x-section title="Pages">
        <livewire:datatables.pages-table />
    </x-section>
</div>
