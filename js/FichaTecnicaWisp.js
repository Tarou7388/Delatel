import config from "../env.js";
window.addEventListener("DOMContentLoaded", () => {

  async function registrar() {
    const antenas = document.getElementById('slcAntenas').value;
    const router = document.getElementById('slcRouter').value;
    const frecuencia = ["2G", "5G"]; // Personalizar según la selección
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
    console.log(jsonData);
    try {
      const response = await fetch('url_del_servidor', {
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
  }

  document.getElementById('btnRegistrar').addEventListener('click', function (event) {
    event.preventDefault();
    registrar(); 
  });
});