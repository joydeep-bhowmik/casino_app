<?php

use App\Models\Social;
use Illuminate\Http\Request;
use function Livewire\Volt\{state, mount};

state(['id', 'name', 'url', 'link']);

mount(function (Request $request) {
    if ($request->id) {
        $this->id = $request->id;

        $social = Social::find($this->id);

        if (!$social) {
            abort(404);
        }

        $this->name = $social->name;

        $this->url = $social->image_url;

        $this->link = $social->link;
    }
});

$save = function () {
    $this->validate([
        'name' => 'required',
        'link' => 'required',
        'url' => 'required',
    ]);

    $social = new Social();

    if ($this->id) {
        $social = Social::find($this->id);
    }
    $social->name = $this->name;

    $social->image_url = $this->url;

    $social->link = $this->link;

    if ($social->save()) {
        return $this->dispatch('alert', type: 'success', message: 'Saved');
    }
};

$delete = function () {
    if (!$this->id) {
        return;
    }
    $social = Social::find($this->id);

    if ($social->delete()) {
        return $this->dispatch('alert', type: 'danger', message: 'social Deleted!');
    }
};

?>

<div class="space-y-5" x-data="{ imgUrl: $wire.url }">

    <x-breadcrumbs :arr="[
        [
            'label' => 'Socials',
            'link' => route('admin.socials'),
        ],
        [
            'label' => $id ? 'Edit' : 'Create',
        ],
    ]" />

    <x-primary-button wire:loading.attr='disabled' wire:click='save'>
        <span wire:loading.remove wire:target='save'>Save</span>
        <span wire:loading wire:target='save'>saving...</span>
    </x-primary-button>

    @if ($id)
        <x-secondary-button wire:loading.attr='disabled' wire:x-confirm="Are you sure?" wire:click='delete'>
            <span wire:loading.remove wire:target='delete'>delete</span>
            <span wire:loading wire:target='delete'>deleting...</span>
        </x-secondary-button>
    @endif

    <x-section>

        <div class="space-y-5">

            <livewire:choose-image target="#social-image" />

            <img class="w-96" src="" alt="" :src="imgUrl" x-show="imgUrl">

            <input class="hidden" id="social-image" type="text" wire:model='url' x-model="imgUrl">

            @error('thumbnail')
                <div class="text-sm text-red-500">{{ $message }}</div>
            @enderror

            <x-input label="Name" wire:model='name' :error="$errors->first('name')" />

            <x-input label="Link" wire:model='link' :error="$errors->first('link')" />

        </div>

    </x-section>
</div>
