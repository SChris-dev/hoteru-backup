<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RoomCategory extends Model
{
    protected $table = 'room_categories';

    protected $fillable = [
        'name',
        'description',
        'max_capacity'
    ];

    public function rooms() {
        return $this->hasMany(Room::class, 'room_category_id', 'id');
    }
}
