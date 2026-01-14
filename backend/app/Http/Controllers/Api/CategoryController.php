<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        if ($request->is('api/backend/*') && !$this->adminFromToken($request)) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        return response()->json(Category::all());
    }

    public function store(Request $request)
    {
        if (!$this->adminFromToken($request)) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:categories,slug',
            'description' => 'nullable|string',
            'status' => 'nullable|boolean',
        ]);

        $category = Category::create([
            'name' => $request->name,
            'slug' => $request->slug ? Str::slug($request->slug) : null,
            'description' => $request->description,
            'status' => $request->boolean('status', true),
        ]);

        return response()->json($category, 201);
    }

    public function update(Request $request, Category $category)
    {
        if (!$this->adminFromToken($request)) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:categories,slug,' . $category->id,
            'description' => 'nullable|string',
            'status' => 'nullable|boolean',
        ]);

        $category->name = $request->name;
        $category->slug = Str::slug($request->slug ?: $request->name);
        $category->description = $request->description;
        if ($request->has('status')) {
            $category->status = $request->boolean('status');
        }
        $category->save();

        return response()->json($category);
    }

    public function destroy(Request $request, Category $category)
    {
        if (!$this->adminFromToken($request)) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $category->delete();

        return response()->json(['message' => 'Deleted']);
    }

    public function listForAdmin(Request $request)
    {
        if (!$this->adminFromToken($request)) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        return response()->json(
            Category::orderBy('name')->get(['id', 'name'])
        );
    }
}
