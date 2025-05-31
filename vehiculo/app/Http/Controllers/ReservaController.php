<?php

namespace App\Http\Controllers;

use App\Models\Reserva;
use App\Models\Vehiculo;
use Illuminate\Http\Request;

class ReservaController extends Controller
{
    public function index(Request $request)
{
    $query = Reserva::with(['cliente', 'vehiculo']);

    if ($request->filled('cliente_id')) {
        $query->where('cliente_id', $request->cliente_id);
    }

    if ($request->filled('vehiculo_id')) {
        $query->where('vehiculo_id', $request->vehiculo_id);
    }

    return $query->get();
}


public function store(Request $request)
{
    $request->validate([
        'cliente_id' => 'required|exists:clientes,id',
        'vehiculo_id' => 'required|exists:vehiculos,id',
        'fecha_inicio' => 'required|date',
        'fecha_fin' => 'required|date|after_or_equal:fecha_inicio',
        'estado' => 'in:activa,completada,cancelada'
    ]);

    // Validar que el vehículo esté disponible
    $vehiculo = Vehiculo::find($request->vehiculo_id);
    if ($vehiculo->estado !== 'disponible') {
        return response()->json([
            'error' => 'El vehículo no está disponible para alquilar.'
        ], 400);
    }

    // Crear la reserva
    $reserva = Reserva::create([
        'cliente_id' => $request->cliente_id,
        'vehiculo_id' => $request->vehiculo_id,
        'fecha_inicio' => $request->fecha_inicio,
        'fecha_fin' => $request->fecha_fin,
        'estado' => $request->estado ?? 'activa',
    ]);

    // Cambiar estado del vehículo a 'alquilado'
    $vehiculo->estado = 'alquilado';
    $vehiculo->save();

    return response()->json([
        'mensaje' => 'Reserva creada y vehículo actualizado.',
        'reserva' => $reserva
    ], 201);
}

    public function show(Reserva $reserva)
    {
        return $reserva->load(['cliente', 'vehiculo']);
    }

    public function update(Request $request, Reserva $reserva)
    {
        $reserva->update($request->all());
        return $reserva;
    }

    public function destroy(Reserva $reserva)
    {
        $reserva->delete();
        return response()->json(['mensaje' => 'Reserva eliminada']);
    }
}
