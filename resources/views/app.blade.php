@extends('layout')

@section('react-script')
  <script>
    window.initialData = {
      user: @json($user)
    }
  </script>
  <script src="{{ mix('js/app.js') }}"></script>
@endsection