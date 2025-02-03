<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index() {
        $userLog = Auth::user();

        if ($userLog->role !== 'admin') {
            return response()->json([
                'status' => 'Forbidden',
                'message' => 'You are not authorized'
            ], 403);
        }

        $users = User::with('reservations.transactions')->get();

        return response()->json([
            'data' => $users
        ], 200);
    }

    public function show(string $user_id) {
        $userLog = Auth::user();

        if ($userLog->role !== 'admin') {
            return response()->json([
                'status' => 'Forbidden',
                'message' => 'You are not authorized'
            ], 403);
        }

        $user = User::with('reservations.transactions')->find($user_id);

        return response()->json([
            'data' => $user
        ], 200);
    }

    public function showSelf() {
        $user = Auth::user();
        $user->with('reservations.transactions')->find($user->id);

        return response()->json([
            'data' => $user
        ], 200);
    }

    public function update(Request $req, string $user_id) {
        $userLog = Auth::user();

        if ($userLog->role !== 'admin') {
            return response()->json([
                'status' => 'Forbidden',
                'message' => 'You are not authorized'
            ], 403);
        }

        $user = User::find($user_id);

        if (!$user) {
            return response()->json([
                'status' => 'Not found',
                'message' => 'User not found'
            ], 404);
        }

        $validate = Validator::make($req->all(), [
            'name' => 'sometimes|string',
            'email' => 'sometimes|email|unique:users,email,' . $user_id,
            'password' => 'sometimes|min:3|string',
            'phone_number' => 'sometimes|regex:/\d{4}\-\d{4}\-\d{4}/',
            'role' => 'sometimes',
            'address' => 'sometimes|nullable'
        ]);

        if ($validate->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validate->errors()
            ], 400);
        }

        $resultUser = User::where('id', $user_id)->update([
            'name' => $req->name,
            'email' => $req->email,
            'password' => bcrypt($req->password),
            'phone_number' => $req->phone_number,
            'role' => $req->role,
            'address' => $req->address
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'User data successfully updated!',
            'previous_data' => [
                'name' => $user->name,
                'email' => $user->email,
                'password' => $user->password,
                'phone_number' => $user->phone_number,
                'role' => $user->role,
                'address' => $user->address
            ]
        ], 200);
    }

    public function updateSelf(Request $req) {

        $user = Auth::user();

        $validate = Validator::make($req->all(), [
            'name' => 'sometimes|string',
            'email' => 'sometimes|email|unique:users,email,' . $user->id,
            // 'password' => 'min:3|string',
            'phone_number' => 'sometimes|regex:/\d{4}\-\d{4}\-\d{4}/',
            'address' => 'sometimes|nullable'
        ]);

        if ($validate->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validate->errors()
            ], 400);
        }

        $resultUser = $user->update([
            'name' => $req->name,
            'email' => $req->email,
            // 'password' => bcrypt($req->password),
            'phone_number' => $req->phone_number,
            'address' => $req->address
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'User data successfully updated!',
            'updated_data' => [
                'name' => $user->name,
                'email' => $user->email,
                // 'password' => $user->password,
                'phone_number' => $user->phone_number,
                'address' => $user->address
            ]
        ], 200);
    }

    public function deleteUser(string $user_id) {
        $userLog = Auth::user();

        if ($userLog->role !== 'admin') {
            return response()->json([
                'status' => 'Forbidden',
                'message' => 'You are not authorized'
            ], 403);
        }

        $user = User::find($user_id);

        if (!$user) {
            return response()->json([
                'status' => 'Not found',
                'message' => 'User not found'
            ], 404);
        }

        $user->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'User successfully deleted!'
        ], 200);
    }

    public function createUser(Request $req) {

        $userLog = Auth::user();

        if ($userLog->role !== 'admin') {
            return response()->json([
                'status' => 'Forbidden',
                'message' => 'You are not authorized'
            ], 403);
        }

        $validate = Validator::make($req->all(), [
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email',
            'password' => 'required',
            'phone_number' => 'required|regex:/\d{4}\-\d{4}\-\d{4}/',
            'address' => 'nullable'
        ]);

        if ($validate->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid field',
                'errors' => $validate->errors()
            ], 400);
        }

        $user = User::create([
            'name' => $req->name,
            'email' => $req->email,
            'password' => bcrypt($req->password),
            'phone_number' => $req->phone_number,
            'address' => $req->address,
            'role' => 'user'
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'User created successfully!',
            'data' => $user
        ], 200);
    }
}
