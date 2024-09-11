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

  const txtDireccion = document.getElementById("txtDireccion");
  const txtReferencia = document.getElementById("txtReferencia");


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
          registrarcliente(data.idEmpresa);

          frmEmpresas.reset();
        })
        .catch((e) => {
          console.error(e);
        });
    }
  });


  function registrarcliente(idEmpresa) {
    const params = new FormData();
    params.append("operacion", "add");;
    params.append("direccion", txtDireccion.value);
    params.append("referencia", txtReferencia.value);
    params.append("idempresa",idEmpresa)
    params.append("idPersona","");
    params.append("iduser_create", userid);

    const options = {
      method: "POST",
      body: params,
    };

    fetch(`${config.HOST}controllers/Cliente.controllers.php`, options)
      .then((response) => response.text())
      .then((data) => {
        console.log(data)
        if (data.Actualizado) {
          alert("Correcto");
        } else {
          alert("Error: Verifique");
        }
      })
      .catch((e) => {
        console.error(e);
      });
  }
});
