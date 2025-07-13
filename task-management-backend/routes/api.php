<?php
// routes/api.php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TaskController;

// Authentication routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    
    // User routes (admin only)
    Route::middleware('admin')->group(function () {
        Route::apiResource('users', UserController::class);
    });
    
    // Task routes
    Route::apiResource('tasks', TaskController::class);
    Route::patch('tasks/{id}/status', [TaskController::class, 'updateStatus']);
});