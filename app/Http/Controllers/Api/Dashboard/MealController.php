<?php

namespace App\Http\Controllers\Api\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Category;
use App\Models\ProductsImage;

class MealController extends Controller
{
    public function index(Request $request)
    {
        return response()->json(Product::where('name', 'like', '%' . $request->search . '%')->with('product_images', 'category')->get()->toArray());
    }

    public function edit($id)
    {
        return response()->json(Product::where('id', '=', $id)->with('product_images', 'product_user_image')->first()->toArray());
    }

    public function update(Request $request)
    {
        $id = $request->id;
        $name = $request->name;
        $category_id = $request->category;
        $description = $request->description;
        $price = $request->price;
        $photo_id = $request->old_photo_id;

        $update = Product::where('id', '=', $id)->update(['name'=>$name, 'category_id'=>$category_id, 'description'=>$description, 'price'=>$price]);


        if($request->file('photo'))
        {
            $file = $request->file('photo');
            $fileName_temp = $file->getClientOriginalName();
            $fileName = time().$fileName_temp;

            $destinationPath = public_path().'/images/products';
            $file->move($destinationPath,$fileName);

            $update_photo = ProductsImage::where('id', '=', $photo_id)->update(['url'=>$fileName]);
        }
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

        $file = $request->file('photo');
        $fileName_temp = $file->getClientOriginalName();
        $fileName = time().$fileName_temp;

        $meal_photo = new ProductsImage;
        $meal_photo->url = $fileName;
        $meal_photo->product_id = $meal->id;

        $meal_photo->save();

        $destinationPath = public_path().'/images/products' ;
        $file->move($destinationPath,$fileName);
    }

    public function delete($id)
    {
        $delete = Product::where('id', '=', $id)->delete();
    }
}
