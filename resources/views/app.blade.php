@extends('layout')

@section('react-script')
  <script>
    const initialData = {
      user: @json($user)
    }
  </script>
  <script src="{{ mix('js/app.js') }}"></script>
@endsection