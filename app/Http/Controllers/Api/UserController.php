<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\User;
use App\Models\Order;
use App\Models\Tools;
use App\Models\Favorite;
use App\Models\Product;
use App\Models\ProductsUsersImage;
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

    public function getCurrentUser()
    {
        $current_user = User::where('id', '=', Auth::user()->id)->first();
        return response()->json($current_user);
    }

    public function image_delete(Request $request)
    {
        $image_id = $request->image_id;

        $delete_image = ProductsUsersImage::where('id', '=', $image_id)->delete();
    }

}
