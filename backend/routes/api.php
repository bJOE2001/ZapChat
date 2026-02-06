<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ConversationController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| REST API routes for the ZapChat backend. All routes are prefixed with /api.
|
*/

Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'message' => 'ZapChat API is running',
        'timestamp' => now()->toIso8601String(),
    ]);
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware(['auth:sanctum', \App\Http\Middleware\UpdateUserLastActivity::class])->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);

    Route::get('/users', [UserController::class, 'index']);
    Route::get('/message-requests', [ConversationController::class, 'messageRequests']);
    Route::post('/conversations/{id}/accept', [ConversationController::class, 'accept'])->name('conversations.accept');
    Route::apiResource('conversations', ConversationController::class)->only(['index', 'store', 'show', 'destroy']);
    Route::get('/conversations/{conversation}/messages', [MessageController::class, 'index']);
    Route::post('/conversations/{conversation}/messages', [MessageController::class, 'store']);
});
