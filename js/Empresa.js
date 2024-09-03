import config from "../env.js";

document.addEventListener("DOMContentLoaded", function () {
  const userid= JSON.stringify(user['idUsuario']);
  if (permisos[0].permisos.personas.leer != 1) {
    window.location.href = `${config.HOST}views`;
  }
   
  const divEmpresaCard = document.getElementById("divEmpresaCard");
  const frmEmpresas = document.getElementById("frmEmpresas");

  const txtRuc = document.getElementById("txtRuc");
  const txtRepresentanteLegal = document.getElementById("txtRepresentanteLegal");
  const txtRazonSocial = document.getElementById("txtRazonSocial");
  const txtNombreComercial = document.getElementById("txtNombreComercial");
  const txtTelefono = document.getElementById("txtTelefono");
  const txtEmail = document.getElementById("txtEmail");

  const btnCancelarEmpresa = document.getElementById("btnCancelarEmpresa");

  frmEmpresas.addEventListener("submit", (event) => {
    event.preventDefault();

    if (permisos[0].permisos.personas.crear == 1) {
      const params = new FormData();
      params.append("operacion", "Registrar");
      params.append("ruc", txtRuc.value);
      params.append("representante_legal", txtRepresentanteLegal.value);
      params.append("razon_social", txtRazonSocial.value);
      params.append("nombre_comercial", txtNombreComercial.value);
      params.append("telefono", txtTelefono.value);
      params.append("email", txtEmail.value);
      params.append("iduser_create",userid);

      const options = {
        method: "POST",
        body: params,
      };

      fetch(`${config.HOST}controllers/Empresas.controllers.php`, options)
        .then((response) => response.json())
        .then((data) => {
          if (data.guardado) {
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
