<!DOCTYPE html>
<html>
  <head>
    <base href="{{ asset('') }}">
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}" />
    <link rel="stylesheet" type="text/css" href="{{ asset('css/base.css') }}">
    <title>Tasksheet</title>
  </head>
  <body>
    <section id="react-container"></section>
    @yield('react-script')
  </body>
</html>