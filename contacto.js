document.addEventListener('DOMContentLoaded', () {
  const form = document.getElementById('formulario');
  const spinner = document.getElementById('spinner');
  const submitBtn = form.querySelector('input[type="submit"]');

  // Expresiones regulares
  const expRegNombre = /^[\p{L}\s]+$/u;;
  const expRegTelefono = /^[0-9\s()+-]{6,20}$/;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = form.nombre.value.trim();
    const apellido = form.apellido.value.trim();
    const telefono = form.telefono.value.trim();
    const pais = form.pais.value.trim();

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
    if (!pais) {
      Swal.fire('Error','Por favor selecciona un país.','error');
      return;
    }

    // Confirmación (SweetAlert2)
    const confirmResult = await Swal.fire({
      title: '¿Estás segura?',
      text: 'Se enviará el formulario a tu correo.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, enviar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#5E548E'
    });

    if (!confirmResult.isConfirmed) return;

    // Mostrar spinner
    spinner.style.display = 'block';
    submitBtn.disabled = true;

    try {
      // Enviar al endpoint definido en form.action (Formspree)
      const response = await fetch(form.action, {
        method: form.method || 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' } // Formspree responde JSON si se pide
      });

      if (response.ok) {
        // Puedes leer JSON si Formspree devuelve algo:
        // const data = await response.json().catch(()=>null);
        await Swal.fire('¡Hecho!', 'Formulario enviado correctamente.', 'success');
        form.reset();
      } else {
        // Intento de leer error en JSON
        let errText = 'No se pudo enviar. Intenta nuevamente.';
        try {
          const errJson = await response.json();
          if (errJson && errJson.error) errText = errJson.error;
        } catch (err) { /* ignore */ }
        Swal.fire('Error', errText, 'error');
      }
    } catch (networkErr) {
      Swal.fire('Error de conexión', 'Verifica tu conexión a Internet o la URL de Formspree.', 'error');
      console.error(networkErr);
    } finally {
      spinner.style.display = 'none';
      submitBtn.disabled = false;
    }
  });
});

