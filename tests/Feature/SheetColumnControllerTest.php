<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Str;

use Tests\TestCase;

use App\Models\User;
use App\Models\Sheet;

class SheetColumnControllerTest extends TestCase
{
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function testSheetColumnControllerStore()
    {
        $user = User::first();
        $sheet = $user->testSheet();
        [ $newColumns, $newCells ] = $this->getNewColumnsAndCells($sheet, 1);
        $response = $this->actingAs($user)->postJson('/app/sheets/columns', [
            'newColumns' => $newColumns,
            'newCells' => $newCells
        ]);
        $response->assertStatus(200);
    }

    private function getNewColumnsAndCells($sheet, $numberOfColumns)
    {
        $newColumns = [];
        $newCells = [];

        for($i = 0; $i <= $numberOfColumns; $i++) {
            $columnId = Str::uuid()->toString();
            array_push($newColumns, [
                'id' => $columnId,
                'sheetId' => $sheet->id,
                'name' => 'New Column '.$i,
                'cellType' => 'STRING',
                'width' => 100,
                'defaultValue' => null,
                'trackCellChanges' => false,
                'showCellChanges' => true
            ]);
            foreach($sheet->rows as $row) {
                array_push($newCells, [
                    'id' => Str::uuid()->toString(),
                    'sheetId' => $sheet->id,
                    'columnId' => $columnId,
                    'rowId' => $row->id,
                    'value' => null
                ]);
            }
        }

        return [ $newColumns, $newCells ];
    }
}
