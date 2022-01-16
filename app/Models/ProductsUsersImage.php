<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductsUsersImage extends Model
{
    use HasFactory;

    public function product_user_image()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
}
