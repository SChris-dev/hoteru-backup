<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\UserController;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');


// auth
// Route::post('login', [AuthController::class, 'login2']);
Route::post('/v1/auth/login', [AuthController::class, 'login']);
Route::post('/v1/auth/register', [AuthController::class, 'register']);


Route::middleware('auth:sanctum')->group(function () {
    // logout
    Route::post('/v1/auth/logout', [AuthController::class, 'logout']);

    // room category
    Route::post('/v1/roomcategory', [RoomController::class, 'createCategory']);
    Route::get('/v1/roomcategory', [RoomController::class, 'readCategories']);
    Route::get('/v1/roomcategory/{category_id}', [RoomController::class, 'readCategory']);
    Route::put('/v1/roomcategory/{category_id}', [RoomController::class, 'updateCategory']);
    Route::delete('/v1/roomcategory/{category_id}', [RoomController::class, 'deleteCategory']);

    // rooms
    Route::post('/v1/rooms', [RoomController::class, 'createRoom']);
    Route::get('/v1/rooms', [RoomController::class, 'readRooms']);
    Route::get('/v1/rooms/{category_id}', [RoomController::class, 'readRoom']);
    Route::put('/v1/rooms/{room_id}', [RoomController::class, 'updateRoom']);
    Route::delete('/v1/rooms/{room_id}', [RoomController::class, 'deleteRoom']);

    // reservations
    Route::post('/v1/reservation/{room_id}', [ReservationController::class, 'createReservation']);
    Route::put('/v1/reservation/admin/{reservation_id}', [ReservationController::class, 'updateReservation']);
    Route::put('/v1/reservation/{reservation_id}', [ReservationController::class, 'cancelReservation']);
    Route::get('/v1/reservation/user', [ReservationController::class, 'myReservation']);
    Route::get('/v1/reservations', [ReservationController::class, 'readReservations']);
    Route::get('/v1/reservation/{reservation_id}', [ReservationController::class, 'readReservation']);
    Route::delete('/v1/reservation/{reservation_id}', [ReservationController::class, 'deleteReservation']);

    // transaction
    Route::post('/v1/transaction/{reservation_id}', [TransactionController::class, 'createTransaction']);
    Route::put('/v1/transaction/admin/{transaction_id}', [TransactionController::class, 'updateTransaction']);
    Route::put('/v1/transaction/{transaction_id}', [TransactionController::class, 'cancelTransaction']);
    Route::get('/v1/transaction/user', [TransactionController::class, 'getTransactionsUser']);
    Route::get('/v1/transaction/all', [TransactionController::class, 'getTransactionsUsers']);
    Route::get('/v1/transaction/get/{transaction_id}', [TransactionController::class, 'getTransaction']);

    // user
    Route::get('/v1/users', [UserController::class, 'index']);
    Route::get('/v1/user/self', [UserController::class, 'showSelf']);
    Route::get('/v1/user/{user_id}', [UserController::class, 'show']);
    Route::put('/v1/user/{user_id}', [UserController::class, 'update']);
    Route::put('/v1/user', [UserController::class, 'updateSelf']);
    Route::delete('/v1/user/{user_id}', [UserController::class, 'deleteUser']);
    Route::post('/v1/user/create', [UserController::class, 'createUser']);
});