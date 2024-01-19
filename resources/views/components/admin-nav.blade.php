<nav {{ $attributes->merge(['class' => 'min-h-screen w-full max-w-[250px] overflow-y-scroll']) }}>
    @persist('nav')
        <div class="mt-5 divide-y p-3 text-sm font-semibold text-slate-800">
            <a class="admin-nav-link justify-center border" href="">

                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>

                Dashboard
            </a>

            <x-accordion class="mt-5" title="Games" :open="true">

                <a class="admin-nav-link" href="{{ route('admin.games') }}" wire:navigate>

                    All
                </a>

            </x-accordion>

            <x-accordion title="Store" :open="true">

                <a class="admin-nav-link" href="{{ route('admin.suitcases') }}" wire:navigate>

                    Suitcases
                </a>

                <a class="admin-nav-link" href="{{ route('admin.products') }}" wire:navigate>

                    Products
                </a>

            </x-accordion>

            <x-accordion title="Site" :open="true">

                <a class="admin-nav-link" href="{{ route('admin.pages') }}" wire:navigate>

                    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path
                            d="M5 8V20H19V8H5ZM5 6H19V4H5V6ZM20 22H4C3.44772 22 3 21.5523 3 21V3C3 2.44772 3.44772 2 4 2H20C20.5523 2 21 2.44772 21 3V21C21 21.5523 20.5523 22 20 22ZM7 10H11V14H7V10ZM7 16H17V18H7V16ZM13 11H17V13H13V11Z">
                        </path>
                    </svg>

                    Pages
                </a>

                <a class="admin-nav-link" href="{{ route('admin.socials') }}" wire:navigate>

                    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path
                            d="M3 4.99509C3 3.89323 3.89262 3 4.99509 3H19.0049C20.1068 3 21 3.89262 21 4.99509V19.0049C21 20.1068 20.1074 21 19.0049 21H4.99509C3.89323 21 3 20.1074 3 19.0049V4.99509ZM5 5V19H19V5H5ZM7.97216 18.1808C7.35347 17.9129 6.76719 17.5843 6.22083 17.2024C7.46773 15.2753 9.63602 14 12.1022 14C14.5015 14 16.6189 15.2071 17.8801 17.0472C17.3438 17.4436 16.7664 17.7877 16.1555 18.0718C15.2472 16.8166 13.77 16 12.1022 16C10.3865 16 8.87271 16.8641 7.97216 18.1808ZM12 13C10.067 13 8.5 11.433 8.5 9.5C8.5 7.567 10.067 6 12 6C13.933 6 15.5 7.567 15.5 9.5C15.5 11.433 13.933 13 12 13ZM12 11C12.8284 11 13.5 10.3284 13.5 9.5C13.5 8.67157 12.8284 8 12 8C11.1716 8 10.5 8.67157 10.5 9.5C10.5 10.3284 11.1716 11 12 11Z">
                        </path>
                    </svg>

                    Socials
                </a>
            </x-accordion>
        </div>
    @endpersist
</nav>
