<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Tasksheet</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"/>
    
    <link rel="stylesheet" type="text/css" href="{{ asset('css/base.css', env('ASSETS_REQUIRE_HTTP') !== null ? !env('ASSETS_REQUIRE_HTTP') : true )}}">
    
    <link rel="apple-touch-icon" sizes="57x57" href="{{ asset('images/icons/apple-icon-57x57.png', env('ASSETS_REQUIRE_HTTP') !== null ? !env('ASSETS_REQUIRE_HTTP') : true) }}">
    <link rel="apple-touch-icon" sizes="60x60" href="{{ asset('images/icons/apple-icon-60x60.png', env('ASSETS_REQUIRE_HTTP') !== null ? !env('ASSETS_REQUIRE_HTTP') : true) }}">
    <link rel="apple-touch-icon" sizes="72x72" href="{{ asset('images/icons/apple-icon-72x72.png', env('ASSETS_REQUIRE_HTTP') !== null ? !env('ASSETS_REQUIRE_HTTP') : true) }}">
    <link rel="apple-touch-icon" sizes="76x76" href="{{ asset('images/icons/apple-icon-76x76.png', env('ASSETS_REQUIRE_HTTP') !== null ? !env('ASSETS_REQUIRE_HTTP') : true) }}">
    <link rel="apple-touch-icon" sizes="114x114" href="{{ asset('images/icons/apple-icon-114x114.png', env('ASSETS_REQUIRE_HTTP') !== null ? !env('ASSETS_REQUIRE_HTTP') : true) }}">
    <link rel="apple-touch-icon" sizes="120x120" href="{{ asset('images/icons/apple-icon-120x120.png', env('ASSETS_REQUIRE_HTTP') !== null ? !env('ASSETS_REQUIRE_HTTP') : true) }}">
    <link rel="apple-touch-icon" sizes="144x144" href="{{ asset('images/icons/apple-icon-144x144.png', env('ASSETS_REQUIRE_HTTP') !== null ? !env('ASSETS_REQUIRE_HTTP') : true) }}">
    <link rel="apple-touch-icon" sizes="152x152" href="{{ asset('images/icons/apple-icon-152x152.png', env('ASSETS_REQUIRE_HTTP') !== null ? !env('ASSETS_REQUIRE_HTTP') : true) }}">
    <link rel="apple-touch-icon" sizes="180x180" href="{{ asset('images/icons/apple-icon-180x180.png', env('ASSETS_REQUIRE_HTTP') !== null ? !env('ASSETS_REQUIRE_HTTP') : true) }}">
    <link rel="icon" type="image/png" sizes="192x192"  href="{{ asset('images/icons/android-icon-192x192.png', env('ASSETS_REQUIRE_HTTP') !== null ? !env('ASSETS_REQUIRE_HTTP') : true) }}">
    <link rel="icon" type="image/png" sizes="32x32" href="{{ asset('images/icons/favicon-32x32.png', env('ASSETS_REQUIRE_HTTP') !== null ? !env('ASSETS_REQUIRE_HTTP') : true) }}">
    <link rel="icon" type="image/png" sizes="96x96" href="{{ asset('images/icons/favicon-96x96.png', env('ASSETS_REQUIRE_HTTP') !== null ? !env('ASSETS_REQUIRE_HTTP') : true) }}">
    <link rel="icon" type="image/png" sizes="16x16" href="{{ asset('images/icons/favicon-16x16.png', env('ASSETS_REQUIRE_HTTP') !== null ? !env('ASSETS_REQUIRE_HTTP') : true) }}">
    <link rel="manifest" href="{{ asset('images/icons/manifest.json', env('ASSETS_REQUIRE_HTTP') !== null ? !env('ASSETS_REQUIRE_HTTP') : true) }}">
    <meta name="msapplication-TileColor" content="#ffffff">
    <meta name="msapplication-TileImage" content="{{ asset('images/icons/ms-icon-144x144.png', env('ASSETS_REQUIRE_HTTP') !== null ? !env('ASSETS_REQUIRE_HTTP') : true) }}">
    <meta name="theme-color" content="#ffffff">
    
    @if(!in_array($user->tasksheetSubscription->type, ['DEMO', 'LIFETIME']))
      <script src="https://js.stripe.com/v3/"></script>
    @endif
  </head>
  <body>
    <section id="react-container"></section>
    <script>
      const environment = {
        assetUrl: "{{ asset('') }}",
        s3Bucket: "{{ env('AWS_BUCKET') }}",
        stripeKey: "{{ env('STRIPE_KEY') }}"
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