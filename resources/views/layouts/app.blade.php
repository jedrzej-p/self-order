<!doctype html>
<html lang="pl">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    {{-- Ikonki --}}
    <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon-180x180.png" />

    {{-- Manifest PWA --}}
    <link rel="manifest" href="/manifest.webmanifest">

    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>Self Order</title>
    <meta name="description" content="Self Order">

    <link href="{{ mix('css/app.css') }}" rel="stylesheet">

    <meta name="theme-color" content="#CD1B6F"/>
</head>
<body>
    <div class="app-loader" style="height: 100%; width: 100%; background-color: rgb(255, 252, 249)">
        <img src="/images/static/loader.gif" />
    </div>

    <div id="app" v-cloak>
    </div>

    @include("partials.noscript")

    <script>
            window.Laravel = {!! json_encode([
                'vapidPublicKey' => config('webpush.vapid.public_key'),
            ]) !!};
    </script>

    <script>
        document.querySelector("body").classList.add("is-loading");
    </script>

    <script src="{{ mix('js/manifest.js') }}"></script>
    <script src="{{ mix('js/vendor.js') }}"></script>
    <script src="{{ mix('js/app.js') }}"></script>
</body>
</html>
