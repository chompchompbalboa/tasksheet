<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

use App\Models\SheetCell;
use App\Models\SheetPhoto;

class SheetCellPhotoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function uploadPhotos(Request $request)
    {
      $formData = $request->all();
      $sheetId = $formData['sheetId'];
      $sheetCellId = $formData['sheetCellId'];
      $photosToUpload = $formData['photosToUpload'];
      $user = Auth::user();
      foreach($photosToUpload as $photoToUpload) {
        $newPhotoId = Str::uuid()->toString();
        $newPhotoFileName = $newPhotoId.'.'.$photoToUpload->extension();
        $photoToUpload->storeAs('/public', $newPhotoFileName);
        $newSheetPhoto = SheetPhoto::create([
          'id' => $newPhotoId,
          'sheetId' => $sheetId,
          'cellId' => $sheetCellId,
          'filename' => $newPhotoFileName,
          'uploadedBy' => $user->name,
          'uploadedDate' => date('m-d-Y')
        ]);
      }
      return response()->json(
        SheetPhoto::where('cellId', $sheetCellId)
          ->orderBy('created_at')
          ->get()
      , 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Cell  $photo
     * @return \Illuminate\Http\Response
     */
    public function show($cellId)
    {
      return response()->json(
        SheetPhoto::where('cellId', $cellId)
        ->orderBy('created_at')
        ->get()
      , 200);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Cell  $photo
     * @return \Illuminate\Http\Response
     */
    public function edit(SheetCellPhoto $photo)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Cell  $photo
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, SheetCellPhoto $photo)
    {
      $photo->update($request->all());
      return response()->json($photo, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Cell  $photo
     * @return \Illuminate\Http\Response
     */
    public function destroy(Cell $photo)
    {
        //
    }
}
