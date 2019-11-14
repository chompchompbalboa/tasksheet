<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}" />
    <link rel="stylesheet" type="text/css" href="{{ asset('css/base.css') }}">
    <title>Tasksheet</title>
  </head>
  <body>
    <section id="react-container"></section>
    <script>
      const tasksheet = {
        assetUrl: '{{ asset('') }}'
      }
    </script>
    @yield('react-script')
  </body>
</html>