<?php

namespace App\Http\Controllers\Api\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        return response()->json(Category::where('name', 'like', '%' . $request->search . '%')->get()->toArray());
    }

    public function edit($id)
    {
        return response()->json(Category::where('id', '=', $id)->first()->toArray());
    }

    public function update(Request $request)
    {
        $id = $request->id;
        $name = $request->name;

        $update = Category::where('id', '=', $id)->update(['name'=>$name]);
    }

    public function create(Request $request)
    {
        $category = new Category;
        $category->name = $request->name;
        

        $category->save();
    }

    public function delete($id)
    {
        $delete = Category::where('id', '=', $id)->delete();
    }
}
