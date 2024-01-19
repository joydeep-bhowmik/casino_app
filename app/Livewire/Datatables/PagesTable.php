<?php

namespace App\Livewire\Datatables;

use App\Models\Page;
use JoydeepBhowmik\LivewireDatatable\Datatable;

class PagesTable extends Datatable
{
    public $model = Page::class;
    public function table()
    {
        return [
            $this->field('title')
                ->label('Title'),

            $this->field('slug')
                ->label('Slug'),

            $this->field('content')
                ->label('Content')
                ->value(function ($row) {
                    return substr($row->content, 0, 100);
                }),

            $this->field('...')

                ->value(function ($row) {
                    $link = route('admin.pages.edit', $row->id);
                    return view('components.edit-link', compact('link'));
                }),
        ];
    }
}
