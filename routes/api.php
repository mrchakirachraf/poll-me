<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

use App\Http\Controllers\SondageController;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/sondages', [SondageController::class, 'index']);
    Route::post('/sondages', [SondageController::class, 'store']);
    Route::get('/sondages/{id}', [SondageController::class, 'show']);
    Route::get('/dashboard', [SondageController::class, 'stats']);
});

use App\Http\Controllers\AuthController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');


