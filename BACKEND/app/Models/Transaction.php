<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $table = 'transactions';

    protected $fillable = [
        'reservation_id',
        'payment_method',
        'amount',
        'payment_status'
    ];

    public function reservation() {
        return $this->belongsTo(Reservation::class, 'reservation_id', 'id');
    }
}
