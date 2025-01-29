<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

use App\Models\RoomCategory;
use App\Models\Room;

class RoomController extends Controller
{
    // room category

    public function createCategory(Request $req) {

        $user = Auth::user();

        if ($user->role !== 'admin') {
            return response()->json([
                'status' => 'Forbidden',
                'message' => 'You are not authorized'
            ], 403);
        }

        $validate = Validator::make($req->all(), [
            'name' => 'required|string|unique:room_categories,name',
            'description' => 'required|string',
            'max_capacity' => 'required|integer|max:5'
        ]);

        if ($validate->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validate->errors()
            ], 400);
        }

        $roomCategory = RoomCategory::create([
            'name' => $req->name,
            'description' => $req->description,
            'max_capacity' => $req->max_capacity
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Room category successfully added!'
        ], 200);

    }

    public function readCategories() {
        $user = Auth::user();

        if ($user->role !== 'admin') {
            return response()->json([
                'status' => 'Forbidden',
                'message' => 'You are not authorized'
            ], 403);
        }

        $categories = RoomCategory::all();

        return response()->json([
            'room_categories' => $categories
        ], 200);
    }

    public function readCategory(string $category_id) {
        $user = Auth::user();

        if ($user->role !== 'admin') {
            return response()->json([
                'status' => 'Forbidden',
                'message' => 'You are not authorized'
            ], 403);
        }

        $category = RoomCategory::where('id', $category_id)->first();

        if (!$category) {
            return response()->json([
                'status' => 'Not Found',
                'message' => 'Category not found.'
            ], 404);
        }

        return response()->json([
            'room_category' => $category
        ], 200);
    }

    public function updateCategory(Request $req, string $category_id) {

        $user = Auth::user();

        if ($user->role !== 'admin') {
            return response()->json([
                'status' => 'Forbidden',
                'message' => 'You are not authorized'
            ], 403);
        }
        
        $category = RoomCategory::where('id', $category_id)->first();

        if (!$category) {
            return response()->json([
                'status' => 'Not Found',
                'message' => 'Category not found'
            ], 404);
        }

        $validate = Validator::make($req->all(), [
            'name' => 'string|unique:room_categories,name,' . $category_id,
            'description' => 'string',
            'max_capacity' => 'integer|max:5'
        ]); 

        if ($validate->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validate->errors()
            ], 401);
        }

        $category->update([
            'name' => $req->name ?? $category->name,
            'description' => $req->description,
            'max_capacity' => $req->max_capacity
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Successfully updated room category'
        ], 200);
    }

    public function deleteCategory(string $category_id) {

        $user = Auth::user();

        if ($user->role !== 'admin') {
            return response()->json([
                'status' => 'Forbidden',
                'message' => 'You are not authorized'
            ], 403);
        }

        $category = RoomCategory::find($category_id);

        if (!$category) {
            return response()->json([
                'status' => 'Not found',
                'message' => 'Category not found'
            ], 404);
        }

        $category->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Category deleted successfully!'
        ], 200);

    }

    // room category close

    // rooms

    // public function createRoom(Request $req) {

    //     $user = Auth::user();

    //     if ($user->role !== 'admin') {
    //         return response()->json([
    //             'status' => 'Forbidden',
    //             'message' => 'You are not authorized'
    //         ], 403);
    //     }

    //     $validate = Validator::make($req->all(), [
    //         'room_code' => 'required|unique:rooms,room_code|max:50',
    //         'room_category_id' => 'required|exists:room_categories,id',
    //         'price_per_night' => 'required|regex:/^\d{1,10}(\.\d{1,2})?$/',
    //         'is_available' => 'required|boolean'
    //     ]);

    //     if ($validate->fails()) {
    //         return response()->json([
    //             'status' => 'error',
    //             'errors' => $validate->errors()
    //         ], 400);
    //     }

    //     $room = Room::create([
    //         'room_code' => $req->room_code,
    //         'room_category_id' => $req->room_category_id,
    //         'price_per_night' => $req->price_per_night,
    //         'is_available' => $req->is_available
    //     ]);

    //     return response()->json([
    //         'status' => 'success',
    //         'message' => 'Room created successfully!'
    //     ], 200);

    // }

    public function createRoom(Request $req) {

        $user = Auth::user();
    
        if ($user->role !== 'admin') {
            return response()->json([
                'status' => 'Forbidden',
                'message' => 'You are not authorized'
            ], 403);
        }
    
        $validate = Validator::make($req->all(), [
            'room_code' => 'required|unique:rooms,room_code|max:50',
            'room_category_id' => 'required|exists:room_categories,id',
            'price_per_night' => 'required|regex:/^\d{1,10}(\.\d{1,2})?$/',
            'is_available' => 'required|boolean',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048' // Validate each image
        ]);
    
        if ($validate->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validate->errors()
            ], 400);
        }
    
        $imagePaths = [];
    
        if ($req->hasFile('images')) {
            foreach ($req->file('images') as $image) {
                $path = $image->store('', 'react');
                $imagePaths[] = '/uploads/' . basename($path); // Add path to array
            }
    
            // Limit to 3 images
            $imagePaths = array_slice($imagePaths, 0, 3);
        }
    
        $room = Room::create([
            'room_code' => $req->room_code,
            'room_category_id' => $req->room_category_id,
            'price_per_night' => $req->price_per_night,
            'is_available' => $req->is_available,
            'image_urls' => json_encode($imagePaths) // Store image paths as JSON
        ]);
    
        return response()->json([
            'status' => 'success',
            'message' => 'Room created successfully!',
            'room' => $room // Optionally return the created room details
        ], 200);
    }
    
    // public function updateRoom(Request $req, string $room_id) {
    //     $user = Auth::user();

    //     if ($user->role !== 'admin') {
    //         return response()->json([
    //             'status' => 'Forbidden',
    //             'message' => 'You are not authorized'
    //         ], 403);
    //     }

    //     $room = Room::find($room_id);

    //     if (!$room) {
    //         return response()->json([
    //             'status' => 'Not found',
    //             'message' => 'This room does not exist.'
    //         ], 404);
    //     }

    //     $validate = Validator::make($req->all(), [
    //         'price_per_night' => 'required|regex:/^\d{1,10}(\.\d{1,2})?$/',
    //         'is_available' => 'required|boolean'
    //     ]);

    //     if ($validate->fails()) {
    //         return response()->json([
    //             'status' => 'error',
    //             'errors' => $validate->errors()
    //         ], 400);
    //     }

    //     $room->update([
    //         'price_per_night' => $req->price_per_night,
    //         'is_available' => $req->is_available
    //     ]);

    //     return response()->json([
    //         'status' => 'success',
    //         'message' => 'Room updated successfully!'
    //     ], 200);

        
    // }

    public function updateRoom(Request $req, string $room_id) {
        $user = Auth::user();
    
        if ($user->role !== 'admin') {
            return response()->json([
                'status' => 'Forbidden',
                'message' => 'You are not authorized'
            ], 403);
        }
    
        $room = Room::find($room_id);
    
        if (!$room) {
            return response()->json([
                'status' => 'Not found',
                'message' => 'This room does not exist.'
            ], 404);
        }
    
        $validate = Validator::make($req->all(), [
            'room_code' => 'required|max:50|unique:rooms,room_code,' . $room_id,
            'room_category_id' => 'required|exists:room_categories,id',
            'price_per_night' => 'required|regex:/^\d{1,10}(\.\d{1,2})?$/',
            'is_available' => 'required|boolean',
            'images' => 'array|max:3', // Limit number of images
            'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048' // Validate each image
        ]);

        
    
        if ($validate->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validate->errors()
            ], 400);
        }
    
        // Get the old image paths (if any)
        $oldImagePaths = json_decode($room->image_urls, true) ?? [];

        // Delete old images from storage
        foreach ($oldImagePaths as $oldImage) {
            if (Storage::disk('react')->exists($oldImage)) {
                Storage::disk('react')->delete($oldImage); // Delete old image
            }
        }

        $imagePaths2 = [];

        // Store new images if provided
        if ($req->hasFile('images')) {
            foreach ($req->file('images') as $image) {
                $path = $image->store('', 'react');
                $imagePaths2[] = '/uploads/' . basename($path); // Add path to array
            }

            // Limit to 3 images (optional)
            $imagePaths2 = array_slice($imagePaths2, 0, 3);
        }

        // Update the room with new data
        $room->update([
            'room_code' => $req->room_code,
            'room_category_id' => $req->room_category_id,
            'price_per_night' => $req->price_per_night,
            'is_available' => $req->is_available,
            'image_urls' => json_encode($imagePaths2)
        ]);
    
        // Optionally reload the room to reflect updated values
        $room->refresh();

        return response()->json([
            'status' => 'success',
            'message' => 'Room updated successfully!',
            'room' => $room // Optionally return the updated room details
        ], 200);
    }
    

    public function readRooms() {
        $rooms = Room::with('room_category')->get();

        return response()->json([
            'rooms' => $rooms
        ], 200);
    }

    public function readRoom(string $category_id) {
        $room = Room::where('room_category_id', $category_id)->get();

        if (!$room) {
            return response()->json([
                'status' => 'Not found',
                'message' => 'This category does not exist.'
            ], 404);
        }

        return response()->json([
            'room' => $room
        ]);
    }


    public function deleteRoom(string $room_id) {
        $user = Auth::user();

        if ($user->role !== 'admin') {
            return response()->json([
                'status' => 'Forbidden',
                'message' => 'You are not authorized'
            ], 403);
        }

        $room = Room::find($room_id);

        if (!$room) {
            return response()->json([
                'status' => 'Not found',
                'message' => 'This room does not exist.'
            ], 404);
        }

        $room->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Room deleted successfully!'
        ], 200);
    }
}
