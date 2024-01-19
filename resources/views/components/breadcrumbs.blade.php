@props(['arr' => []])
<div {{ $attributes->merge(['class' => 'flex flex-wrap gap-1 text-xs items-center']) }}>
    <a href="{{ route('admin.dashboard') }}" wire:navigate>
        Home
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
