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

class ReservationController extends Controller
{
    public function createReservation(Request $req, string $room_id) {

        $room = Room::find($room_id);
        $user = Auth::user();
        

        if (!$room) {
            return response()->json([
                'status' => 'Not found',
                'message' => 'The room you are trying to book does not exist.'
            ], 404);
        }

        $validate = Validator::make($req->all(), [
            'check_in' => 'required|date|after_or_equal:today',
            'check_out' => 'required|date|after:check_in',
            'notes' => 'nullable'
        ]);

        if ($validate->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validate->errors()
            ], 400);
        }

        $existingRoomReservation = Reservation::where('room_id', $room_id)
        ->where('status', '!=', 'cancelled')
        ->where(function ($query) use ($req) {
            $query->where('check_in', '<=', $req->check_out)
                ->where('check_out', '>=', $req->check_in);
        })->first();

        if ($existingRoomReservation) {
            return response()->json([
                'status' => 'Unavailable',
                'message' => 'The room is already reserved for the selected dates.'
            ], 400);
        }


        $calculate_check_in = Carbon::parse($req->check_in);
        $calculate_check_out = Carbon::parse($req->check_out);
        $duration = $calculate_check_in->diffInDays($calculate_check_out);

        $total_amount = $duration * $room->price_per_night;

        $reservation = Reservation::create([
            'user_id' => $user->id,
            'room_id' => $room->id,
            'check_in' => $req->check_in,
            'check_out' => $req->check_out,
            'status' => 'pending',
            'total_amount' => $total_amount,
            'notes' => $req->notes
        ]);


        return response()->json([
            'status' => 'success',
            'message' => 'Successfully booked a room.',
            'reservation_id' => $reservation->id,
            'user' => $user->name,
            'room_id' => $room->id,
            'room_code' => $room->room_code,
            'duration' => $duration . ' days',
            'total_amount' => 'Rp. ' . number_format($total_amount, 2, ',', '.')
        ], 200);
    }

    public function updateReservation(Request $req, string $reservation_id) {
        $user = Auth::user();

        if ($user->role !== 'admin') {
            return response()->json([
                'status' => 'Forbidden',
                'message' => 'You are not authorized to update reservations.'
            ], 403);
        }

        $reservation = Reservation::find($reservation_id);

        if (!$reservation) {
            return response()->json([
                'status' => 'Not found',
                'message' => 'This reservation does not exist.'
            ], 404);
        }

        $validate = Validator::make($req->all(), [
            'status' => 'required|in:pending,confirmed,cancelled'
        ]);

        if ($validate->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validate->errors()
            ], 400);
        }

        $reservation->update([
            'status' => $req->status
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Reservation updated successfully!',
            'reservation_status' => $reservation->status,
            'reservation_id' => $reservation->id
        ], 200);
    }

    public function cancelReservation(string $reservation_id) {
        $user = Auth::user();

        $reservation = Reservation::find($reservation_id);

        if (!$reservation) {
            return response()->json([
                'status' => 'Not found',
                'message' => 'This reservation does not exist.'
            ], 404);
        }

        $reservation->update([
            'status' => 'cancelled'
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Reservation cancelled!',
            'reservation_status' => $reservation->status,
            'reservation_id' => $reservation->id
        ], 200);
    }

    public function readReservations() {

        $reservations = Reservation::all();

        return response()->json([
            'data' => $reservations
        ], 200);
    }

    public function readReservation(string $reservation_id) {

        $reservation = Reservation::find($reservation_id);

        if (!$reservation) {
            return response()->json([
                'status' => 'Not found',
                'message' => 'This reservation does not exist.'
            ], 404);
        }
        
        $user = Auth::user();
        $room = Room::where('id', $reservation->room_id)->first();

        $reserved = Reservation::with(['user', 'room'])->get();


        return response()->json([
            'reservation' => [
                'id' => $reservation->id,
                'room_id' => $room->id,
                'room_code' => $room->room_code,
                'user_id' => $user->id,
                'reserved_by' => $user->name,
                'status' => $reservation->status,
                'notes' => $reservation->notes
            ]
        ], 200);
    }

    // public function myReservation() {

    //     $user = Auth::user();
    //     $reservation = Reservation::where('user_id', $user->id)->pluck('id');

    //     $room = Room::whereIn('id', $reservation->room_id)->get();

    //     $reserved = Reservation::with(['user', 'room'])->get();


    //     return response()->json([
    //         'reservation' => [
    //             'id' => $reservation->id,
    //             'room_id' => $room->id,
    //             'room_code' => $room->room_code,
    //             'user_id' => $user->id,
    //             'reserved_by' => $user->name,
    //             'status' => $reservation->status,
    //             'notes' => $reservation->notes
    //         ]
    //     ], 200);
    // }

    public function myReservation() {
        // Get the logged-in user
        $user = Auth::user();
    
        // Fetch reservations with related room and user details
        $reservations = Reservation::with('room')
            ->where('user_id', $user->id)
            ->get();
    
        // Check if reservations exist
        if ($reservations->isEmpty()) {
            return response()->json([
                'status' => 'Not found',
                'message' => 'No reservations found for the logged-in user.'
            ], 404);
        }
    
        // Transform the response data
        $reservationData = $reservations->map(function ($reservation) use ($user) {
            return [
                'id' => $reservation->id,
                'room_id' => $reservation->room->id ?? null, // Ensure room exists
                'room_code' => $reservation->room->room_code ?? null,
                'user_id' => $user->id,
                'reserved_by' => $user->name,
                'check_in' => $reservation->check_in,
                'check_out' => $reservation->check_out,
                'status' => $reservation->status,
                'notes' => $reservation->notes
            ];
        });
    
        return response()->json([
            'status' => 'success',
            'reservations' => $reservationData
        ], 200);
    }    

    public function deleteReservation(string $reservation_id) {
        $reservation = Reservation::find($reservation_id);

        if (!$reservation) {
            return response()->json([
                'status' => 'Not found',
                'message' => 'This reservation does not exist'
            ], 404);
        }

        $reservation->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Reservation record deleted successfully!'
        ], 200);
    }
}
