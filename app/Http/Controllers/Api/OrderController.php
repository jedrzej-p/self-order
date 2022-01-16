<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrdersPosition;
use App\Models\Product;
use Auth;
use Mail;
use DB;
use App\Models\Tools;
use Illuminate\Mail\Transport\Transport;

class OrderController extends Controller
{

    public function addToCart(Request $request)
    {
        $product = Product::find($request->product_id);

        DB::transaction(function () use ($request) {
            $now = \Carbon\Carbon::now();
            $order = null;
            $orderId = NULL;
            if (!session()->exists('order_id')) {
                $order = new Order;
                $order->user_id = Auth::user() ? Auth::user()->id : NULL;
                $order->date = $now;
                $order->status = 0;
                $order->value = 0;
                $order->save();
                $orderId = $order->id;
                session()->push('order_id', $order->id);
            } else {
                $order = Order::where('id', session('order_id'))->first();
                if($order) {
                    $orderId = $order->id;
                }
                else {
                    $order = new Order;
                    $order->user_id = Auth::user()->id ? Auth::user()->id : NULL;
                    $order->date = $now;
                    $order->status = 0;
                    $order->value = 0;
                    $order->save();
                    $orderId = $order->id;
                    session()->push('order_id', $order->id);
                }
            }
            $productId = Product::find($request->product_id);
            $orderPosition = OrdersPosition::where('order_id', $orderId)->where("product_id", $productId->id)->first() ?? new OrdersPosition;
            $orderPosition->product_id = $productId->id;
            $orderPosition->order_id = $order->id;
            $orderPosition->price = $productId->price;
            $orderPosition->quantity = $request->quantity;
            $orderPosition->save();
            $order->setValue();



        });

        return response()->json([
            'message' => 'Dodano do zamówienia'
        ]);
    }

    public function RemoveFromCart($id) {
        $orderPosition = OrdersPosition::find($id);
        $order = Order::find($orderPosition->order_id);
        $orderPosition->delete();
        $order->setValue();

        return response()->json([
            'message' => 'Usunięto z zamówienia'
        ]);
    }

    public function cart() {
        $order = Order::where('id', session('order_id'))->where('value', '!=', 0)->with('positions', 'positions.product')->first();
        if($order) {
            return response()->json(Order::where('id', session('order_id'))->where('value', '!=', 0)->with('positions', 'positions.product')->first()->toArray());
        }
        else {
            return response()->json(Order::where('id', session('order_id'))->where('value', '!=', 0)->with('positions', 'positions.product')->first());
        }
    }

    public function updateAdditionalInformations(Request $request) {
        $order = Order::where('id', session('order_id'))->first();
        $order->additional_informations = $request->additional_informations;
        $order->save();
    }

    public function updateTables(Request $request) {
        $order = Order::where('id', session('order_id'))->first();
        $order->table_id = $request->table_id;
        $order->save();
    }


    public function storeCart(Request $request) {

        DB::transaction(function () use ($request) {

            $now = \Carbon\Carbon::now();
            $order = Order::where('id', session('order_id'))->first();
            $order->nr = $order->setNewOrderNumber();
            $order->value = $order->value;
            $order->status = 1;
            $order->save();
            session()->forget('order_id');


          $basic  = new \Nexmo\Client\Credentials\Basic('056442ca', 'eA6IodTAQddanAIJ');
            $client = new \Nexmo\Client($basic);

            //wysyłanie SMS
            $message = $client->message()->send([
                'to' => '48505294967',
                'from' => 'Restauracja SelfOrder',
                'text' => 'Zlozono nowe zamowienie'
            ]);

            try {
                Mail::to($order->email)->send(new OrderShipped($order));
            } catch (Exception $e) {
            }  

        });

        return response()->json([
            'message' => 'Zamówienie zostało złożone'
        ]);

    }

    public function getSignature() {
        $order = Order::where('id', session('order_id'))->first();
        $signature = Tools::generateSignature($order);

        return response()->json($signature);
    }

    public function notify(Request $request, $id) {
        
            //pamietać o dodaniu w pliku VerifyCsrfToken
        $requestData = file_get_contents("php://input");
        $json = json_decode($requestData, true);
        $jsonOrderId = $json["order"]["orderId"];
        $jsonOrderStatus = $json["order"]["status"];
        $jsonOrderMerchantPosId = $json["order"]["merchantPosId"];

        if ($jsonOrderStatus === "COMPLETED") {

            $order = Order::where('id', $id)->first();
            $order->is_paid = 1;
            $order->save();

            return response('OK', 200)->header('Content-Type', 'text/plain');
        }
    }

}