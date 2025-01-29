<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    protected $table = 'reservations';

    protected $fillable = [
        'user_id',
        'room_id',
        'check_in',
        'check_out',
        'status',
        'total_amount',
        'notes'
    ];

    public function user() {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function room() {
        return $this->belongsTo(Room::class, 'room_id', 'id');
    }

    public function transactions() {
        return $this->hasMany(Transaction::class, 'reservation_id', 'id');
    }
}
