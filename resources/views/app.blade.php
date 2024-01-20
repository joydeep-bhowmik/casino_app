<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    {{-- <title inertia>{{ config('app.name', 'Laravel') }}</title> --}}
    @inertiaHead
    <!-- Fonts -->

    <link href="https://fonts.gstatic.com" rel="preconnect" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&display=swap"
        rel="stylesheet">
    <!-- Scripts -->
    @routes
    @viteReactRefresh
    @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
    @inertiaHead
</head>

<body class="bg-black font-sans text-white antialiased">
    @inertia
</body>

<script>
    function url(str) {
        return "{{ url('/') }}" + str;
    }

    function socket(str) {
        return "ws://{{ env('PUSHER_HOST') }}:6001" + str;
    }

    function get_user_token() {
        return "{{ optional(Auth::user()?->tokens()->latest()->first())->token }}";
    }
</script>

</html>
