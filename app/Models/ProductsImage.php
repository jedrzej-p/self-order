<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductsImage extends Model
{
    protected $fillable = ['url'];

    public function product_image()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }

}


