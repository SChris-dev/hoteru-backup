<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

use App\Models\RoomCategory;
use App\Models\Room;
use App\Models\User;
use App\Models\Reservation;
use App\Models\Transaction;

class TransactionController extends Controller
{
    public function createTransaction(Request $req, string $reservation_id) {

        $user = Auth::user();
        $reservation = Reservation::where('id', $reservation_id)->where('user_id', $user->id)->first();

        if (!$reservation) {
            return response()->json([
                'status' => 'Not found',
                'message' => 'Reservation does not exist, or this reservation does not belong to you.'
            ], 404);
        }

        $existingTransaction = Transaction::where('reservation_id', $reservation_id)
        ->where('payment_status', '!=', 'failed')    
        ->first();

        if ($existingTransaction) {
            if ($existingTransaction->payment_status === 'pending') {
                return response()->json([
                    'status' => 'Pending',
                    'message' => 'A transaction already exists but is not complete. Please retry or confirm the payment.',
                    'transaction' => $existingTransaction
                ], 400);
            }

            return response()->json([
                'status' => 'Already Exists',
                'message' => 'You have already completed a transaction for this reservation.',
                'transaction' => $existingTransaction
            ], 400);
        }

        $validate = Validator::make($req->all(), [
            'payment_method' => 'required|in:card,QRIS,cash'
        ]);

        if ($validate->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validate->errors()
            ], 400);
        }

        $transaction = Transaction::create([
            'reservation_id' => $reservation_id,
            'payment_method' => $req->payment_method,
            'amount' => $reservation->total_amount,
            'payment_status' => 'pending'
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Transaction added to record, please confirm your payment to an admin.',
            'transaction_id' => $transaction->id,
            'payment_method' => $transaction->payment_method,
            'payment_status' => $transaction->payment_status
        ], 200);
    }

    public function updateTransaction(Request $req, string $transaction_id) {
        $user = Auth::user();

        if ($user->role !== 'admin') {
            return response()->json([
                'status' => 'Forbidden',
                'message' => 'You are not authorized to update reservations'
            ], 403);
        }

        $transaction = Transaction::find($transaction_id);

        if (!$transaction) {
            return response()->json([
                'status' => 'Not found',
                'message' => 'Transaction does not exist.'
            ], 404);
        }

        $validate = Validator::make($req->all(), [
            'payment_status' => 'required|in:successful,pending,failed'
        ]);

        if ($validate->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validate->errors()
            ], 400);
        }

        $transaction->update([
            'payment_status' => $req->payment_status
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Transaction record successfully updated!',
            'payment_status' => $transaction->payment_status,
            'transaction_id' => $transaction_id
        ], 200);

    }

    public function cancelTransaction(string $transaction_id) {
        $user = Auth::user();

        $transaction = Transaction::find($transaction_id);

        if (!$transaction) {
            return response()->json([
                'status' => 'Not found',
                'message' => 'Transaction does not exist.'
            ], 404);
        }

        $transaction->update([
            'payment_status' => 'failed'
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Transaction cancelled!',
            'payment_status' => $transaction->payment_status,
            'transaction_id' => $transaction_id
        ], 200);

    }

    // public function getTransactionsUser() {
    //     $user = Auth::user();
    //     // pluck untuk mengambil beberapa jumlah data dalam bentuk array
    //     $reservations = Reservation::where('user_id', $user->id)->pluck('id');
    //     // whereIn untuk fetch data yang hanya ada idnya saja (ibarat seperti get all dengan kondisi)
    //     $transactions = Transaction::whereIn('reservation_id', $reservations)->get();


    //     if (!$transactions) {
    //         return response()->json([
    //             'status' => 'Not found',
    //             'message' => 'The user has not made any transaction yet.'
    //         ], 404);
    //     }

    //     return response()->json([
    //         'status' => 'success',
    //         'name' => $user->name,
    //         'email' => $user->email,
    //         'data' => $transactions
    //     ], 200);

    // }

    public function getTransactionsUser() {
        $user = Auth::user();
    
        // Fetch reservations with their related transactions
        $transactions = Transaction::with('reservation') // Assuming Transaction has a relationship with Reservation
            ->whereHas('reservation', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            ->get();
    
        // Check if transactions exist
        if ($transactions->isEmpty()) {
            return response()->json([
                'status' => 'Not found',
                'message' => 'The user has not made any transaction yet.'
            ], 404);
        }
    
        // Transform the response data (optional)
        $transactionData = $transactions->map(function ($transaction) {
            return [
                'id' => $transaction->id,
                'reservation_id' => $transaction->reservation->id,
                'amount' => $transaction->amount,
                'status' => $transaction->payment_status,
                'created_at' => $transaction->created_at,
            ];
        });
    
        return response()->json([
            'status' => 'success',
            'name' => $user->name,
            'email' => $user->email,
            'transactions' => $transactionData
        ], 200);
    }

    public function getTransactionsUsers() {
        $transactions = Transaction::with('reservation.user')->get();

        $transactionWithUsernames = $transactions->map(function ($transaction) {
            return [
                'transaction_id' => $transaction->id,
                'reservation_id' => $transaction->reservation_id,
                'name' => $transaction->reservation->user->name,
                'payment_method' => $transaction->payment_method,
                'amount' => $transaction->amount,
                'payment_status' => $transaction->payment_status,
                'created_at' => $transaction->created_at,
                'updated_at' => $transaction->updated_at
            ];
        });

        return response()->json([
            'status' => 'success',
            'data' => $transactionWithUsernames
        ], 200);

    }

    public function getTransaction(string $transaction_id) {
        $transaction = Transaction::with('reservation.user')->find($transaction_id);

        if (!$transaction) {
            return response()->json([
                'status' => 'Not found',
                'message' => 'Transaction does not exist.'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'name' => $transaction->reservation->user->name,
            'email' => $transaction->reservation->user->email,
            'data' => [
                'transaction_id' => $transaction->id,
                'reservation_id' => $transaction->reservation_id,
                'payment_method' => $transaction->payment_method,
                'amount' => $transaction->amount,
                'payment_status' => $transaction->payment_status,
                'created_at' => $transaction->created_at
            ]
        ], 200);
    }
}
