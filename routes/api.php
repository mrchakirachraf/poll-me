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
    Route::post('/sondages', [SondageController::class, 'createSondage']);
    Route::get('/sondages/{id_sondage}', [SondageController::class, 'show']);

    Route::post('/sondages/{id_sondage}/responses', [SondageController::class, 'handleParticipation']);
    Route::delete('/sondages/{id_sondage}', [SondageController::class, 'deleteSondage']);
    Route::put('/sondages/{id}', [SondageController::class, 'updateSondage']);


    Route::get('/sondages/user/{id_user}', [SondageController::class, 'getSondagesByUser']);
    Route::get('/sondages/{id_sondage}/statistics', [SondageController::class, 'getSondageStatistics']);

});

use App\Http\Controllers\AuthController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');


