<?php

namespace App\Livewire\Datatables;

use App\Models\Order;
use JoydeepBhowmik\LivewireDatatable\Datatable;

class OrdersTable extends Datatable
{
    public $model = Order::class;
    public function table()
    {
        return [
            $this->field('order_number')
                ->label('Order number'),

            $this->field('status')
                ->label('Status'),

            $this->field('payment_status')
                ->label('Payment Status'),

            $this->field('...')

                ->value(function ($row) {
                    $link = route('admin.Orders.edit', $row->id);
                    return view('components.edit-link', compact('link'));
                }),
        ];
    }
}
