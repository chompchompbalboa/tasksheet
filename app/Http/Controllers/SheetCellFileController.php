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
      $formData = $request->all();
      $sheetId = $formData['sheetId'];
      $sheetCellId = $formData['sheetCellId'];
      $filesToUpload = $formData['filesToUpload'];
      $user = Auth::user();
      foreach($filesToUpload as $fileToUpload) {
        $newSheetFileName = $fileToUpload->getClientOriginalName();
        $fileToUpload->storeAs('/public/files/', $newSheetFileName);
        $newSheetFile = SheetFile::create([
          'id' => Str::uuid()->toString(),
          'sheetId' => $sheetId,
          'cellId' => $sheetCellId,
          'filename' => $newSheetFileName,
          'uploadedBy' => $user->name,
          'uploadedDate' => date('m-d-Y')
        ]);
      }
      return response()->json(
        SheetFile::where('cellId', $sheetCellId)
          ->orderBy('created_at')
          ->get()
      , 200);
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
    public function update(Request $request, SheetCellFile $file)
    {
      $file->update($request->all());
      return response()->json($file, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Cell  $file
     * @return \Illuminate\Http\Response
     */
    public function destroy(Cell $file)
    {
        //
    }
}
