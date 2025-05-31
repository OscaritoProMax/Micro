const API_BASE = '/api';

document.addEventListener('DOMContentLoaded', () => {


  // ---------- Registrar vehículo ----------
  const formVehiculo = document.getElementById('formVehiculo');
  if (formVehiculo) {
    const datalistCategorias = document.getElementById('listaCategorias');
    if (datalistCategorias) {
      fetch(`${API_BASE}/vehiculos/categorias`)
        .then(res => res.json())
        .then(categorias => {
          categorias.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            datalistCategorias.appendChild(option);
          });
        })
        .catch(err => {
          console.error("Error al cargar categorías:", err);
        });
    }

    formVehiculo.addEventListener('submit', async function (e) {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(formVehiculo));
      try {
        const res = await fetch(`${API_BASE}/vehiculos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        const result = await res.json();
        alert('Vehículo registrado con éxito:\n' + JSON.stringify(result, null, 2));
        formVehiculo.reset();
      } catch (error) {
        alert('Error al registrar vehículo');
        console.error(error);
      }
    });
  }

  // ---------- Registrar cliente ----------
  const formCliente = document.getElementById('formCliente');
  if (formCliente) {
    formCliente.addEventListener('submit', async function (e) {
      e.preventDefault();

      const form = e.target;
      const nombre = form.nombre.value.trim();
      const telefono = form.telefono.value.trim();
      const correo = form.correo.value.trim();
      const numero_licencia = form.numero_licencia.value.trim();

      if (!nombre || !numero_licencia) {
        alert("Nombre y número de licencia son obligatorios.");
        return;
      }

      try {
        const res = await fetch(`http://localhost:8000/api/clientes/verificar-licencia/${encodeURIComponent(numero_licencia)}`);
        const data = await res.json();

        if (data.existe) {
          alert("Este número de licencia ya está registrado.");
          return;
        }

        const respuesta = await fetch(`${API_BASE}/clientes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombre, telefono, correo, numero_licencia })
        });

        const resultado = await respuesta.json();

        if (respuesta.ok) {
          alert("Cliente registrado exitosamente.");
          form.reset();
        } else {
          alert("Ocurrió un error al registrar el cliente.");
          console.error(resultado);
        }

      } catch (error) {
        console.error("Error al verificar o registrar:", error);
        alert("Error al conectar con el servidor.");
      }
    });
  }

  // ---------- Crear reserva ----------
  const formReserva = document.getElementById('formReserva');
  if (formReserva) {
    formReserva.addEventListener('submit', async function (e) {
      e.preventDefault();

      const data = Object.fromEntries(new FormData(formReserva));
      if (!data.cliente_id || !data.vehiculo_id) {
        alert("Debes seleccionar un cliente y un vehículo válidos.");
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/reservas`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        const result = await res.json();
        alert('Reserva creada:\n' + JSON.stringify(result, null, 2));
        formReserva.reset();
      } catch (error) {
        alert('Error al crear la reserva');
        console.error(error);
      }
    });
  }

  
// ---------- Registrar devolución ----------
const formDevolucion = document.getElementById('formDevolucion');
if (formDevolucion) {
  formDevolucion.addEventListener('submit', async function (e) {
    e.preventDefault();

    const formData = new FormData(formDevolucion);
    const data = {
      reserva_id: formData.get('reserva_id'),
      fecha_devolucion: formData.get('fecha_devolucion'),
      observaciones: formData.get('observaciones') || null,
      estado_vehiculo: formData.get('estado_vehiculo') || 'disponible'
    };

    try {
      const res = await fetch(`${API_BASE}/devoluciones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (res.ok) {
        alert(
          `✅ ${result.message}\n\n` +
          `Reserva ID: ${result.reserva_id}\n` +
          `Vehículo ID: ${result.vehiculo_id}\n` +
          `Nuevo estado del vehículo: ${result.nuevo_estado_vehiculo}`
        );
        formDevolucion.reset();
        selectReserva.innerHTML = '';
      } else {
        alert('❌ Error al registrar la devolución');
        console.error(result);
      }
    } catch (error) {
      alert('❌ Error al registrar la devolución');
      console.error(error);
    }
  });
}



  // ---------- Consultar historial ----------
  const formHistorial = document.getElementById('formHistorial');
  const resultadoHistorial = document.getElementById('resultadoHistorial');
  if (formHistorial) {
    formHistorial.addEventListener('submit', async function (e) {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(formHistorial));
      let url = `${API_BASE}/reservas`;
      const params = new URLSearchParams();
      if (data.cliente_id) params.append('cliente_id', data.cliente_id);
      if (data.vehiculo_id) params.append('vehiculo_id', data.vehiculo_id);
      if (params.toString()) url += `?${params.toString()}`;

      try {
        const res = await fetch(url);
        const reservas = await res.json();

        if (reservas.length === 0) {
          resultadoHistorial.innerHTML = "<p>No se encontraron reservas.</p>";
        } else {
          resultadoHistorial.innerHTML = reservas.map(r => {
            const cliente = r.cliente?.nombre || `ID ${r.cliente_id}`;
            const vehiculo = r.vehiculo 
                ? `${r.vehiculo.marca} ${r.vehiculo.modelo} (${r.vehiculo.anio})`
                : `ID ${r.vehiculo_id}`;

            return `
                <div style="margin-bottom: 1rem; border: 1px solid #ccc; padding: 10px; border-radius: 6px;">
                <strong>Reserva #${r.id}</strong><br>
                <strong>Cliente:</strong> ${cliente}<br>
                <strong>Vehículo:</strong> ${vehiculo}<br>
                <strong>Inicio:</strong> ${r.fecha_inicio}<br>
                <strong>Fin:</strong> ${r.fecha_fin}<br>
                <strong>Estado:</strong> ${r.estado}
                </div>
            `;
            }).join('');

        }
      } catch (error) {
        alert('Error al consultar historial');
        console.error(error);
      }
    });
  }

  // ---------- Mostrar vehículos disponibles ----------
  const listaVehiculos = document.getElementById('listaVehiculos');
  if (listaVehiculos) {
  fetch(`${API_BASE}/vehiculos`)
  .then(res => res.json())
  .then(data => {
    const disponibles = data.filter(v => v.estado === 'disponible');
    const mantenimiento = data.filter(v => v.estado === 'mantenimiento');

    const lista = document.getElementById('listaVehiculos');
    lista.innerHTML = '';

    if (disponibles.length > 0) {
      lista.innerHTML += '<h2 class="subtitulo">Disponibles</h2>';
      disponibles.forEach(v => {
        lista.innerHTML += `
          <li>
            <strong>${v.marca} ${v.modelo}</strong> (${v.anio})<br>
            <span>Categoría: ${v.categoria || 'Sin categoría'}</span>
          </li>
        `;
      });
    }

    if (mantenimiento.length > 0) {
      lista.innerHTML += '<h2 class="subtitulo">En Mantenimiento</h2>';
      mantenimiento.forEach(v => {
        const item = document.createElement('li');
        item.innerHTML = `
          <strong>${v.marca} ${v.modelo}</strong> (${v.anio})<br>
          <span>Categoría: ${v.categoria || 'Sin categoría'}</span><br>
          <span>Estado: ${v.estado}</span><br><br>
          <button class="btn-disponible" data-id="${v.id}">Marcar como Disponible</button>
        `;
        lista.appendChild(item);
      });

      // Escuchar clics en los botones
      lista.querySelectorAll('.btn-disponible').forEach(btn => {
        btn.addEventListener('click', async () => {
          const id = btn.dataset.id;
          try {
            const res = await fetch(`${API_BASE}/vehiculos/${id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ estado: 'disponible' })
            });

            if (res.ok) {
              alert('Vehículo actualizado a disponible.');
              location.reload(); // recargar para actualizar la lista
            } else {
              alert('Error al actualizar el estado.');
            }
          } catch (err) {
            console.error(err);
            alert('Error de conexión al servidor.');
          }
        });
      });
    }
  })
  .catch(err => {
    const lista = document.getElementById('listaVehiculos');
    lista.innerHTML = "<li>Error al cargar los vehículos.</li>";
    console.error(err);
  });

  }

  // ---------- Autocompletar clientes por nombre ----------
 const inputCliente = document.getElementById('busqueda_cliente');
