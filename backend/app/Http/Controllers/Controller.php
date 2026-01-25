<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Http\Request;
use App\Models\User; // <--- ¡ESTA ES LA LÍNEA CLAVE QUE FALTABA!

class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;

    // Herramienta 1: Para buscar cualquier usuario
    protected function userFromToken(Request $request): ?User
    {
        $token = $request->bearerToken();
        if (!$token) return null;
        
        $tokenHash = hash('sha256', $token);
        
        return User::where('api_token', $tokenHash)->first();
    }

    // Herramienta 2: Para buscar SOLO administradores
    protected function adminFromToken(Request $request): ?User
    {
        $user = $this->userFromToken($request);
        return ($user && $user->is_admin) ? $user : null;
    }
}