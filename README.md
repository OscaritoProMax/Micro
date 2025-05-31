 
 
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

5. Registrar una devolución
POST /devoluciones

http://localhost:8000/api/devoluciones
