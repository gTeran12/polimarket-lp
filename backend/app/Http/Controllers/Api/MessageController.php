<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller; // Importante heredar del Padre
use App\Models\Message;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function index(Request $request)
    {
        // Opcional: Si quieres que solo usuarios logueados vean mensajes,
        // descomenta las siguientes líneas:
        /*
        $user = $this->userFromToken($request);
        if (!$user) return response()->json(['message' => 'Unauthorized'], 401);
        */

        // Cargar mensajes con el nombre del usuario
        $messages = Message::with('user')->latest()->get();
        return response()->json($messages);
    }

    public function store(Request $request)
    {
        // 1. Validar que el mensaje no esté vacío
        $request->validate([
            'message' => 'required|string',
        ]);

        // 2. IDENTIFICAR AL USUARIO (Usando la herramienta manual del Padre)
        $user = $this->userFromToken($request);

        // 3. Si no hay usuario (token inválido o no enviado), bloqueamos
        if (!$user) {
            return response()->json(['message' => 'Debes iniciar sesión para enviar mensajes.'], 401);
        }

        // 4. Crear el mensaje usando el ID del usuario que encontramos
        $message = Message::create([
            'user_id' => $user->id, // <--- Usamos el ID del usuario real
            'message' => $request->message,
        ]);

        $message->load('user');

        return response()->json($message, 201);
    }
}