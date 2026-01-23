<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'total', 'payment_method', 'payment_status', 'order_status', 'address'
    ];

    // Importante: Castear la dirección a Array para usarla fácil en React
    protected $casts = [
        'address' => 'array',
    ];

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
    
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}