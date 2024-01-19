<?php

namespace App\Policies;

use App\Models\Image;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ImagePolicy
{
    public function delete(?User $user, Image $image): bool
    {
        return  $user && ($user->role == 1);
    }
}
