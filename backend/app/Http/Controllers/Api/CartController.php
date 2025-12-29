<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use Illuminate\Http\Request;

class CartController extends Controller
{
    // VER CARRITO
    public function index()
    {
        return response()->json(CartItem::all());
    }

    // AGREGAR AL CARRITO
    public function store(Request $request)
    {
        $request->validate([
            'cart_id' => 'required|integer',
            'product_id' => 'required|integer',
            'qty' => 'required|integer',
            'price' => 'required|numeric',
        ]);

        $item = CartItem::create([
            'user_id' => $request->user_id,
            'guest_id' => $request->guest_id,
            'cart_id' => $request->cart_id,
            'product_id' => $request->product_id,
            'qty' => $request->qty,
            'price' => $request->price,
        ]);

        return response()->json($item, 201);
    }
}
