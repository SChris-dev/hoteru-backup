<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    protected $table = 'rooms';

    protected $fillable = [
        'room_code',
        'room_category_id',
        'price_per_night',
        'is_available',
        'image_urls'
    ];

    protected $casts = [
        'is_available' => 'boolean'
    ];

    public function room_category() {
        return $this->belongsTo(RoomCategory::class, 'room_category_id', 'id');
    }

    public function reservations() {
        return $this->hasMany(Reservation::class, 'room_id', 'id');
    }
}
