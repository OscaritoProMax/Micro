<?php

namespace App\Http\Controllers;

use App\Models\Devolucion;
use App\Models\Reserva;
use App\Models\Vehiculo;
use Illuminate\Http\Request;

class DevolucionController extends Controller
{
    public function index()
    {
        return Devolucion::with('reserva')->get();
    }

   public function store(Request $request)
{
    try {
        $request->validate([
            'reserva_id' => 'required|exists:reservas,id',
            'fecha_devolucion' => 'required|date',
            'observaciones' => 'nullable|string',
            'estado_vehiculo' => 'nullable|in:disponible,mantenimiento'
        ]);

        $reserva = Reserva::findOrFail($request->reserva_id);
        $reserva->estado = 'completada';
        $reserva->save();

        $estadoVehiculo = $request->input('estado_vehiculo', 'disponible');
        $vehiculo = $reserva->vehiculo;
        $vehiculo->estado = $estadoVehiculo;
        $vehiculo->save();

        return response()->json([
            'message' => 'La devolución se ha registrado correctamente.',
            'reserva_id' => $reserva->id,
            'vehiculo_id' => $vehiculo->id,
            'nuevo_estado_vehiculo' => $vehiculo->estado
        ], 200);
    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Error al registrar devolución',
            'message' => $e->getMessage()
        ], 500);
    }
}



    public function show(Devolucion $devolucion)
    {
        return $devolucion->load('reserva');
    }

    public function update(Request $request, Devolucion $devolucion)
    {
        $devolucion->update($request->all());
        return $devolucion;
    }

    public function destroy(Devolucion $devolucion)
    {
        $devolucion->delete();
        return response()->json(['mensaje' => 'Devolución eliminada']);
    }
}