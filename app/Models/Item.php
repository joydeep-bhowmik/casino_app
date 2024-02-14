<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    use HasFactory;

    function product()
    {
        return $this->hasOne(Product::class, 'id', 'product_id',);
    }
}
