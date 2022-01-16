<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function product_images()
    {
        return $this->hasMany(ProductsImage::class);
    }

    public function product_user_image()
    {
        return $this->hasMany(ProductsUsersImage::class);
    }
}
