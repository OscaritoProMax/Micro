<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Devolucion extends Model
{
    use HasFactory;

    protected $fillable = [
        'reserva_id',
        'fecha_devolucion',
        'observaciones'
    ];

    public function reserva()
    {
        return $this->belongsTo(Reserva::class);
    }
}
