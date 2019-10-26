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
      // Variables
      $sheetId = $request->input('sheetId');
      $sheetCellId = $request->input('sheetCellId');
      $filename = $request->input('filename');
      $s3PresignedUrlData = $request->input('s3PresignedUrlData');
      $user = Auth::user();
      
      // Move the file to permanent storage on S3
      $nextS3PresignedUrlDataKey = str_replace('tmp/', '', $s3PresignedUrlData['key']);
      Storage::copy($s3PresignedUrlData['key'], $nextS3PresignedUrlDataKey);
      Storage::setVisibility($nextS3PresignedUrlDataKey, 'public');
      
      // Create the new sheet cell photo
      $newSheetPhoto = SheetPhoto::create([
        'id' => Str::uuid()->toString(),
        'sheetId' => $sheetId,
        'cellId' => $sheetCellId,
        'filename' => $filename,
        's3Uuid' => $s3PresignedUrlData['uuid'],
        's3Bucket' => $s3PresignedUrlData['bucket'],
        's3Key' => $nextS3PresignedUrlDataKey,
        'uploadedBy' => $user->name,
        'uploadedAt' => date("Y-m-d H:i:s")
      ]);

      $nextSheetCellPhotos = SheetPhoto::where('cellId', $sheetCellId)->orderBy('created_at')->get();
      $sheetCell = SheetCell::find($sheetCellId);
      $sheetCell->update([ 'value' => count($nextSheetCellPhotos) ]);
      return response()->json($nextSheetCellPhotos, 200);
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
