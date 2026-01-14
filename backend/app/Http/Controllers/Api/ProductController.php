<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        if (!$this->adminFromToken($request)) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $products = Product::with('category')
            ->orderByDesc('created_at')
            ->get();

        return response()->json(['products' => $products]);
    }

    public function frontendIndex()
    {
        $products = Product::with('category')
            ->where('active', true)
            ->orderByDesc('created_at')
            ->get();

        return response()->json(['products' => $products]);
    }

    public function store(Request $request)
    {
        if (!$this->adminFromToken($request)) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $request->merge([
            'category_id' => $request->input('category_id') === '' ? null : $request->input('category_id'),
            'compare_at_price' => $request->input('compare_at_price') === '' ? null : $request->input('compare_at_price'),
        ]);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255',
            'category_id' => 'nullable|integer|exists:categories,id',
            'price' => 'required|numeric|min:0',
            'compare_at_price' => 'nullable|numeric|min:0',
            'image' => 'nullable|image|max:2048',
            'active' => 'nullable|boolean',
        ]);

        $product = new Product();
        $product->name = $validated['name'];
        $product->slug = $this->makeUniqueSlug($validated['slug'] ?? $validated['name']);
        $product->category_id = $this->normalizeNullableInt($validated['category_id'] ?? null);
        $product->price = $validated['price'];
        $product->compare_at_price = $this->normalizeNullableNumber($validated['compare_at_price'] ?? null);
        $product->active = $request->has('active')
            ? $request->boolean('active')
            : true;
        $product->image = $this->storeImage($request);
        $product->save();

        return response()->json($product, 201);
    }

    public function update(Request $request, Product $product)
    {
        if (!$this->adminFromToken($request)) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $request->merge([
            'category_id' => $request->input('category_id') === '' ? null : $request->input('category_id'),
            'compare_at_price' => $request->input('compare_at_price') === '' ? null : $request->input('compare_at_price'),
        ]);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255',
            'category_id' => 'nullable|integer|exists:categories,id',
            'price' => 'required|numeric|min:0',
            'compare_at_price' => 'nullable|numeric|min:0',
            'image' => 'nullable|image|max:2048',
            'active' => 'nullable|boolean',
        ]);

        $product->name = $validated['name'];
        $product->slug = $this->makeUniqueSlug(
            $validated['slug'] ?? $validated['name'],
            $product->id
        );
        $product->category_id = $this->normalizeNullableInt($validated['category_id'] ?? null);
        $product->price = $validated['price'];
        $product->compare_at_price = $this->normalizeNullableNumber($validated['compare_at_price'] ?? null);
        if ($request->has('active')) {
            $product->active = $request->boolean('active');
        }

        $image = $this->storeImage($request, $product);
        if ($image !== null) {
            $product->image = $image;
        }

        $product->save();

        return response()->json($product);
    }

    public function destroy(Request $request, Product $product)
    {
        if (!$this->adminFromToken($request)) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $this->deleteImage($product->image);
        $product->delete();

        return response()->json(['message' => 'Deleted']);
    }

    private function makeUniqueSlug(string $value, ?int $ignoreId = null): string
    {
        $base = Str::slug($value);
        $base = $base !== '' ? $base : 'product';
        $slug = $base;
        $counter = 2;

        while ($this->slugExists($slug, $ignoreId)) {
            $slug = $base . '-' . $counter;
            $counter++;
        }

        return $slug;
    }

    private function slugExists(string $slug, ?int $ignoreId = null): bool
    {
        $query = Product::where('slug', $slug);

        if ($ignoreId) {
            $query->where('id', '!=', $ignoreId);
        }

        return $query->exists();
    }

    private function storeImage(Request $request, ?Product $product = null): ?string
    {
        if (!$request->hasFile('image')) {
            return $product ? $product->image : null;
        }

        $file = $request->file('image');
        $directory = public_path('uploads/products');

        if (!File::exists($directory)) {
            File::makeDirectory($directory, 0755, true);
        }

        $extension = $file->getClientOriginalExtension();
        $filename = Str::uuid()->toString();
        if ($extension) {
            $filename .= '.' . $extension;
        }

        $file->move($directory, $filename);

        if ($product && $product->image) {
            $this->deleteImage($product->image);
        }

        return $filename;
    }

    private function deleteImage(?string $image): void
    {
        if (!$image) {
            return;
        }

        $path = public_path('uploads/products/' . $image);

        if (File::exists($path)) {
            File::delete($path);
        }
    }

    private function normalizeNullableInt($value): ?int
    {
        if ($value === '' || $value === null) {
            return null;
        }

        return (int) $value;
    }

    private function normalizeNullableNumber($value): ?string
    {
        if ($value === '' || $value === null) {
            return null;
        }

        return (string) $value;
    }
}
