<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Tasksheet</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"/>
    
    <link rel="stylesheet" type="text/css" href="{{ asset('css/base.css', env('ASSETS_REQUIRE_HTTP') !== null ? !env('ASSETS_REQUIRE_HTTP') : true )}}">
    
    <link rel="apple-touch-icon" sizes="57x57" href="{{ asset('images/icons/apple-icon-57x57.png') }}">
    <link rel="apple-touch-icon" sizes="60x60" href="{{ ('images/icons/apple-icon-60x60.png') }}">
    <link rel="apple-touch-icon" sizes="72x72" href="{{ ('images/icons/apple-icon-72x72.png') }}">
    <link rel="apple-touch-icon" sizes="76x76" href="{{ ('images/icons/apple-icon-76x76.png') }}">
    <link rel="apple-touch-icon" sizes="114x114" href="{{ ('images/icons/apple-icon-114x114.png') }}">
    <link rel="apple-touch-icon" sizes="120x120" href="{{ ('images/icons/apple-icon-120x120.png') }}">
    <link rel="apple-touch-icon" sizes="144x144" href="{{ ('images/icons/apple-icon-144x144.png') }}">
    <link rel="apple-touch-icon" sizes="152x152" href="{{ ('images/icons/apple-icon-152x152.png') }}">
    <link rel="apple-touch-icon" sizes="180x180" href="{{ ('images/icons/apple-icon-180x180.png') }}">
    <link rel="icon" type="image/png" sizes="192x192"  href="{{ ('images/icons/android-icon-192x192.png') }}">
    <link rel="icon" type="image/png" sizes="32x32" href="{{ ('images/icons/favicon-32x32.png') }}">
    <link rel="icon" type="image/png" sizes="96x96" href="{{ ('images/icons/favicon-96x96.png') }}">
    <link rel="icon" type="image/png" sizes="16x16" href="{{ ('images/icons/favicon-16x16.png') }}">
    <link rel="manifest" href="{{ ('images/icons/manifest.json') }}">
    <meta name="msapplication-TileColor" content="#ffffff">
    <meta name="msapplication-TileImage" content="{{ ('images/icons/ms-icon-144x144.png') }}">
    <meta name="theme-color" content="#ffffff">
    
    @if($user->tasksheetSubscription->type === 'TRIAL')
      <script src="https://js.stripe.com/v3/"></script>
    @endif
  </head>
  <body>
    <section id="react-container"></section>
    <script>
      const environment = {
        assetUrl: "{{ asset('') }}",
        s3Bucket: "{{ env('AWS_BUCKET') }}"
      }
      const initialData = {
        user: @json($user),
        files: @json($files),
        folders: @json($folders),
      }
    </script>
    @yield('react-script')
  </body>
</html>