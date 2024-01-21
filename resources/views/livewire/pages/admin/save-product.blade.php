<?php

use App\Models\Product;
use App\Models\Suitcase;
use Illuminate\Http\Request;
use function Livewire\Volt\{state, mount, with, title};

state(['id', 'name', 'slug', 'suitcase', 'price', 'compare_at_price', 'image', 'description']);

title(fn() => 'Product' . ' ' . ($this->id ? 'Update ' . $this->id : 'Create'));

mount(function (Request $request) {
    if ($request->id) {
        $this->id = $request->id;

        $product = Product::find($this->id);

        if (!$product) {
            abort(404);
        }

        $this->name = $product->name;

        $this->price = $product->price;

        $this->slug = $product->slug;

        $this->suitcase = $product->suitcase_id;

        $this->compare_at_price = $product->compare_at_price;

        $this->description = $product->description;

        $this->image = $product->image_url;
    }
});

$save = function () {
    $this->validate([
        'name' => 'required|string|max:255',
        'suitcase' => 'nullable|exists:suitcases,id',
        'price' => 'required|numeric',
        'slug' => 'required|alpha_dash|max:255,unique:products,slug,' . $this->id,
        'compare_at_price' => 'nullable|numeric',
        'description' => 'nullable',
        'image' => 'required',
    ]);

    $product = new Product();

    if ($this->id) {
        $product = Product::find($this->id);
    }

    $product->name = $this->name;

    $product->price = $this->price;

    $product->slug = $this->slug;

    $product->compare_at_price = $this->compare_at_price;

    $product->description = $this->description;

    $product->suitcase_id = $this->suitcase;

    $product->image_url = $this->image;

    if ($product->save()) {
        return $this->dispatch('alert', type: 'success', message: 'Saved');
    }
};

$delete = function () {
    if (!$this->id) {
        return;
    }
    $product::find($this->id);

    if ($product->delete()) {
        return $this->dispatch('alert', type: 'danger', message: 'Product Deleted!');
    }
};

with(function () {
    $suitcases = Suitcase::all();
    return compact('suitcases');
});
?>

<div class="space-y-5" x-data="{ imgUrl: $wire.image }">

    <x-breadcrumbs :arr="[
        [
            'label' => 'Products',
            'link' => route('admin.products'),
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

            <div class="space-y-7">

                <x-input label="Name" wire:model="name" :error="$errors->first('name')" />

                <x-input label="Slug" wire:model="slug" :error="$errors->first('slug')" />

                <x-select class="w-full" label="Suitcase" :error="$errors->first('suitcase')" wire:model='suitcase'>

                    <option>Select</option>

                    @foreach ($suitcases as $suitcase)
                        <option value="{{ $suitcase->id }}">{{ $suitcase->name }}</option>
                    @endforeach
                </x-select>

                <x-input type="number" label="Price" wire:model="price" :error="$errors->first('price')" />

                <x-input type="number" label="Compare At Price" wire:model="compare_at_price" :error="$errors->first('compare_at_price')" />

                <x-editor wire:model='description' :error="$errors->first('description')" />

            </div>

        </x-section>

        <div class="lg:max-w-96 w-full">
            <x-section class="w-full" title="image">

                <livewire:choose-image target="#Product-image" />

                <img class="w-full" src="" alt="" :src="imgUrl" x-show="imgUrl">

                <input class="hidden" id="Product-image" type="text" wire:model='image' x-model="imgUrl">

                @error('image')
                    <div class="text-sm text-red-500">{{ $message }}</div>
                @enderror
            </x-section>

        </div>

    </div>
</div>
