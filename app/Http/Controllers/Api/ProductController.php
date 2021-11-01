<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;

class ProductController extends Controller
{
    public function getProducts() {
        return response()->json(Category::with('products', 'products.product_images')->get()->toArray());
    }
    public function getProductDetails($id) {
        return response()->json(Product::where('id', $id)->with('product_images')->first()->toArray());
    }
}