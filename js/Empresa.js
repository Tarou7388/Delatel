import config from "../env.js";

document.addEventListener("DOMContentLoaded", function () {
  if (permisos[0].permisos.personas.leer != 1) {
    window.location.href = `${config.HOST}views`;
  }

  const divEmpresaCard = document.getElementById("divEmpresaCard");
  const frmEmpresas = document.getElementById("frmEmpresas");

  const txtNumDocumentoEmpresa = document.getElementById("txtNumDocumentoEmpresa");
  const txtRuc = document.getElementById("txtRuc");
  const txtNombresEmpresa = document.getElementById("txtNombresEmpresa");
  const txtApellidosEmpresa = document.getElementById("txtApellidosEmpresa");
  const txtRazonSocial = document.getElementById("txtRazonSocial");
  const txtNombreComercial = document.getElementById("txtNombreComercial");
  const btnCancelarEmpresa = document.getElementById("btnCancelarEmpresa");

  frmEmpresas.addEventListener("submit", (event) => {
    event.preventDefault();

    if (permisos[0].permisos.personas.crear == 1) {
      const params = new FormData();
      params.append("operacion", "add");
      params.append("numDocumento", txtNumDocumentoEmpresa.value);
      params.append("ruc", txtRuc.value);
      params.append("nombres", txtNombresEmpresa.value);
      params.append("apellidos", txtApellidosEmpresa.value);
      params.append("razonSocial", txtRazonSocial.value);
      params.append("nombreComercial", txtNombreComercial.value);

      const options = {
        method: "POST",
        body: params,
      };

      fetch(`../controllers/empresa.controller.php`, options)
        .then((response) => response.json())
        .then((data) => {
          if (data.Guardado) {
            alert("Empresa registrada correctamente");
          } else {
            alert("Error: Verifique los datos ingresados");
          }
          frmEmpresas.reset();
        })
        .catch((e) => {
          console.error(e);
        });
    }
  });
});
