<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    // ---------------------------------------------------
    // LISTAR USUARIOS (Solo para Administradores)
    // ---------------------------------------------------
    public function index(Request $request)
    {
        // verificar si es admin
        if (!$this->adminFromToken($request)) {
            return response()->json(['message' => 'No autorizado. Solo administradores.'], 401);
        }

        return response()->json(User::all());
    }

    // ---------------------------------------------------
    // REGISTRO PÚBLICO (Cualquiera puede crear una cuenta)
    // ---------------------------------------------------
    public function store(Request $request)
    {
        // 1. Validación Automática
        // Si esto falla, Laravel detiene todo y devuelve los errores (422) automáticamente.
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed', // 'confirmed' revisa password_confirmation
        ]);

        // 2. Crear el usuario NORMAL
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password), // Encriptamos contraseña
            'is_admin' => false, 
            'api_token' => null, // Nace sin sesión iniciada
        ]);

        return response()->json([
            'message' => 'Usuario registrado exitosamente',
            'user' => $user
        ], 201);
    }

    // ACTUALIZAR PERFIL (Solo el propio usuario)
    public function update(Request $request)
    {
        
        $user = $this->userFromToken($request);

        if (!$user) {
            return response()->json(['message' => 'No autorizado'], 401);
        }

        // 2. Validar los datos
        $request->validate([
            'name'  => 'required|string|max:255',
            'phone' => 'nullable|string|max:20', // El teléfono es opcional
            // 'email' => ... (Omitimos email por ahora para no complicar con verificaciones)
        ]);

        // 3. Actualizar los datos
        $user->update([
            'name' => $request->name,
            'phone' => $request->phone,
        ]);

        return response()->json([
            'message' => 'Perfil actualizado correctamente',
            'user' => $user
        ]);
    }

    // CAMBIAR CONTRASEÑA
    public function updatePassword(Request $request)
    {
        // 1. Identificar al usuario
        $user = $this->userFromToken($request);

        if (!$user) {
            return response()->json(['message' => 'No autorizado'], 401);
        }

        // 2. Validar formato de los datos
        $request->validate([
            'current_password' => 'required',
            'password' => 'required|string|min:6|confirmed', 
        ]);

        // VERIFICAR QUE LA CONTRASEÑA ACTUAL SEA CORRECTA
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'message' => 'La contraseña actual es incorrecta',
                'errors' => ['current_password' => ['La contraseña actual no coincide.']]
            ], 422); 
        }

        
        $user->password = Hash::make($request->password);
        $user->save();

        return response()->json([
            'message' => 'Contraseña actualizada correctamente'
        ]);
    }
}