<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrdersPosition extends Model
{
    public function order()
    {
        return $this->belongsTo(Order::class, 'order_id');
    }

    public function product()
    {
        return $this->belongsTo('App\Models\Product', 'product_id', 'id');
    }
}
