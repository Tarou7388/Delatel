import config from "../env.js";
document.addEventListener("DOMContentLoaded", () => {
  const userid = user["idUsuario"];
  const btnAgregarRouter = document.getElementById("btnAgregarRouter");
  const routersContainer = document.getElementById("routersContainer");
  const saveButton = document.getElementById("saveButton");
  const routerConfigModal = new bootstrap.Modal(document.getElementById('routerConfigModal'));


  var today = new Date().toISOString().split("T")[0];
  document.getElementById("txtFecha").value = today;

  let tipoPaquete = "";
  let jsonData = {};
  let routerCount = 0;

  (async () => {
    try {
      const response = await fetch(
        `${config.HOST}app/controllers/Contrato.controllers.php?operacion=obtenerFichaInstalacion&id=${idContrato}`
      );
      const data = await response.json();
      console.log(data);

      if (data.length === 0 || !data[0].ficha_instalacion) {
        showToast("No hay datos en Ficha de Instalación", "INFO");
      }

      const fichaInstalacion = JSON.parse(data[0].ficha_instalacion);

      document.getElementById("txtCliente").value = data[0].nombre_cliente;
      document.getElementById("txtNumFicha").value = data[0].id_contrato;
      document.getElementById("txtPaquete").value = data[0].paquete;
      document.getElementById("txtPrecio").value = data[0].precio;

      tipoPaquete = data[0].tipo_servicio;


    } catch (error) {
      console.error("Error al consultar paquetes:", error);
    }
  })();


  function agregarRouter() {
    routerCount++;

    routerConfigModal.show();

    saveButton.onclick = function () {
      const wan = document.getElementById("txtWanRouter").value;
      const mascara = document.getElementById("txtMascaraRouter").value;
      const puertaEnlace = document.getElementById("txtPuertaEnlaceRouter").value;
      const dns1 = document.getElementById("txtDns1Router").value;
      const dns2 = document.getElementById("txtDns2Router").value;
      const lan = document.getElementById("txtLanWireless").value;
      const acceso = document.getElementById("txtAccesoWireless").value;
      const ssid = document.getElementById("txtSsidWireless").value;
      const seguridad = document.getElementById("txtSeguridadWireless").value;
      const otros = document.getElementById("txtOtrosWireless").value;

      const routerCard = document.createElement("div");
      routerCard.classList.add("card", "mb-3");

      routerCard.innerHTML = `
        <div class="card-header">
          Router N° ${routerCount}
        </div>
        <div class="card-body">
          <ul>
            <li><strong>WAN:</strong> ${wan}</li>
            <li><strong>Máscara:</strong> ${mascara}</li>
            <li><strong>Puerta de Enlace:</strong> ${puertaEnlace}</li>
            <li><strong>DNS 1:</strong> ${dns1}</li>
            <li><strong>DNS 2:</strong> ${dns2}</li>
            <li><strong>LAN Wireless:</strong> ${lan}</li>
            <li><strong>Acceso Wireless:</strong> ${acceso}</li>
            <li><strong>SSID:</strong> ${ssid}</li>
            <li><strong>Seguridad:</strong> ${seguridad}</li>
            <li><strong>Otros:</strong> ${otros}</li>
          </ul>
        </div>
      `;

      const deleteButton = document.createElement("button");
      deleteButton.classList.add("btn", "btn-danger", "ms-2");
      deleteButton.textContent = "Eliminar";

      deleteButton.addEventListener("click", function () {
        routersContainer.removeChild(routerCard);
        routerCount--;
        actualizarNumeros();
      });

      routerCard.querySelector(".card-body").appendChild(deleteButton);
      routersContainer.appendChild(routerCard);


      routerConfigModal.hide();


      limpiarCampos();
    };
  }


  function limpiarCampos() {
    document.getElementById("txtWanRouter").value = "";
    document.getElementById("txtMascaraRouter").value = "";
    document.getElementById("txtPuertaEnlaceRouter").value = "";
    document.getElementById("txtDns1Router").value = "";
    document.getElementById("txtDns2Router").value = "";
    document.getElementById("txtLanWireless").value = "";
    document.getElementById("txtAccesoWireless").value = "";
    document.getElementById("txtSsidWireless").value = "";
    document.getElementById("txtSeguridadWireless").value = "";
    document.getElementById("txtOtrosWireless").value = "";
  }


  function actualizarNumeros() {
    const routerCards = routersContainer.querySelectorAll(".card");
    routerCount = routerCards.length; 


    routerCards.forEach((card, index) => {
      const cardHeader = card.querySelector(".card-header");
      cardHeader.textContent = `Router N° ${index + 1}`; 
    });
  }

  btnAgregarRouter.addEventListener("click", agregarRouter);





  /* async function registrar() {
    const antenas = document.getElementById('slcAntenas').value;
    const router = document.getElementById('slcRouter').value;
    const frecuencia = ["2G", "5G"]; 
    const base = document.getElementById('slcBase').value;
    const subBase = document.getElementById('slcSubBase').value;
    const signalStrength = document.getElementById('txtSignalStrength').value;
    const noiseFloor = document.getElementById('txtNoiseFloor').value;
    const transmitCCQ = parseFloat(document.getElementById('txtTransmiTccq').value);
    const txrxRate = parseFloat(document.getElementById('txtTxrxRate').value);

    const wan = document.getElementById('txtWan').value;
    const mascara = document.getElementById('txtMascara').value;
    const puertaEnlace = document.getElementById('txtPuertaEnlace').value;
    const dns1 = document.getElementById('txtDns1').value;
    const dns2 = document.getElementById('txtDns2').value;

    const lan = document.getElementById('txtLan').value;
    const acceso = parseInt(document.getElementById('txtAcceso').value, 10);
    const ssid = document.getElementById('txtSsid').value;
    const seguridad = document.getElementById('txtSeguridad').value;
    const otros = document.getElementById('txtOtros').value;
    const instalador = document.getElementById('txtInstalador').value;
    const fechaIns = document.getElementById('txtFechains').value;

    const data = {
      parametrosgenerales: {
        antenas,
        router,
        frecuencia,
        base,
        subbase: subBase,
        signalstrength: signalStrength,
        noisefloor: noiseFloor,
        transmitccq: transmitCCQ,
        'tx/rxrate': txrxRate
      },
      configuracionred: {
        wan,
        mascara,
        puertaenlace: puertaEnlace,
        dns1,
        dns2
      },
      configuracionlan: {
        lan,
        acceso,
        ssid,
        seguridad,
        otros,
        instalador,
        fecha: fechaIns
      }
    };

    const jsonData = JSON.stringify(data);
    try {
      const response = await fetch(`${config.HOST}app/controllers/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonData,
      });

      const result = await response.json();
      console.log('Success:', result);
    } catch (error) {
      console.error('Error:', error);
    }
  } */

  /* document.getElementById('btnRegistrar').addEventListener('click', function (event) {
    event.preventDefault();
    registrar(); 
  }); */
});