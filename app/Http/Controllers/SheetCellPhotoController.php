<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

use App\Models\SheetCell;
use App\Models\SheetCellPhoto;

class SheetCellPhotoController extends Controller
{
    public function show($cellId)
    {
      return response()->json(
        SheetCellPhoto::where('cellId', $cellId)
        ->orderBy('createdAt')
        ->get()
      , 200);
    }

    public function update(Request $request, SheetCellPhoto $photo)
    {
      $photo->update($request->all());
      return response()->json($photo, 200);
    }

    public function destroy(SheetCellPhoto $photo)
    {
      $photo->delete();
      return response()->json(null, 204);
    }
    
    public function uploadPhotos(Request $request)
    {
      // Variables
      $sheetId = $request->input('sheetId');
      $sheetCellId = $request->input('sheetCellId');
      $filename = $request->input('filename');
      $s3PresignedUrlData = $request->input('s3PresignedUrlData');
      $createdAt = $request->input('createdAt');
      $user = Auth::user();
      
      // Move the file to permanent storage on S3
      $nextS3PresignedUrlDataKey = str_replace('tmp/', '', $s3PresignedUrlData['key']);
      Storage::copy($s3PresignedUrlData['key'], $nextS3PresignedUrlDataKey);
      Storage::setVisibility($nextS3PresignedUrlDataKey, 'public');
      
      // Create the new sheet cell photo
      $newSheetCellPhoto = SheetCellPhoto::create([
        'id' => Str::uuid()->toString(),
        'sheetId' => $sheetId,
        'cellId' => $sheetCellId,
        'filename' => $filename,
        's3Uuid' => $s3PresignedUrlData['uuid'],
        's3Bucket' => $s3PresignedUrlData['bucket'],
        's3Key' => $nextS3PresignedUrlDataKey,
        'uploadedBy' => $user->name,
        'uploadedAt' => $createdAt
      ]);

      $nextSheetCellPhotos = SheetCellPhoto::where('cellId', $sheetCellId)->orderBy('createdAt')->get();
      $sheetCell = SheetCell::find($sheetCellId);
      $sheetCell->update([ 'value' => count($nextSheetCellPhotos) ]);
      return response()->json($nextSheetCellPhotos, 200);
    }

    public function downloadPhotos($sheetPhotoId)
    {
      $sheetPhoto = SheetCellPhoto::find($sheetPhotoId);
      return Storage::download($sheetPhoto->s3Key, $sheetPhoto->filename);
    }
}