const listaClientes = document.getElementById('lista_clientes');
const inputClienteId = document.getElementById('cliente_id_seleccionado');

const selectReserva = document.getElementById('reserva_id'); // solo existe en registrar_devolucion

if (inputCliente && listaClientes && inputClienteId) {
  inputCliente.addEventListener('input', async () => {
    const query = inputCliente.value.trim();
    if (query.length < 2) return;

    const res = await fetch(`${API_BASE}/clientes/buscar-nombre/${encodeURIComponent(query)}`);
    const clientes = await res.json();
    listaClientes.innerHTML = '';

    // Si estamos en registrar_devolucion.html
    if (document.getElementById('formDevolucion')) {
      for (const c of clientes) {
        try {
          const r = await fetch(`${API_BASE}/reservas?cliente_id=${c.id}`);
          const reservas = await r.json();
          const activas = reservas.filter(r => r.estado === 'activa');

          if (activas.length > 0) {
            const li = document.createElement('li');
            li.textContent = `${c.nombre} (${c.numero_licencia})`;
            li.addEventListener('click', () => {
              inputCliente.value = c.nombre;
              inputClienteId.value = c.id;
              listaClientes.innerHTML = '';

              selectReserva.innerHTML = '';
              activas.forEach(res => {
                const opt = document.createElement('option');
                opt.value = res.id;
                opt.text = `Reserva #${res.id} - Vehículo ${res.vehiculo_id}`;
                selectReserva.appendChild(opt);
              });
            });
            listaClientes.appendChild(li);
          }
        } catch (error) {
          console.error("Error al verificar reservas:", error);
        }
      }

    } else {
      // Estamos en crear_reserva.html o consultar_historial.html
      clientes.forEach(c => {
        const li = document.createElement('li');
        li.textContent = `${c.nombre} (${c.numero_licencia})`;
        li.addEventListener('click', () => {
          inputCliente.value = c.nombre;
          inputClienteId.value = c.id;
          listaClientes.innerHTML = '';
        });
        listaClientes.appendChild(li);
      });
    }
  });
}

  // ---------- Autocompletar vehículos por marca o modelo ----------
  const inputVehiculo = document.getElementById('busqueda_vehiculo');
const listaVehiculosSugerencia = document.getElementById('lista_vehiculos');
const inputVehiculoId = document.getElementById('vehiculo_id_seleccionado');

if (inputVehiculo && listaVehiculosSugerencia && inputVehiculoId) {
  inputVehiculo.addEventListener('input', async () => {
    const query = inputVehiculo.value.trim();
    if (query.length < 2) return;

    const res = await fetch(`${API_BASE}/vehiculos/buscar/${encodeURIComponent(query)}`);
    const vehiculos = await res.json();

    listaVehiculosSugerencia.innerHTML = '';
    vehiculos.forEach(v => {
      const li = document.createElement('li');
      li.textContent = `${v.marca} ${v.modelo} (${v.anio})`;
      li.addEventListener('click', () => {
        inputVehiculo.value = `${v.marca} ${v.modelo}`;
        inputVehiculoId.value = v.id;
        listaVehiculosSugerencia.innerHTML = '';
      });
      listaVehiculosSugerencia.appendChild(li);
    });
  });
}

});

