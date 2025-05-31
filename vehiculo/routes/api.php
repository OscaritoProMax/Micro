<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\VehiculoController;
use App\Http\Controllers\ClienteController;
use App\Http\Controllers\ReservaController;
use App\Http\Controllers\DevolucionController;

Route::apiResource('vehiculos', VehiculoController::class);
Route::apiResource('clientes', ClienteController::class);
Route::apiResource('reservas', ReservaController::class);
Route::apiResource('devoluciones', DevolucionController::class);
Route::get('vehiculos/categorias', [VehiculoController::class, 'categorias']);
Route::get('clientes/verificar-licencia/{numero}', [ClienteController::class, 'verificarLicencia']);
// Buscar clientes por nombre
Route::get('clientes/buscar-nombre/{nombre}', [ClienteController::class, 'buscarPorNombreParcial']);

// Buscar vehículos por marca o modelo
Route::get('vehiculos/buscar/{query}', [VehiculoController::class, 'buscarMarcaModelo']);
