<!DOCTYPE html>
    <html lang="pl-PL">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{csrf_token()}}">
        <meta name="description" content="Opis">
        <meta name="keywords" content="">
        <title>SelfOrder</title>
        <link rel="icon" href="">
        <link href=" {{ mix('css/styles.css') }}" rel="stylesheet">
        <link href=" {{ mix('css/app.css') }}" rel="stylesheet">
        <script src="https://kit.fontawesome.com/13821c272b.js" crossorigin="anonymous"></script>
    </head>
    <body>
        <div id="app">
            <app></app>
        </div>
        <script src="{{ mix('js/bootstrap.js') }}"></script>
        <script src="{{ mix('js/app.js') }}"></script>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>
        
    </body>
    </html>
