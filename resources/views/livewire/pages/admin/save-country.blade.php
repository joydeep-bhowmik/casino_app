<?php

use App\Models\Country;
use Illuminate\Http\Request;
use function Livewire\Volt\{state, mount, title};

state(['id', 'name', 'flag', 'code']);

title(fn() => 'Country ' . ' ' . ($this->id ? 'Update ' . $this->id : 'Create'));

mount(function (Request $request) {
    if ($request->id) {
        $this->id = $request->id;

        $country = Country::find($this->id);

        if (!$country) {
            abort(404);
        }

        $this->name = $country->name;

        $this->flag = $country->flag_url;

        $this->code = $country->code;
    }
});

$save = function () {
    $this->validate([
        'name' => 'required',
        'code' => 'required',
        'flag' => 'required',
    ]);

    $country = new Country();

    if ($this->id) {
        $country = Country::find($this->id);
    }
    $country->name = $this->name;

    $country->flag_url = $this->flag;

    $country->code = $this->code;

    if ($country->save()) {
        return $this->dispatch('alert', type: 'success', message: 'Saved');
    }
};

$delete = function () {
    if (!$this->id) {
        return;
    }
    $country = Social::find($this->id);

    if ($country->delete()) {
        return $this->dispatch('alert', type: 'danger', message: 'social Deleted!');
    }
};

?>

<div class="space-y-5" x-data="{ imgflag_url: $wire.flag }">

    <x-breadcrumbs :arr="[
        [
            'label' => 'Socials',
            'code' => route('admin.socials'),
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

            <img class="w-96" src="" alt="" :src="imgflag_url" x-show="imgflag_url">

            <input class="hidden" id="social-image" type="text" wire:model='flag' x-model="imgflag_url">

            @error('flag')
                <div class="text-sm text-red-500">{{ $message }}</div>
            @enderror

            <x-input label="Name" wire:model='name' :error="$errors->first('name')" />

            <x-input label="code" wire:model='code' :error="$errors->first('code')" />

        </div>

    </x-section>
</div>
