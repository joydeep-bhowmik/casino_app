@props(['disabled' => false, 'error' => false, 'id' => 'input_' . uniqid(), 'label' => false, 'prefix' => false])

<div class="w-full break-inside-avoid-column">
    <div class="group relative w-full bg-transparent text-sm text-gray-900">

        <input id="{{ $id }}" {{ $disabled ? 'disabled' : '' }} {!! $attributes->merge([
            'class' =>
                ' rounded peer block w-full ' .
                ($error ? 'border-red-500 focus:border-red-500 focus:ring-red-500 ' : 'border-slate-300'),
        ]) !!} placeholder=" " />
        @if ($label)
            <label
                class="{{ $error ? 'text-red-500 peer-focus:text-red-500' : '' }} absolute top-2 z-0 origin-[0] -translate-y-7 scale-75 transform px-2 text-sm capitalize text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-7 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 dark:bg-gray-900 dark:text-gray-400 peer-focus:dark:text-blue-500"
                for="{{ $id }}">{{ $label }}</label>
        @endif

    </div>
    @if ($error)
        <div class="text-sm text-red-500">{{ $error }}</div>
    @endif
</div>
