/**
 * Muestra una pregunta basado en la librería SweetAlert
 * @param {string} pregunta Describa la pregunta que quiere mostrar
 * @param {string} modulo Módulo de la aplicación desde donde se genera (créditos, clientes, ventas, etc.)
 * @returns {boolean} Retorna un valor lógico basado en una promesa
 */
async function ask(pregunta = ``, modulo = `Delatel`){
  const respuesta = await Swal.fire({
    title: pregunta,
    text: modulo,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Aceptar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#3498db',
  });

  return respuesta.isConfirmed;
}


//Puede ser de 4 tipos: INFO, WARNING, ERROR, SUCCESS
function showToast(message = ``, type = `INFO`, duration = 2500, url = null){
  const bgColor = {
    'INFO'    : '#22a6b3',
    'WARNING' : '#f9ca24',
    'SUCCESS' : '#6ab04c',
    'ERROR'   : '#eb4d4b'
  };

  Swal.fire({
    toast: true,
    icon: type.toLowerCase(),
    iconColor: 'white',
    color: 'white',
    text: message,
    timer: duration,
    timerProgressBar: true,
    position: 'top-end',
    showConfirmButton: false,
    background: bgColor[type]
  }).then(() => {
    if (url != null){
      window.location.href = url;
    }
  });
}