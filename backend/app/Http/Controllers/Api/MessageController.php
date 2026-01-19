<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MessageController extends Controller
{
    public function index()
    {
        $messages = Message::with('user')->latest()->get();
        return response()->json($messages);
    }

    public function store(Request $request)
    {
        $request->validate([
            'message' => 'required|string',
        ]);

        $message = Message::create([
            'user_id' => Auth::check() ? Auth::id() : null,
            'message' => $request->message,
        ]);

        $message->load('user');

        return response()->json($message, 201);
    }
}
