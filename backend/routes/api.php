<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AdminAuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;


Route::get('/test', function () {
    return response()->json([
        'message' => 'API funcionando correctamente'
    ]);
});

// AUTH
Route::post('/login', [AuthController::class, 'login']);
Route::get('/user', [AuthController::class, 'user']);
Route::post('/logout', [AuthController::class, 'logout']);

// ADMIN AUTH
Route::prefix('backend')->group(function () {
    Route::post('/login', [AdminAuthController::class, 'login']);
    Route::get('/user', [AdminAuthController::class, 'user']);
    Route::post('/logout', [AdminAuthController::class, 'logout']);

    Route::get('/products', [ProductController::class, 'index']);
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{product}', [ProductController::class, 'update']);
    Route::delete('/products/{product}', [ProductController::class, 'destroy']);

    Route::get('/categories', [CategoryController::class, 'index']);
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{category}', [CategoryController::class, 'update']);
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);
    Route::get('/categories-list', [CategoryController::class, 'listForAdmin']);

    Route::get('/users', [UserController::class, 'index']);
});

// CATEGORÍAS
Route::get('/categories', [CategoryController::class, 'index']);
Route::post('/categories', [CategoryController::class, 'store']);

Route::get('/users', [UserController::class, 'index']);
Route::post('/users', [UserController::class, 'store']);

Route::get('/cart', [CartController::class, 'index']);
Route::post('/cart', [CartController::class, 'store']);

Route::prefix('frontend')->group(function () {
    Route::get('/products', [ProductController::class, 'frontendIndex']);
    Route::get('/cart', [CartController::class, 'frontendIndex']);
    Route::post('/cart', [CartController::class, 'frontendStore']);
    Route::put('/cart/{cartItem}', [CartController::class, 'frontendUpdate']);
    Route::delete('/cart/{cartItem}', [CartController::class, 'frontendDestroy']);
});
