<?php

use function Livewire\Volt\{state};

//

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

    <x-section title="suitcases">
        <livewire:datatables.suitcases-table />
    </x-section>
</div>
