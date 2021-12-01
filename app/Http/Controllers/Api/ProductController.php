<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\Product;
use App\Models\Favorite;
use Auth;

class ProductController extends Controller
{
    public function getProducts() {
        return response()->json(Category::with('products', 'products.product_images')->get()->toArray());
    }
    public function getProductDetails($id) {
        return response()->json(Product::where('id', $id)->with('product_images')->first()->toArray());
    }

    public function addProductToFavorite(Request $request) {

        $favorite = new Favorite;
        $favorite->product_id = $request->product_id;
        $favorite->user_id = Auth::user()->id;
        $favorite->save();

        return response()->json([
            'message' => 'Polubiłeś dany produkt'
        ]);
    }

    public function VerifyProductFavorite($id) {
        $favorite = Favorite::where('product_id', $id)->where('user_id', Auth::user()->id)->first();
        if($favorite) {
            return 1; 
        }
    }

    public function removeProductFromFavorite(Request $request) {
        $favorite = Favorite::where('product_id', $request->product_id)->where('user_id', Auth::user()->id)->first();
        $favorite->delete(); 

        return response()->json([
            'message' => 'Przestałeś lubić dany produkt'
        ]);
    }
}