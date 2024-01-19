<?php

namespace App\Livewire\Datatables;

use App\Models\Social;
use JoydeepBhowmik\LivewireDatatable\Datatable;

class SocialsTable extends Datatable
{
    public $model = Social::class;
    public function table()
    {
        return [
            $this->field('name')
                ->label('Name'),

            $this->field('image_url')
                ->label('image')
                ->value(function ($row) {
                    return substr($row->description, 0, 100);
                }),

            $this->field('...')

                ->value(function ($row) {
                    $link = route('admin.socials.edit', $row->id);
                    return view('components.edit-link', compact('link'));
                }),
        ];
    }
}
