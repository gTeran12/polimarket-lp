<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\User;
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

    // FRONTEND: VER CARRITO
    public function frontendIndex(Request $request)
    {
        [$user, $guestId] = $this->resolveCartOwner($request);

        if (!$user && !$guestId) {
            return response()->json(['cart' => ['items' => [], 'subtotal' => 0]]);
        }

        $items = CartItem::with('product')
            ->when($user, fn ($query) => $query->where('user_id', $user->id))
            ->when(!$user, fn ($query) => $query->where('guest_id', $guestId))
            ->orderByDesc('created_at')
            ->get();

        $subtotal = $items->sum('price');

        return response()->json([
            'cart' => [
                'items' => $items,
                'subtotal' => $subtotal,
            ],
        ]);
    }

    // FRONTEND: AGREGAR AL CARRITO
    public function frontendStore(Request $request)
    {
        [$user, $guestId] = $this->resolveCartOwner($request);

        if (!$user && !$guestId) {
            return response()->json(['message' => 'Missing cart owner'], 400);
        }

        $validated = $request->validate([
            'product_id' => 'required|integer|exists:products,id',
            'qty' => 'nullable|integer|min:1',
        ]);

        $qty = $validated['qty'] ?? 1;
        $product = Product::findOrFail($validated['product_id']);
        $unitPrice = (float) $product->price;

        $itemQuery = CartItem::query()
            ->where('product_id', $product->id);

        if ($user) {
            $itemQuery->where('user_id', $user->id);
        } else {
            $itemQuery->where('guest_id', $guestId);
        }

        $item = $itemQuery->first();
        $newQty = $item ? $item->qty + $qty : $qty;
        $lineTotal = round($unitPrice * $newQty, 2);

        if ($item) {
            $item->qty = $newQty;
            $item->price = $lineTotal;
            $item->save();
        } else {
            $item = CartItem::create([
                'user_id' => $user?->id,
                'guest_id' => $guestId,
                'cart_id' => $user ? $user->id : $this->makeGuestCartId($guestId),
                'product_id' => $product->id,
                'qty' => $newQty,
                'price' => $lineTotal,
            ]);
        }

        $item->load('product');

        return response()->json($item, 201);
    }

    // FRONTEND: ACTUALIZAR CARRITO
    public function frontendUpdate(Request $request, CartItem $cartItem)
    {
        [$user, $guestId] = $this->resolveCartOwner($request);

        if (!$this->ownsCartItem($cartItem, $user, $guestId)) {
            return response()->json(['message' => 'Not found'], 404);
        }

        $validated = $request->validate([
            'qty' => 'required|integer|min:1',
        ]);

        $product = Product::findOrFail($cartItem->product_id);
        $cartItem->qty = $validated['qty'];
        $cartItem->price = round(((float) $product->price) * $cartItem->qty, 2);
        $cartItem->save();

        $cartItem->load('product');

        return response()->json($cartItem);
    }

    // FRONTEND: ELIMINAR ITEM
    public function frontendDestroy(Request $request, CartItem $cartItem)
    {
        [$user, $guestId] = $this->resolveCartOwner($request);

        if (!$this->ownsCartItem($cartItem, $user, $guestId)) {
            return response()->json(['message' => 'Not found'], 404);
        }

        $cartItem->delete();

        return response()->json(['message' => 'Deleted']);
    }

    private function resolveCartOwner(Request $request): array
    {
        $token = $request->bearerToken();
        $user = null;

        if ($token) {
            $tokenHash = hash('sha256', $token);
            $user = User::where('api_token', $tokenHash)->first();
        }

        $guestId = $request->header('X-Guest-ID');

        return [$user, $guestId];
    }

    private function ownsCartItem(CartItem $cartItem, ?User $user, ?string $guestId): bool
    {
        if ($user) {
            return (int) $cartItem->user_id === (int) $user->id;
        }

        if ($guestId) {
            return $cartItem->guest_id === $guestId;
        }

        return false;
    }

    private function makeGuestCartId(string $guestId): int
    {
        return (int) sprintf('%u', crc32($guestId));
    }
}
