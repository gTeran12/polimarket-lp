<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

abstract class Controller
{
    protected function adminFromToken(Request $request): ?User
    {
        $token = $request->bearerToken();

        if (!$token) {
            return null;
        }

        $tokenHash = hash('sha256', $token);

        return User::where('api_token', $tokenHash)
            ->where('is_admin', true)
            ->first();
    }
}
