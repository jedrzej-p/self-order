<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Table;
use Exception;

class TableController extends Controller
{

    public function index() {
        return response()->json(Table::get()->toArray());
    }

}
