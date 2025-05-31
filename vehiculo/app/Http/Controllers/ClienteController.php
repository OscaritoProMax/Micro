<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use Illuminate\Http\Request;

class ClienteController extends Controller
{
    public function index()
    {
        return Cliente::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:150',
            'telefono' => 'nullable|string|max:50',
            'correo' => 'nullable|email|max:100',
            'numero_licencia' => 'nullable|string|max:50'
        ]);

        return Cliente::create($request->all());
    }

    public function show(Cliente $cliente)
    {
        return $cliente;
    }

    public function update(Request $request, Cliente $cliente)
    {
        $cliente->update($request->all());
        return $cliente;
    }

    public function verificarLicencia($numero)
{
    $existe = \App\Models\Cliente::where('numero_licencia', $numero)->exists();

    return response()->json(['existe' => $existe]);
}
public function buscarPorNombreParcial($nombre)
{
    $clientes = \App\Models\Cliente::where('nombre', 'LIKE', "%{$nombre}%")->get();
    return response()->json($clientes);
}

}
