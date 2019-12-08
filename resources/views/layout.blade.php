<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}" />
    <link rel="stylesheet" type="text/css" href="{{ asset('css/base.css', env('ASSETS_REQUIRE_HTTP') !== null ? !env('ASSETS_REQUIRE_HTTP') : true )}}">
    <title>Tasksheet</title>
  </head>
  <body>
    <section id="react-container"></section>
    <script>
      const environment = {
        assetUrl: '{{ asset('') }}'
      }
      const initialData = {
        user: @json($user),
        teams: @json($teams),
        folders: @json($folders),
      }
    </script>
    @yield('react-script')
  </body>
</html>