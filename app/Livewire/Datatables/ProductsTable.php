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
            $this->field('image_url')
                ->label('Image')
                ->value(function ($row) {
                    $image = url($row->image_url);
                    return <<<HTML
                    <div class="h-20  w-fit">
                        <img src="$image" class="object-contain h-full"/>
                    </div>  
                    HTML;
                }),

            $this->field('name')
                ->label('Name')
                ->searchable(),

            $this->field('price')
                ->label('Price')
                ->sortable(),

            $this->field('...')
                ->value(function ($row) {
                    $link = route('admin.products.edit', $row->id);
                    return view('components.edit-link', compact('link'));
                }),
        ];
    }
}
