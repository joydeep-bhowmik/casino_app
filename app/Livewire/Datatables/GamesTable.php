<?php

namespace App\Livewire\Datatables;

use App\Models\Game;
use Illuminate\Support\Facades\Blade;
use JoydeepBhowmik\LivewireDatatable\Datatable;

class GamesTable extends Datatable
{
    public $model = Game::class;



    public function table()
    {
        return [
            $this->field('thumbnail_url')
                ->label('Image')
                ->value(function ($row) {
                    $image = url($row->thumbnail_url);
                    return <<<HTML
                    <div class="h-20  w-fit">
                        <img src="$image" class="object-contain h-full"/>
                    </div>  
                    HTML;
                }),

            $this->field('name')
                ->label('Name'),

            $this->field('description')
                ->label('Description')
                ->value(function ($row) {
                    return substr($row->description, 0, 100);
                }),

            $this->field('...')

                ->value(function ($row) {
                    $link = route('admin.games.edit', $row->id);
                    return view('components.edit-link', compact('link'));
                }),
        ];
    }
}
