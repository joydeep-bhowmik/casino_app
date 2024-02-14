<?php

use App\Models\Suitcase;
use Illuminate\Http\Request;
use function Livewire\Volt\{state, mount, title};

state(['id', 'name', 'slug', 'price', 'flag', 'compare_at_price', 'image', 'description', 'valid_flags' => ['featured', 'new', 'hot']]);

title(fn() => 'Suitcase' . ' ' . ($this->id ? 'Update ' . $this->id : 'Create'));

mount(function (Request $request) {
    if ($request->id) {
        $this->id = $request->id;

        $suitcase = Suitcase::find($this->id);

        if (!$suitcase) {
            abort(404);
        }

        $this->name = $suitcase->name;

        $this->price = $suitcase->price;

        $this->slug = $suitcase->slug;

        $this->compare_at_price = $suitcase->compare_at_price;

        $this->description = $suitcase->description;

        $this->image = $suitcase->image_url;

        $this->flag = $suitcase->flag;
    }
});

$save = function () {
    $this->validate([
        'name' => 'required|string|max:255',
        'price' => 'required|numeric',
        'slug' => 'required|lowercase|alpha_dash|max:255,unique:suitcases,slug,' . $this->id,
        'compare_at_price' => 'nullable|numeric',
        'description' => 'nullable',
        'image' => 'required',
        'flag' => 'nullable|in:' . join(',', $this->valid_flags),
    ]);

    $suitcase = new Suitcase();

    if ($this->id) {
        $suitcase = Suitcase::find($this->id);
    }

    $suitcase->name = $this->name;

    $suitcase->price = $this->price;

    $suitcase->slug = $this->slug;

    $suitcase->compare_at_price = $this->compare_at_price;

    $suitcase->description = $this->description;

    $suitcase->image_url = $this->image;

    $suitcase->flag = $this->flag;

    if ($suitcase->save()) {
        return $this->dispatch('alert', type: 'success', message: 'Saved');
    }
};

$delete = function () {
    if (!$this->id) {
        return;
    }
    $suitcase::find($this->id);

    if ($suitcase->delete()) {
        return $this->dispatch('alert', type: 'danger', message: 'Suitcase Deleted!');
    }
};

?>

<div class="space-y-5" x-data="{ imgUrl: $wire.image }">

    <x-breadcrumbs :arr="[
        [
            'label' => 'Suitcases',
            'link' => route('admin.suitcases'),
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

                <x-input label="Name" wire:model="name" :error="$errors->first('name')" />

                <x-input label="Slug" wire:model="slug" :error="$errors->first('slug')" />

                <x-input type="number" label="Price" wire:model="price" :error="$errors->first('price')" />

                <x-input type="number" label="Compare At Price" wire:model="compare_at_price" :error="$errors->first('compare_at_price')" />

                <x-editor wire:model='description' :error="$errors->first('description')" />

                <x-select label="Flag" :error="$errors->first('flag')" wire:model="flag">
                    <option value="">Select</option>
                    @foreach ($valid_flags as $flag)
                        <option class="capitalize" value="{{ $flag }}">{{ $flag }}</option>
                    @endforeach
                </x-select>

            </div>

        </x-section>

        <div class="lg:max-w-96 w-full">
            <x-section class="w-full space-y-5 py-2" title="image">

                <livewire:choose-image target="#Suitcase-image" />

                <img class="w-full" src="" alt="" :src="imgUrl" x-show="imgUrl">

                <input class="hidden" id="Suitcase-image" type="text" wire:model='image' x-model="imgUrl">

                @error('image')
                    <div class="text-sm text-red-500">{{ $message }}</div>
                @enderror
            </x-section>

        </div>

    </div>
</div>
