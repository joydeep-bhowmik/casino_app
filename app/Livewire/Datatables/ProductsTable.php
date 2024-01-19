<?php

namespace App\Livewire\Datatables;

use App\Models\Product;
use JoydeepBhowmik\LivewireDatatable\Datatable;

class ProductsTable extends Datatable
{
    public $model = Product::class;
    public function table()
    {
        return [
            $this->field('name')
                ->label('Name'),

            $this->field('price')
                ->label('Price'),

            $this->field('...')

                ->value(function ($row) {
                    $link = route('admin.products.edit', $row->id);
                    return view('components.edit-link', compact('link'));
                }),
        ];
    }
}
