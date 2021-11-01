<?php

namespace App\Http\Controllers\Api\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrdersPosition;
use App\Models\Product;
use Auth;
use DB;

class OrderController extends Controller
{

    public function index() {
        return response()->json(Order::where('status', '!=', 1)->with('positions', 'positions.product')->get()->toArray());
    }

}