<?php

namespace App\Chatbot;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class AiChatController extends Controller
{
    /**
     * Return the AI bot user (id, name) so the frontend can start a chat with it.
     */
    public function aiUser(): JsonResponse
    {
        $aiUser = User::where('email', AiChat::AI_USER_EMAIL)->first(['id', 'name']);
        if (!$aiUser) {
            return response()->json(['message' => 'Bototoy is not set up. Run: php artisan db:seed'], 404);
        }
        return response()->json(['id' => $aiUser->id, 'name' => $aiUser->name]);
    }
}
