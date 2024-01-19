<?php

namespace App\Livewire\Datatables;

use App\Models\Suitcase;
use JoydeepBhowmik\LivewireDatatable\Datatable;

class SuitcasesTable extends Datatable
{
    public $model = Suitcase::class;
    public function table()
    {
        return [
            $this->field('name')
                ->label('Name'),


            $this->field('...')

                ->value(function ($row) {
                    $link = route('admin.suitcases.edit', $row->id);
                    return view('components.edit-link', compact('link'));
                }),
        ];
    }
}
