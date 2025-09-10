document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formulario');
  const spinner = document.getElementById('spinner');
  const submitBtn = form.querySelector('input[type="submit"]');
  const paisSelect = document.getElementById('pais');
  const telefonoInput = document.getElementById('telefono');
  let prefijos = {};

  // Validaciones básicas
  const expRegNombre = /^[\p{L}\s]+$/u;
  const expRegTelefono = /^[0-9\s()+-]{6,20}$/;

  // 1. Cargar lista de países desde REST Countries
  fetch('https://restcountries.com/v3.1/all')
    .then(res => res.json())
    .then(data => {
      // Ordenar alfabéticamente
      data.sort((a, b) => a.name.common.localeCompare(b.name.common));
      paisSelect.innerHTML = '<option value="">Elegir país</option>';

      data.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.cca2;
        opt.textContent = p.name.common;
        paisSelect.appendChild(opt);

        // Guardar prefijo
        if (p.idd && p.idd.root) {
          prefijos[p.cca2] = p.idd.root + (p.idd.suffixes ? p.idd.suffixes[0] : '');
        }
      });
    })
    .catch(err => {
      console.error("Error cargando países:", err);
      paisSelect.innerHTML = '<option value="">No se pudo cargar</option>';
    });

  // 2. Autocompletar prefijo al elegir país
  paisSelect.addEventListener('change', () => {
    const selected = paisSelect.value;
    telefonoInput.value = prefijos[selected] ? prefijos[selected] + ' ' : '';
  });

  // 3. Envío del formulario
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = form.nombre.value.trim();
    const apellido = form.apellido.value.trim();
    const telefono = telefonoInput.value.trim();

    // Validaciones
    if (!expRegNombre.test(nombre)) {
      Swal.fire('Error', 'El nombre solo puede contener letras y espacios.', 'error');
      return;
    }
    if (!expRegNombre.test(apellido)) {
      Swal.fire('Error', 'El apellido solo puede contener letras y espacios.', 'error');
      return;
    }
    if (telefono && !expRegTelefono.test(telefono)) {
      Swal.fire('Error', 'El teléfono solo puede contener números y caracteres válidos.', 'error');
      return;
    }
    if (!paisSelect.value) {
      Swal.fire('Error', 'Por favor selecciona un país.', 'error');
      return;
    }

    // Confirmación antes de enviar
    const confirmResult = await Swal.fire({
      title: '¿Enviar formulario?',
      text: 'Tu mensaje será enviado a nuestro correo.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, enviar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#5E548E'
    });

    if (!confirmResult.isConfirmed) return;

    // Spinner ON
    spinner.style.display = 'block';
    submitBtn.disabled = true;

    try {
      const response = await fetch(form.action, {
        method: form.method || 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        await Swal.fire('¡Éxito!', 'Formulario enviado correctamente.', 'success');
        form.reset();
      } else {
        Swal.fire('Error', 'No se pudo enviar. Intenta nuevamente.', 'error');
      }
    } catch (err) {
      Swal.fire('Error de conexión', 'Verifica tu conexión a Internet.', 'error');
      console.error(err);
    } finally {
      spinner.style.display = 'none';
      submitBtn.disabled = false;
    }
  });
});
