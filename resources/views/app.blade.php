@extends('layout')

@section('react-script')
  <script>
    const initialData = {
      user: @json($user),
      folders: @json($folders),
      columnTypes: @json($columnTypes)
    }
  </script>
  <script src="{{ mix('js/app.js') }}"></script>
@endsection