<?php

use App\Models\Image;
use function Livewire\Volt\{state, with, updated, usesFileUploads, mount};

usesFileUploads();

state(['photo', 'photos', 'page' => 0, 'label', 'perPage' => 10, 'hasMore' => true, 'target']);

mount(function ($target, $label = 'choose image') {
    $this->target = $target;

    $this->label = $label;

    $this->photos = collect([]);

    $this->load();
});

$load = function () {
    $this->page++;

    $images = Image::orderBy('created_at', 'desc')->paginate($this->perPage, ['*'], null, $this->page);

    foreach ($images as $image) {
        $this->photos->prepend($image);
    }
    if (!$images->hasMorePages()) {
        $this->hasMore = false;
    }
};

$save = function () {
    $image = new Image();

    $filename = $this->photo->getClientOriginalName();

    $image->filename = $filename;

    if ($image->save()) {
        if ($this->photo->storeAs('uploads', $image->id . $filename, 'public')) {
            $this->photos->prepend($image);
        }
    }
};

updated(['photo' => fn() => $this->save()]);

$delete = function ($id) {
    $image = Image::find($id);

    $this->authorize('delete', $image);

    $filepath = public_path('/storage/uploads/' . $image->filename);

    if (file_exists($filepath)) {
        unlink($filepath);
    }

    if ($image->delete()) {
        $this->photos = $this->photos->reject(function ($image) use ($id) {
            return $image->id == $id;
        });
    }
};

with(function () {
    $filed_id = 'photo_' . uniqid();

    return compact('filed_id');
});

?>

<div class="relative w-full" x-data="{

    showUploads: false,

    update_image_url(url) {

        const el = document.querySelector('{{ $target }}');

        el.value = url;

        el.dispatchEvent(new Event('input'));

        this.showUploads = false;
    }
}">

    <div class="w-full" x-on:click="showUploads=true">

        <span class="cursor-pointer capitalize text-blue-500"> {{ $label }}</span>

    </div>

    <div class="absolute top-10 z-10 max-h-96 w-full overflow-y-auto rounded-md border bg-white p-5 shadow-sm"
        x-show="showUploads" @click.away="showUploads=false">

        <div class="flex flex-wrap gap-5">

            <label class="grid h-32 w-32 cursor-pointer place-items-center border" for="{{ $filed_id }}">

                <svg class="h-6 w-6" wire:target='photo' wire:loading.remove xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24" fill="currentColor">
                    <path
                        d="M3 19H21V21H3V19ZM13 5.82843V17H11V5.82843L4.92893 11.8995L3.51472 10.4853L12 2L20.4853 10.4853L19.0711 11.8995L13 5.82843Z">
                    </path>
                </svg>

                <svg class="h-6 w-6 animate-spin" wire:loading wire:target='photo' xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24" fill="currentColor">
                    <path
                        d="M18.364 5.63604L16.9497 7.05025C15.683 5.7835 13.933 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12H21C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C14.4853 3 16.7353 4.00736 18.364 5.63604Z">
                    </path>
                </svg>

            </label>

            <input class="hidden" id="{{ $filed_id }}" name="" type="file" accept="image/*"
                wire:model.live="photo">

            @if (count($photos))
                @foreach ($photos as $image)
                    <div class="relative h-32 w-32 cursor-pointer border">

                        <button class="absolute -right-4 -top-4 rounded-full border bg-white p-2" type="button"
                            wire:x-confirm="Are you sure? this can't be undone!"
                            wire:click="delete('{{ $image->id }}')">

                            <svg class="h-6 w-6" wire:loading.remove wire:target="delete('{{ $image->id }}')"
                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>

                            <svg class="h-6 w-6 animate-spin" wire:loading wire:target="delete('{{ $image->id }}')"
                                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                <path
                                    d="M18.364 5.63604L16.9497 7.05025C15.683 5.7835 13.933 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12H21C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C14.4853 3 16.7353 4.00736 18.364 5.63604Z">
                                </path>
                            </svg>

                        </button>

                        <img class="h-full object-contain"
                            src="{{ url('/storage/uploads/' . $image->id . $image->filename) }}" alt=""
                            x-on:click=" update_image_url('{{ '/storage/uploads/' . $image->id . $image->filename }}')">
                        <p class="truncate">{{ $image->filename }}</p>
                    </div>
                @endforeach
            @endif

        </div>
        @if ($hasMore)
            <button class="w-full p-3 text-xs uppercase tracking-widest" wire:click='load'>
                <span wire:loading.remove>load more</span>
                <span wire:loading>loading...</span>
            </button>
        @endif

    </div>

</div>
