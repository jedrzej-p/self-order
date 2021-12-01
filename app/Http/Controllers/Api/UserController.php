<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\User;
use App\Models\Order;
use App\Models\Tools;
use App\Models\Favorite;
use App\Models\Product;
use Auth;
use Exception;

class UserController extends Controller
{

    public function getLoggedUser(Request $request)
    {
        try {
            return User::GetLogged($request);
        } catch (Exception $e) {
            $error = Tools::GetErrorDetails($e);
            return response()->json( $error->json_array, $error->code );
        }
    }

    public function getOrders() {
        return response()->json(Order::where('status', '!=', 1)->where('user_id', Auth::user()->id)->with('positions')->get()->toArray());
    }

    public function getFavorites() {
        $products = Favorite::where('user_id', Auth::user()->id)->get();
        $p = array();
        foreach($products as $product) {
            $p[] = $product->id;
        }
        return response()->json(Product::whereIn('id', $p)->get()->toArray());
    }

}
