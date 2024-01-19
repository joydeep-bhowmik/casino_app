<?php

use App\Models\Page;
use Illuminate\Http\Request;
use function Livewire\Volt\{state, mount, title};

state(['id', 'title', 'content', 'slug']);

title(fn() => 'Page' . ' ' . ($this->id ? 'Update ' . $this->id : 'Create'));

mount(function (Request $request) {
    if ($request->id) {
        $this->id = $request->id;

        $Page = Page::find($this->id);

        if (!$Page) {
            abort(404);
        }

        $this->title = $Page->title;

        $this->content = $Page->content;

        $this->slug = $Page->slug;
    }
});

$save = function () {
    $this->validate([
        'title' => 'required',
        'slug' => 'required|alpha_dash|max:255,unique:pages,slug,' . $this->id,
        'content' => 'required',
    ]);

    $Page = new Page();

    if ($this->id) {
        $Page = Page::find($this->id);
    }
    $Page->title = $this->title;

    $Page->slug = $this->slug;

    $Page->content = $this->content;

    if ($Page->save()) {
        return $this->dispatch('alert', type: 'success', message: 'Saved');
    }
};

$delete = function () {
    if (!$this->id) {
        return;
    }
    $page = Page::find($this->id);

    if ($page->delete()) {
        return $this->dispatch('alert', type: 'success', message: 'Deleted');
    }
};
?>

<div class="space-y-5" x-data="{ imgslug: $wire.thumbnail }">

    <x-breadcrumbs :arr="[
        [
            'label' => 'Pages',
            'link' => route('admin.pages'),
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

            <x-input label="Title" wire:model='title' :error="$errors->first('title')" />

            <x-input label="Slug" wire:model='slug' :error="$errors->first('slug')" />

            <x-editor wire:model='content' :error="$errors->first('content')" />

        </div>

    </x-section>
</div>
