<?php

use App\Models\Game;
use Illuminate\Http\Request;
use function Livewire\Volt\{state, mount};

state(['id', 'name', 'thumbnail', 'description', 'url']);

mount(function (Request $request) {
    if ($request->id) {
        $this->id = $request->id;

        $game = Game::find($this->id);

        if (!$game) {
            abort(404);
        }

        $this->name = $game->name;

        $this->thumbnail = $game->thumbnail_url;

        $this->description = $game->description;

        $this->url = $game->url;
    }
});

$save = function () {
    $this->validate([
        'name' => 'required',
        'thumbnail' => 'required',
        'url' => 'nullable',
        'description' => 'nullable',
    ]);

    $game = new Game();

    if ($this->id) {
        $game = Game::find($this->id);
    }
    $game->name = $this->name;

    $game->url = $this->url;

    $game->thumbnail_url = $this->thumbnail;

    $game->description = $this->description;

    if ($game->save()) {
        return $this->dispatch('alert', type: 'success', message: 'Saved');
    }
};

$delete = function () {
    if (!$this->id) {
        return;
    }
    $game::find($this->id);

    if ($game->delete()) {
        return $this->dispatch('alert', type: 'danger', message: 'Game Deleted!');
    }
};

?>

<div class="space-y-5" x-data="{ imgUrl: $wire.thumbnail }">

    <x-breadcrumbs :arr="[
        [
            'label' => 'games',
            'link' => route('admin.games'),
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
        <x-secondary-button wire:loading.attr='disabled' wire:click='delete'>
            <span wire:loading.remove wire:target='delete'>delete</span>
            <span wire:loading wire:target='delete'>deleting...</span>
        </x-secondary-button>
    @endif

    <x-section>

        <div class="space-y-5">

            <livewire:choose-image target="#game-image" />

            <img class="w-96" src="" alt="" :src="imgUrl" x-show="imgUrl">

            <input class="hidden" id="game-image" type="text" wire:model='thumbnail' x-model="imgUrl">

            @error('thumbnail')
                <div class="text-sm text-red-500">{{ $message }}</div>
            @enderror

            <x-input label="Name" wire:model='name' :error="$errors->first('name')" />

            <x-input label="Url" wire:model='url' :error="$errors->first('url')" />

            <x-editor wire:model='description' :error="$errors->first('description')" />

        </div>

    </x-section>
</div>
