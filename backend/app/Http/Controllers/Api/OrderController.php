<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\CartItem; // Usamos tu modelo existente
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    // CREAR ORDEN (CHECKOUT)
    public function store(Request $request)
    {
        // 1. Identificar al usuario (Sistema manual)
        $user = $this->userFromToken($request);

        if (!$user) {
            return response()->json(['message' => 'Debes iniciar sesión para comprar.'], 401);
        }

        // 2. Validar datos de entrada
        $request->validate([
            'address.name' => 'required',
            'address.street' => 'required',
            'address.city' => 'required',
            'payment_method' => 'required|in:cod,stripe,paypal',
        ]);

        // 3. Obtener los productos DIRECTAMENTE de CartItem usando el user_id
        // (Aquí estaba el error antes, ahora lo hacemos directo)
        $cartItems = CartItem::where('user_id', $user->id)
            ->with('product')
            ->get();

        if ($cartItems->isEmpty()) {
            return response()->json(['message' => 'El carrito está vacío'], 400);
        }

        // 4. Calcular Total
        $total = 0;
        foreach ($cartItems as $item) {
            // Aseguramos que el producto exista y tenga precio
            if ($item->product) {
                $total += $item->product->price * $item->qty;
            }
        }

        // 5. Iniciar Transacción
        return DB::transaction(function () use ($user, $request, $total, $cartItems) {
            
            // A) Crear la Orden
            $order = Order::create([
                'user_id' => $user->id,
                'total' => $total,
                'payment_method' => $request->payment_method,
                'payment_status' => ($request->payment_method === 'cod') ? 'unpaid' : 'paid',
                'order_status' => 'pending',
                'address' => $request->address,
            ]);

            // B) Mover Items del Carrito a OrderItems
            foreach ($cartItems as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item->product_id,
                    'quantity' => $item->qty, // Tu modelo usa 'qty', no 'quantity'
                    'price' => $item->product->price,
                ]);
            }

            // C) Vaciar el Carrito del usuario
            // Simplemente borramos los items asociados a este usuario
            CartItem::where('user_id', $user->id)->delete();

            return response()->json([
                'message' => 'Orden creada exitosamente',
                'order_id' => $order->id
            ], 201);
        });
    }
    
    // VER HISTORIAL DE ORDENES
    public function index(Request $request) {
        $user = $this->userFromToken($request);
        
        if(!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        
        $orders = Order::where('user_id', $user->id)
                       ->with('items.product')
                       ->latest()
                       ->get();
                       
        return response()->json($orders);
    }

    // VER DETALLE DE UNA ORDEN
    public function show(Request $request, $id)
    {
        // 1. Identificar al usuario
        $user = $this->userFromToken($request);

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // 2. Buscar la orden con sus productos
        $order = Order::with('items.product')->find($id);

        // 3. Validar: ¿Existe? ¿Es de este usuario?
        if (!$order || $order->user_id !== $user->id) {
            return response()->json(['message' => 'Orden no encontrada o acceso denegado'], 404);
        }

        return response()->json($order);
    }
}