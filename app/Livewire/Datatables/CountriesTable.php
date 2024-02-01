<?php

namespace App\Livewire\Datatables;


use App\Models\Country;
use JoydeepBhowmik\LivewireDatatable\Datatable;

class CountriesTable extends Datatable
{
    public $model = Country::class;



    public function table()
    {
        return [
            $this->field('flag_url')
                ->label('Image')
                ->value(function ($row) {
                    $image = url($row->flag_url);
                    return <<<HTML
                    <div class="h-20  w-fit">
                        <img src="$image" class="object-contain h-full"/>
                    </div>  
                    HTML;
                }),

            $this->field('name')
                ->label('Name'),

            $this->field('code')
                ->label('Code'),


            $this->field('...')

                ->value(function ($row) {
                    $link = route('admin.countries.edit', $row->id);
                    return view('components.edit-link', compact('link'));
                }),
        ];
    }
}
