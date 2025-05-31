 
 
 # Micro


 POSMAN http://localhost:8000/api

 1. Buscar cliente por nombre
GET /clientes/buscar-nombre/{nombre}
        ejemplo

        http://localhost:8000/api/clientes/buscar-nombre/Juan

2. Buscar vehículo por marca o modelo
 GET /vehiculos/buscar/{query}

        ejemplo
        http://localhost:8000/api/vehiculos/buscar/Toyota
3. Consultar reservas por cliente

GET /reservas?cliente_id={id}

        ejemplo http://localhost:8000/api/reservas?cliente_id=1
4. Registrar una reserva
POST /reservas

http://localhost:8000/api/reservas

estructura de json
{
  "cliente_id": 1,
  "vehiculo_id": 3,
  "fecha_inicio": "2025-06-01",
  "fecha_fin": "2025-06-05"
}


5. Registrar una devolución
POST /devoluciones

{
  "reserva_id": 12,
  "estado_vehiculo": "disponible"  // o "mantenimiento"
}


http://localhost:8000/api/devoluciones
