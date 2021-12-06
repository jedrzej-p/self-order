<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\Product;
use App\Models\Favorite;
use App\Models\Rating;
use Auth;

class ProductController extends Controller
{
    public function getProducts() {
        return response()->json(Category::with('products', 'products.product_images')->get()->toArray());
    }

    public function getProductDetails($id) {
        return response()->json(Product::where('id', $id)->with('product_images')->first()->toArray());
    }

    public function ratings(Request $request)
    {
        $id = $request->id;
        
        return response()->json(Rating::where('product_id', '=', $id)->get());
    }

    public function search_products(Request $request)
    {
        $search = $request->search;
        $select_category = $request->select_category;

        if($search!='' && $select_category!='')
        {
            return response()->json(Product::where([['name', 'like', '%'.$search.'%'], ['category_id', '=', $select_category]])->with('product_images')->get()->toArray());
        }
        if($search=='' && $select_category!='')
        {
            return response()->json(Product::where('category_id', '=', $select_category)->with('product_images')->get()->toArray());
        }
        else
        {
            return response()->json(Product::where('name', 'like', '%'.$search.'%')->orWhere('category_id', '=', $select_category)->with('product_images')->get()->toArray());
        }
    }

    public function addProductToFavorite(Request $request) {

        $favorite = new Favorite;
        $favorite->product_id = $request->product_id;
        $favorite->user_id = Auth::user()->id;
        $favorite->save();

        return response()->json([
            'message' => 'Dodano produkt do ulubionych'
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
            'message' => 'Usunięto produkt z ulubionych'
        ]);
    }
}
