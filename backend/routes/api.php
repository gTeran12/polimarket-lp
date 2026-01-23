<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AdminAuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\OrderController;


Route::get('/test', function () {
    return response()->json([
        'message' => 'API funcionando correctamente'
    ]);
});

// ----------------------------------------------------
// RUTAS PÚBLICAS
// ----------------------------------------------------

Route::post('/login', [AuthController::class, 'login']);
Route::post('/users', [UserController::class, 'store']); 

Route::get('/categories', [CategoryController::class, 'index']);

// Carrito
Route::get('/cart', [CartController::class, 'index']);
Route::post('/cart', [CartController::class, 'store']);

// Frontend Público
Route::prefix('frontend')->group(function () {
    Route::get('/products', [ProductController::class, 'frontendIndex']);
    Route::get('/cart', [CartController::class, 'frontendIndex']);
    Route::post('/cart', [CartController::class, 'frontendStore']);
    Route::put('/cart/{cartItem}', [CartController::class, 'frontendUpdate']);
    Route::delete('/cart/{cartItem}', [CartController::class, 'frontendDestroy']);
});

Route::prefix('frontend')->group(function () {
    
    // Crear Orden (Checkout)
    Route::post('/orders', [OrderController::class, 'store']);
    
    // Ver mis ordenes (Historial)
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
});

// ----------------------------------------------------
// RUTAS PROTEGIDAS (Validación Manual en Controlador)
// ----------------------------------------------------
// OJO: Quité "middleware('auth:sanctum')" porque usas validación manual.
// Tus controladores usarán $this->userFromToken() para protegerse.

// USUARIO
Route::get('/user', [AuthController::class, 'user']);
Route::post('/logout', [AuthController::class, 'logout']);
// PERFIL
Route::put('/user', [UserController::class, 'update']);
Route::put('/user/password', [UserController::class, 'updatePassword']);

// MENSAJES
Route::get('/messages', [MessageController::class, 'index']);
Route::post('/messages', [MessageController::class, 'store']);


// ----------------------------------------------------
// ADMIN / BACKEND
// ----------------------------------------------------
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