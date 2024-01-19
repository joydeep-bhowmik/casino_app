@props(['title' => null, 'header' => true, 'open' => false])
<div x-data="{ open: {{ $open ? 'true' : 'false' }} }" {{ $attributes->merge([
    'class' => 'space-y-3 py-2',
]) }}>
    @if ($header)
        <header class="flex items-center px-3 py-2">
            @if ($title)
                <span
                    class="text-primary-600 dark:text-primary-400 flex-1 truncate text-sm font-bold tracking-wide">{{ $title }}</span>
            @endif
            <button class="ml-auto w-fit transition-all duration-300 ease-in-out" x-on:click="open=!open"
                :class="open ? 'rotate-180' : ''">
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
            </button>
        </header>
    @endif
    <article class="ml-2 space-y-1" style="display: none" x-show="open" x-transition>
        {{ $slot }}
    </article>
</div>
