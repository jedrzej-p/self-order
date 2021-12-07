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
        return response()->json(Order::where('status', '!=', 0)->with('positions', 'positions.product', 'positions.product.product_images')->get()->toArray());
    }

    public function getOrdersByStatus($id) {
        if($id = 5) {
            return response()->json(Order::where('status', '!=', 0)->with('positions', 'positions.product', 'positions.product.product_images')->get()->toArray());
        }
        else {
            return response()->json(Order::where('status', '==', $request->status)->with('positions', 'positions.product', 'positions.product.product_images')->get()->toArray());
        }
    }

    public function changeStatus(Request $request, $id) {
        $order = Order::where('id', $id)->first();
        $order->status = $request->status;
        $order->save();

        return response()->json([
            'message' => 'Status został zmieniony'
        ]);
    }

}