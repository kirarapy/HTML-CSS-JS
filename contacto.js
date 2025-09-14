document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formulario');
  const spinner = document.getElementById('spinner');
  const submitBtn = form.querySelector('input[type="submit"]');
  const paisSelect = document.getElementById('pais');
  const telefonoInput = document.getElementById('telefono');

  let prefijos = {};
  // Validaciones
  const expRegNombre = /^[\p{L}\s]+$/u; // letras con acentos
  const expRegTelefono = /^[0-9\s()+-]{6,20}$/; // números, +, -, (), espacios
 // 1. Cargar países con proxy para evitar CORS
  async function cargarPaises() {
  try {
    const res = await fetch(
      'https://api.allorigins.win/get?url=' + encodeURIComponent('https://restcountries.com/v3.1/all')
    );
    if (!res.ok) throw new Error("Error al cargar API");

    const dataProxy = await res.json();
    const data = JSON.parse(dataProxy.contents); // 🔹 CORRECCIÓN

    if (!Array.isArray(data)) throw new Error("Formato inesperado de API");

    console.log("✅ Países recibidos:", data.length);

    data.sort((a, b) => a.name.common.localeCompare(b.name.common));

    paisSelect.innerHTML = '<option value="">Elegir país</option>';

    data.forEach(p => {
      if (p.name && p.cca2) {
        const opt = document.createElement('option');
        opt.value = p.cca2;
        opt.textContent = p.name.common;
        paisSelect.appendChild(opt);

        if (p.idd && p.idd.root) {
          prefijos[p.cca2] = p.idd.root + (p.idd.suffixes ? p.idd.suffixes[0] : '');
        }
      }
    });

  } catch (err) {
    console.error("❌ No se pudo cargar países:", err);
    paisSelect.innerHTML = '<option value="">Error cargando países</option>';
  }
}
  cargarPaises();

  // Autocompletar prefijo según país (pero editable)
  paisSelect.addEventListener('change', () => {
    const selected = paisSelect.value;
    if (prefijos[selected]) {
      telefonoInput.value = prefijos[selected] + ' ';
    }
  });

  // 2. Envío del formulario
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = form.nombre.value.trim();
    const apellido = form.apellido.value.trim();
    const telefono = telefonoInput.value.trim();
    const pais = paisSelect.value;
    // Validaciones básicas
    if (!expRegNombre.test(nombre)) {
      Swal.fire('Error', 'El nombre solo puede contener letras y espacios.', 'error');
      return;
    }
    if (!expRegNombre.test(apellido)) {
      Swal.fire('Error', 'El apellido solo puede contener letras y espacios.', 'error');
      return;
    }
    if (telefono && !expRegTelefono.test(telefono)) {
      Swal.fire('Error', 'El teléfono contiene caracteres inválidos.', 'error');
      return;
    // if (!pais) {
    //   Swal.fire('Error', 'Por favor selecciona un país.', 'error');
    //   return;
    // }

    // Confirmación
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


