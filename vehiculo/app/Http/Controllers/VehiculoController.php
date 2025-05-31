<?php

namespace App\Http\Controllers;

use App\Models\Vehiculo;
use Illuminate\Http\Request;

class VehiculoController extends Controller
{
    // Listar todos los vehículos
    public function index()
    {
        return response()->json(Vehiculo::all(), 200);
    }

    // Registrar nuevo vehículo
    public function store(Request $request)
    {
        $request->validate([
            'marca' => 'required|string|max:100',
            'modelo' => 'required|string|max:100',
            'anio' => 'required|digits:4|integer|min:1900',
            'categoria' => 'nullable|string|max:50',
            'estado' => 'in:disponible,alquilado,mantenimiento',
        ]);

        $vehiculo = Vehiculo::create($request->all());

        return response()->json($vehiculo, 201);
    }

    // Mostrar un vehículo específico
    public function show($id)
    {
        $vehiculo = Vehiculo::find($id);

        if (!$vehiculo) {
            return response()->json(['mensaje' => 'Vehículo no encontrado'], 404);
        }

        return response()->json($vehiculo, 200);
    }

    // Actualizar un vehículo
    public function update(Request $request, $id)
    {
        $vehiculo = Vehiculo::find($id);

        if (!$vehiculo) {
            return response()->json(['mensaje' => 'Vehículo no encontrado'], 404);
        }

        $vehiculo->update($request->all());

        return response()->json($vehiculo, 200);
    }

    // Eliminar un vehículo
    public function destroy($id)
    {
        $vehiculo = Vehiculo::find($id);

        if (!$vehiculo) {
            return response()->json(['mensaje' => 'Vehículo no encontrado'], 404);
        }

        $vehiculo->delete();

        return response()->json(['mensaje' => 'Vehículo eliminado'], 200);
    }

    public function categorias()
    {
        $categorias = \App\Models\Vehiculo::select('categoria')
            ->whereNotNull('categoria')
            ->distinct()
            ->pluck('categoria');

        return response()->json($categorias);
    }
    public function buscarMarcaModelo($query)
{
    $vehiculos = \App\Models\Vehiculo::where('marca', 'LIKE', "%{$query}%")
        ->orWhere('modelo', 'LIKE', "%{$query}%")
        ->where('estado', 'disponible')
        ->get();
    return response()->json($vehiculos);
}


}