document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('formulario');
  const spinner = document.getElementById('spinner');
  const submitBtn = form.querySelector('input[type="submit"]');

  // Expresiones regulares para validaciones opcionales
  const expRegNombre = /^[a-z+àèìòùñ\s]+$/i;
  const expRegTelefono = /^[0-9\s]+$/;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Validaciones personalizadas
    const nombre = document.getElementById('nombre').value.trim();
    const apellido = document.getElementById('apellido').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const pais = document.getElementById('pais').value.trim();

    if (!expRegNombre.test(nombre)) {
      alert("El nombre solo puede contener letras y espacios.");
      return;
    }
    if (!expRegNombre.test(apellido)) {
      alert("El apellido solo puede contener letras y espacios.");
      return;
    }
    if (telefono && !expRegTelefono.test(telefono)) {
      alert("El teléfono solo puede contener números y espacios.");
      return;
    }
    if (!pais) {
      alert("Por favor selecciona un país.");
      return;
    }

    // Confirmación antes de enviar
    if (!confirm("¿Estás seguro de enviar el formulario?")) {
      return;
    }

    // Mostrar spinner
    spinner.style.display = 'block';
    submitBtn.disabled = true;

    // Simular envío (puedes cambiar por envío real con fetch)
    setTimeout(() => {
      spinner.style.display = 'none';
      alert("Formulario enviado con éxito.");
      form.reset();
      submitBtn.disabled = false;
    }, 2000);
  });
});
