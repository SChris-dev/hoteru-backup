<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $req) {
        $validate = Validator::make($req->all(), [
            'email' => 'required|email',
            'password' => 'required|string'
        ]);

        if ($validate->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validate->errors()
            ], 400);
        }

        $checkUser = User::where('email', $req->email)->first();

        if (!$checkUser) {
            return response()->json([
                'status' => 'error',
                'message' => 'Email not found!'
            ], 404);
        }

        if (!Hash::check($req->password, $checkUser->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Incorrect password!'
            ], 401);
        }

        if (!Auth::attempt($req->only('email', 'password'))) {
            return response()->json([
                'status' => 'error',
                'message' => 'Wrong email or password!'
            ], 401);
        }

        $loggedUser = Auth::user();
        $token = $loggedUser->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'Login success!',
            'name' => $loggedUser->name,
            'email' => $loggedUser->email,
            'token' => $token,
            'role' => $loggedUser->role
        ], 200);

    }

    public function register(Request $req) {
        $validate = Validator::make($req->all(), [
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:3',
            'phone_number' => 'required|regex:/\d{4}\-\d{4}\-\d{4}/',
            'address' => 'nullable'
        ]);

        if ($validate->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid Field',
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

        if (!Auth::attempt(['email' => $req->email, 'password' => $req->password])) {
            return response()->json([
                'status' => 'error',
                'message' => 'Wrong email or password!'
            ], 401);
        }

        $user = Auth::user();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'Account registered successfully!',
            'name' => $user->name,
            'email' => $user->email,
            'token' => $token
        ], 200);
    }

    public function logout(Request $req) {

        $logout = $req->user()->currentAccessToken()->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Logout success!'
        ], 200);
    }
}
