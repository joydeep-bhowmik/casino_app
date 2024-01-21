<?php

use App\Models\Game;
use Illuminate\Http\Request;
use function Livewire\Volt\{state, mount, title};

state(['id', 'name', 'slug', 'thumbnail', 'description', 'uid', 'url']);

title(fn() => 'Game' . ' ' . ($this->id ? 'Update ' . $this->id : 'Create'));

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

        $this->uid = $game->uid;

        $this->slug = $game->slug;
    }
});

$save = function () {
    $this->validate([
        'name' => 'required',
        'thumbnail' => 'required',
        'slug' => 'required|alpha_dash|max:255,unique:games,slug,' . $this->id,
        'uid' => 'required|alpha_dash|max:255,unique:games,uid,' . $this->id,
        'url' => 'nullable',
        'description' => 'nullable',
    ]);

    $game = new Game();

    if ($this->id) {
        $game = Game::find($this->id);
    }
    $game->name = $this->name;

    $game->url = $this->url;

    $game->slug = $this->slug;

    $game->thumbnail_url = $this->thumbnail;

    $game->description = $this->description;

    $game->uid = $this->uid;

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
        <x-secondary-button wire:loading.attr='disabled' wire:x-confirm="Are you sure?" wire:click='delete'>
            <span wire:loading.remove wire:target='delete'>delete</span>
            <span wire:loading wire:target='delete'>deleting...</span>
        </x-secondary-button>
    @endif
    <div class="flex flex-col-reverse gap-5 lg:flex-row">

        <x-section class="w-full">

            <div class="space-y-5">

                <x-input label="Name" wire:model='name' :error="$errors->first('name')" />

                <x-input label="Unique id" wire:model='uid' :error="$errors->first('uid')" />

                <x-input label="Slug" wire:model='slug' :error="$errors->first('slug')" />

                <x-input label="Url" wire:model='url' :error="$errors->first('url')" />

                <x-editor wire:model='description' :error="$errors->first('description')" />

            </div>

        </x-section>

        <div class="lg:max-w-96 w-full">
            <x-section class="w-full" title="image">

                <livewire:choose-image target="#game-image" />

                <img class="w-full" src="" alt="" :src="imgUrl" x-show="imgUrl">

                <input class="hidden" id="game-image" type="text" wire:model='thumbnail' x-model="imgUrl">

                @error('thumbnail')
                    <div class="text-sm text-red-500">{{ $message }}</div>
                @enderror

            </x-section>

        </div>

    </div>
</div>
