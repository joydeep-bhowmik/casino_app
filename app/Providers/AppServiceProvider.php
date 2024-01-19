<?php

namespace App\Providers;

use App\Models\Page;
use Inertia\Inertia;
use App\Models\Social;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {

        Inertia::share('data', function () {
            $pages = Page::select('title', 'slug')->get();
            $socials = Social::all();
            return compact('pages', 'socials');
        });
    }
}
