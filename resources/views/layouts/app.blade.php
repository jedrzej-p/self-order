<!doctype html>
<html lang="pl">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>Self Order</title>
    <meta name="description" content="Self Order">

    <link href="{{ mix('css/app.css') }}" rel="stylesheet">

    <meta name="theme-color" content="#CD1B6F"/>
</head>
<body>
    <div class="app-loader">
        <img src="/images/loader.gif" />
    </div>

    <div id="app" v-cloak>
    </div>

    @include("partials.noscript")

   <!-- <script>
            window.Laravel = {!! json_encode([
                'vapidPublicKey' => config('webpush.vapid.public_key'),
            ]) !!};
    </script> -->

    <script>
        document.querySelector("body").classList.add("is-loading");
    </script>

    <script src="{{ mix('js/manifest.js') }}"></script>
    <script src="{{ mix('js/vendor.js') }}"></script>
    <script src="{{ mix('js/app.js') }}"></script>
</body>
</html>
