@props(['title' => false])
<section class="rounded-lg border bg-white">
    @if ($title)
        <header class="border-b px-5 py-4 text-base font-semibold leading-6 text-gray-950 dark:text-white">
            {{ $title }}
        </header>
    @endif

    <article {{ $attributes->merge(['class' => 'my-7 px-5']) }}>
        {{ $slot }}
    </article>
</section>
