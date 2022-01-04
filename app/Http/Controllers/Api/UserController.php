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
        return response()->json(Order::where('status', '>', 0)->where('user_id', Auth::user()->id)->with('positions', 'positions.product', 'positions.product.product_images')->orderBy('id', 'desc')->get()->toArray());
    }

    public function getFavorites() {
        $products = Favorite::where('user_id', Auth::user()->id)->get();
        $p = array();
        foreach($products as $product) {
            $p[] = $product->product_id;
        }
        return response()->json(Product::whereIn('id', $p)->with('product_images')->get()->toArray());
    }

}
