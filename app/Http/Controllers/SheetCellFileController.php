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
    public function uploadFiles(Request $request)
    {
      // Variables
      $sheetId = $request->input('sheetId');
      $sheetCellId = $request->input('sheetCellId');
      $filename = $request->input('filename');
      $s3PresignedUrlData = $request->input('s3PresignedUrlData');
      $user = Auth::user();
      
      // Move the file to permanent storage on S3
      Storage::copy(
        $s3PresignedUrlData['key'],
        str_replace('tmp/', '', $s3PresignedUrlData['key'])
      );
      
      // Create the new sheet cell file
      $newSheetFile = SheetFile::create([
        'id' => Str::uuid()->toString(),
        'sheetId' => $sheetId,
        'cellId' => $sheetCellId,
        'filename' => $filename,
        's3Uuid' => $s3PresignedUrlData['uuid'],
        's3Bucket' => $s3PresignedUrlData['bucket'],
        's3Key' => $s3PresignedUrlData['key'],
        'uploadedBy' => $user->name,
        'uploadedAt' => date("Y-m-d H:i:s")
      ]);
      
      $nextSheetCellFiles = SheetFile::where('cellId', $sheetCellId)->orderBy('created_at')->get();
      $sheetCell = SheetCell::find($sheetCellId);
      $sheetCell->update([ 'value' => count($nextSheetCellFiles) ]);
      
      return response()->json($nextSheetCellFiles, 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Cell  $file
     * @return \Illuminate\Http\Response
     */
    public function show($cellId)
    {
      return response()->json(
        SheetFile::where('cellId', $cellId)
        ->orderBy('created_at')
        ->get()
      , 200);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Cell  $file
     * @return \Illuminate\Http\Response
     */
    public function edit(SheetCellFile $file)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Cell  $file
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, SheetFile $file)
    {
      $file->update($request->all());
      return response()->json($file, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\SheetFile  $sheetFileId
     * @return \Illuminate\Http\Response
     */
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

    /**
     * Download specified resource from storage.
     *
     * @param  \App\SheetFile  $sheetFileId
     * @return \Illuminate\Http\Response
     */
    public function downloadFiles($sheetFileId)
    {
      $sheetFile = SheetFile::find($sheetFileId);
      return Storage::download($sheetFile->s3Key, $sheetFile->filename);
    }
}
