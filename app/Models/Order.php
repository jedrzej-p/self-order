<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use DateTime;

class Order extends Model
{

    public function positions()
    {
        return $this->hasMany(OrdersPosition::class);
    }

    public function setValue() {

        $this->value = 0;
        $orderPositions = OrdersPosition::where('order_id', $this->id)->get();
        foreach($orderPositions as $orderPosition) {
            $this->value = $this->value + ($orderPosition->price *$orderPosition->quantity);
            $this->save();
        }

        $this->save();
    }

    public function setNewOrderNumber() {
        $maxNumber = static::max('nr');
        $firstPartInt = (int)explode('-', $maxNumber)[0];
        $increment = sprintf('%04d', $firstPartInt + 1);

        return $increment . date_format(new DateTime(date('Y-m-d')), 'my');
    }
}
