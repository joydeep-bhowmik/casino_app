<nav {{ $attributes->merge(['class' => 'min-h-screen w-full overflow-y-auto']) }} x-transition>
    @persist('nav')
        <div class="mt-5 divide-y p-3 text-sm font-semibold text-gray-700">
            <a class="admin-nav-link" href="{{ url(route('admin.dashboard')) }}" wire:navigate>

                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path
                        d="M13 19H19V9.97815L12 4.53371L5 9.97815V19H11V13H13V19ZM21 20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V9.48907C3 9.18048 3.14247 8.88917 3.38606 8.69972L11.3861 2.47749C11.7472 2.19663 12.2528 2.19663 12.6139 2.47749L20.6139 8.69972C20.8575 8.88917 21 9.18048 21 9.48907V20Z">
                    </path>
                </svg>

                Dashboard
            </a>

            <x-accordion class="mt-5" title="Games" :open="true">

                <a class="admin-nav-link" href="{{ route('admin.games') }}" wire:navigate>

                    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path
                            d="M13 4H21V6H13V4ZM13 11H21V13H13V11ZM13 18H21V20H13V18ZM6.5 19C5.39543 19 4.5 18.1046 4.5 17C4.5 15.8954 5.39543 15 6.5 15C7.60457 15 8.5 15.8954 8.5 17C8.5 18.1046 7.60457 19 6.5 19ZM6.5 21C8.70914 21 10.5 19.2091 10.5 17C10.5 14.7909 8.70914 13 6.5 13C4.29086 13 2.5 14.7909 2.5 17C2.5 19.2091 4.29086 21 6.5 21ZM5 6V9H8V6H5ZM3 4H10V11H3V4Z">
                        </path>
                    </svg>

                    All
                </a>

            </x-accordion>

            <x-accordion title="Store" :open="true">

                <a class="admin-nav-link" href="{{ route('admin.suitcases') }}" wire:navigate>

                    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path
                            d="M7 5V2C7 1.44772 7.44772 1 8 1H16C16.5523 1 17 1.44772 17 2V5H21C21.5523 5 22 5.44772 22 6V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V6C2 5.44772 2.44772 5 3 5H7ZM4 16V19H20V16H4ZM4 14H20V7H4V14ZM9 3V5H15V3H9ZM11 11H13V13H11V11Z">
                        </path>
                    </svg>

                    Suitcases
                </a>

                <a class="admin-nav-link" href="{{ route('admin.products') }}" wire:navigate>

                    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path
                            d="M11 4H21V6H11V4ZM11 8H17V10H11V8ZM11 14H21V16H11V14ZM11 18H17V20H11V18ZM3 4H9V10H3V4ZM5 6V8H7V6H5ZM3 14H9V20H3V14ZM5 16V18H7V16H5Z">
                        </path>
                    </svg>

                    Products
                </a>

                <a class="admin-nav-link" href="{{ route('admin.orders') }}" wire:navigate>

                    <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path
                            d="M8.5 7C8.5 5.89543 7.60457 5 6.5 5C5.39543 5 4.5 5.89543 4.5 7C4.5 8.10457 5.39543 9 6.5 9C7.60457 9 8.5 8.10457 8.5 7ZM10.5 7C10.5 9.20914 8.70914 11 6.5 11C4.29086 11 2.5 9.20914 2.5 7C2.5 4.79086 4.29086 3 6.5 3C8.70914 3 10.5 4.79086 10.5 7ZM21 4H13V6H21V4ZM21 11H13V13H21V11ZM21 18H13V20H21V18ZM6.5 19C5.39543 19 4.5 18.1046 4.5 17C4.5 15.8954 5.39543 15 6.5 15C7.60457 15 8.5 15.8954 8.5 17C8.5 18.1046 7.60457 19 6.5 19ZM6.5 21C8.70914 21 10.5 19.2091 10.5 17C10.5 14.7909 8.70914 13 6.5 13C4.29086 13 2.5 14.7909 2.5 17C2.5 19.2091 4.29086 21 6.5 21ZM6.5 8C7.05228 8 7.5 7.55228 7.5 7C7.5 6.44772 7.05228 6 6.5 6C5.94772 6 5.5 6.44772 5.5 7C5.5 7.55228 5.94772 8 6.5 8Z">
                        </path>
                    </svg>

                    Orders
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
