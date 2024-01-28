@props(['arr' => []])
<div
    {{ $attributes->merge(['class' => 'flex flex-wrap gap-1 text-sm font-semibold tracking-wider text-gray-500 transition duration-75 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 items-center']) }}>
    <a href="{{ route('admin.dashboard') }}" wire:navigate>
        <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path
                d="M13 19H19V9.97815L12 4.53371L5 9.97815V19H11V13H13V19ZM21 20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V9.48907C3 9.18048 3.14247 8.88917 3.38606 8.69972L11.3861 2.47749C11.7472 2.19663 12.2528 2.19663 12.6139 2.47749L20.6139 8.69972C20.8575 8.88917 21 9.18048 21 9.48907V20Z">
            </path>
        </svg>
    </a>
    <svg class="h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
        stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
    @if (count($arr) > 0)
        @foreach ($arr as $a)
            @if (isset($a['link']))
                <a class="capitalize" href="{{ $a['link'] }}" wire:navigate>{{ $a['label'] }}</a>
            @else
                <span class="capitalize">{{ $a['label'] }}</span>
            @endif
            @if ($a !== $arr[count($arr) - 1])
                <svg class="h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
            @endif
        @endforeach

    @endif
</div>
