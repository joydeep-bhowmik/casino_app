<?php

namespace App\Models;

use App\Models\Product;
use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class Suitcase extends Model
{
    use HasFactory;

    function products()
    {
        return $this->hasMany(Product::class);
    }
}
