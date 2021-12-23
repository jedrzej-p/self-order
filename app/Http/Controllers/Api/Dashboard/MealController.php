<?php

namespace App\Http\Controllers\Api\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Category;

class MealController extends Controller
{
    public function index(Request $request)
    {
        return response()->json(Product::where('name', 'like', '%' . $request->search . '%')->with('product_images', 'category')->get()->toArray());
    }

    public function edit($id)
    {
        return response()->json(Product::where('id', '=', $id)->with('product_images')->first()->toArray());
    }

    public function update(Request $request)
    {
        $id = $request->id;
        $name = $request->name;
        $category_id = $request->category;
        $description = $request->description;
        $price = $request->price;

        $update = Product::where('id', '=', $id)->update(['name'=>$name, 'category_id'=>$category_id, 'description'=>$description, 'price'=>$price]);
    }

    public function categories()
    {
        return response()->json(Category::get()->toArray());
    }

    public function create(Request $request)
    {
        $meal = new Product;
        $meal->name = $request->name;
        $meal->category_id = $request->category;
        $meal->description = $request->description;
        $meal->price = $request->price;

        $meal->save();
    }

    public function delete($id)
    {
        $delete = Product::where('id', '=', $id)->delete();
    }
}
