<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Models\Cart;
use App\Models\ShippingAddress;
use Laravel\Sanctum\HasApiTokens;
use Stephenjude\Wallet\Interfaces\Wallet;
use Stephenjude\Wallet\Traits\HasWallet;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable implements Wallet
{
    use HasApiTokens, HasFactory, Notifiable,  HasWallet;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];


    /**
     * The function "carts" returns a collection of "Cart" objects.
     * 
     * @return a relationship between the current model and the Cart model.
     */
    function carts()
    {
        return $this->hasMany(Cart::class);
    }

    function address()
    {
        return $this->hasOne(ShippingAddress::class);
    }
}
