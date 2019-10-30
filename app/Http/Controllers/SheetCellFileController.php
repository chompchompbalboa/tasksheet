<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

use App\Models\SheetCell;
use App\Models\SheetFile;

class SheetCellFileController extends Controller
{
    public function show($cellId)
    {
      return response()->json(
        SheetFile::where('cellId', $cellId)
        ->orderBy('created_at')
        ->get()
      , 200);
    }

    public function update(Request $request, SheetFile $file)
    {
      $file->update($request->all());
      return response()->json($file, 200);
    }

    public function destroy($sheetFileId)
    {
      $sheetFile = SheetFile::find($sheetFileId);
      $cellId = $sheetFile->cellId;
      Storage::delete('/public/files/'.$sheetFile->filename);
      $sheetFile->delete();
      return response()->json(
        SheetFile::where('cellId', $cellId)
        ->orderBy('created_at')
        ->get()
      , 200);
    }

    public function uploadFiles(Request $request)
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
      
      // Create the new sheet cell file
      $newSheetFile = SheetFile::create([
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
      
      $nextSheetCellFiles = SheetFile::where('cellId', $sheetCellId)->orderBy('created_at')->get();
      $sheetCell = SheetCell::find($sheetCellId);
      $sheetCell->update([ 'value' => count($nextSheetCellFiles) ]);
      
      return response()->json($nextSheetCellFiles, 200);
    }

    public function downloadFiles($sheetFileId)
    {
      $sheetFile = SheetFile::find($sheetFileId);
      return Storage::download($sheetFile->s3Key, $sheetFile->filename);
    }
}
