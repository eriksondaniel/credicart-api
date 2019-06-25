module.exports = app => {
  const Creditos = app.db.models.Creditos;
  const Clientes = app.db.models.Clientes;

  app
    .route("/creditos")
    .get((req, res) => {
      Creditos.findAll({
        // include: [Routes]
      })
        .then(result => {
          res.json(result);
        })
        .catch(err => {
          res.status(412).json({ msg: err.message });
        });
    })
    .post((req, res) => {
      console.log(req.body);
      Creditos.create(req.body)
        .then(result => {
          res.json(result);
        })
        .catch(err => {
          console.log(err.message);
          res.status(412).json({ msg: err.message });
        });
    });
  app
    .route("/calcula")
    .post((req, res) => {
      console.log(req.body);
      var body = req.body
      //RESPONSE
      var responseTabla
      var tabla = []
      var finalTabla
      var response
      //VARIABLES
      var prestamo
      var desgravamenMensual = 0
      var seguroVehicular = 0
      var financiamientoCuotas = 0
      var interesMesUno = 0
      var interesMesPrestamo = 0
      var cuotaInicial = 0
      var amortizacionUno = 0
      var cuotaTotal = 0
      var van

      var TEM
      //CONSTANTES
      const envioFisico = 10
      const TEA = 0.1349
      const TNA = 0.1289
      const tasaDesgravamen = (0.006 * 30) / 360
      //INPUTS
      var valorVehiculo = body.valorVehiculo
      var montoInicial = (valorVehiculo * body.cuotaInicial) / 100
      console.log(montoInicial);
      
      var plazoPago = body.cuota
      if (body.tasa == 'TEA') {
        TEM = Math.pow(1 + TEA, 1 / 12) - 1
      } else if (body.tasa == 'TNA') {
        TEM = Math.pow(1 + TNA / 360, 30) - 1
      }

      var tasaSeguroVehicularMensual
      switch (body.tipoSeguroVehicular) {
        case 'Bajo riesgo':
          //bajo riesgo
          tasaSeguroVehicularMensual = 0.0486 * 30 / 360
          break;
        case 'Medio riesgo':
          //medio riesgo
          tasaSeguroVehicularMensual = 0.0585 * 30 / 360
          break;
        case 'Alto riesgo':
          //alto riesgo
          tasaSeguroVehicularMensual = 0.0611 * 30 / 360
          break;
        default:
          break;
      }
      var COK = body.costoOportunidad
      var periodoGracia = body.periodoGracia
      var tipoPeriodoGracia = body.tipoPeriodoGracia
      var cuotaIPG = body.cuotaIPG - 1
      var cuotaFPG = body.cuotaFPG - 1

      //CALCULOS
      prestamo = valorVehiculo - montoInicial
      desgravamenMensual = re(prestamo * tasaDesgravamen)
      seguroVehicular = valorVehiculo * tasaSeguroVehicularMensual
      financiamientoCuotas = valorVehiculo * 0.4
      interesMesUno = re(financiamientoCuotas * TEM)
      interesMesPrestamo = re(prestamo * TEM)
      cuotaInicial = re(financiamientoCuotas * (TEM / (1 - Math.pow((1 + TEM), - plazoPago))))
      amortizacionUno = re(cuotaInicial - interesMesUno)
      cuotaTotal = re(desgravamenMensual + seguroVehicular + interesMesPrestamo + amortizacionUno + envioFisico)
      van = -prestamo

      //CALCULOS TABLA
      var nuevoSaldo = prestamo
      var nuevoSaldo2 = financiamientoCuotas
      var desgravamenCuota = 0
      var interesCuota = 0
      var interesCuota2 = 0
      var amortizacionCuota = 0
      var nuevoSaldo3 = 0
      var saldoMostrar = 0
      var seguroCuota = 0
      var teCOK = Math.pow(1 + COK, 1 / 12) - 1

      for (let i = 0; i <= plazoPago - 1; i++) {

        //Plazo de gracias
        if (cuotaIPG <= i && cuotaFPG >= i) {
          if (periodoGracia) {
            if (tipoPeriodoGracia == 'Total') {
              cuotaTotal = 0
              interesCuota2 = re(nuevoSaldo2 * TEM)
              amortizacionCuota = 0
              nuevoSaldo3 = re(nuevoSaldo2 + interesCuota2)
              desgravamenCuota = re(nuevoSaldo * tasaDesgravamen)
              interesCuota = re(nuevoSaldo * TEM)
              seguroCuota = re(valorVehiculo * tasaSeguroVehicularMensual)
              saldoMostrar = nuevoSaldo + interesCuota2 + desgravamenCuota + seguroCuota
            }
            else if (tipoPeriodoGracia == 'Parcial') {
              console.log("Parcial");
              interesCuota2 = re(nuevoSaldo2 * TEM)
              amortizacionCuota = 0
              nuevoSaldo3 = re(nuevoSaldo2 + interesCuota2)
              desgravamenCuota = re(nuevoSaldo * tasaDesgravamen)
              interesCuota = re(nuevoSaldo * TEM)
              seguroCuota = re(valorVehiculo * tasaSeguroVehicularMensual)
              cuotaTotal = re(interesCuota + desgravamenCuota + seguroCuota)
              saldoMostrar = nuevoSaldo
            }
          }
        } else {
          //Atras
          interesCuota2 = re(nuevoSaldo2 * TEM)
          amortizacionCuota = re(cuotaInicial - interesCuota2)
          nuevoSaldo3 = re(nuevoSaldo2 - amortizacionCuota)
          /// LO QUE SE VE
          desgravamenCuota = re(nuevoSaldo * tasaDesgravamen)
          seguroCuota = re(valorVehiculo * tasaSeguroVehicularMensual)
          interesCuota = re(nuevoSaldo * TEM)
          var cuota = re(desgravamenCuota + seguroCuota + interesCuota + amortizacionCuota + envioFisico)
          saldoMostrar = re(nuevoSaldo - amortizacionCuota) //saldo final
        }

        van = re((van + (cuotaTotal / Math.pow(1 + teCOK, i + 1))))

        tabla.push({
          i, cuotaTotal, nuevoSaldo,
          desgravamenCuota, seguroCuota, amortizacionCuota,
          interesCuota, envioFisico, cuota,
          nuevoSaldo2, interesCuota2, nuevoSaldo3, saldoMostrar,
          van
        })

        // nuevoSaldo = saldoMostrar
        if (periodoGracia) {
          nuevoSaldo = saldoMostrar
        }
        else {
          nuevoSaldo = nuevoSaldo - amortizacionCuota
        }
        nuevoSaldo2 = nuevoSaldo3
        if (periodoGracia) {
          if (cuotaFPG == i) {
            desgravamenMensual = saldoMostrar * tasaDesgravamen
            interesMesUno = nuevoSaldo3 * TEM
            interesMesPrestamo = saldoMostrar * TEM
            cuotaInicial = re(nuevoSaldo3 * (TEM / (1 - Math.pow((1 + TEM), - (plazoPago - cuotaFPG - 1)))))
            amortizacionUno = re(cuotaInicial - interesMesUno)
            cuotaTotal = re(desgravamenMensual + seguroVehicular + interesMesPrestamo + amortizacionUno + envioFisico)
            console.log(cuotaTotal);
          }
        }

        //DIME QUE HAG0 ?
        // if (i == plazoPago) {
        //   console.log("plazoPago : " + i);
        //   desgravamenMensual = saldoMostrar * tasaDesgravamen
        //   interesMesUno = nuevoSaldo3 * TEM
        //   interesMesPrestamo = saldoMostrar * TEM
        //   cuotaTotal = re(desgravamenMensual + seguroVehicular + interesMesPrestamo + amortizacionUno + envioFisico)
        //   amortizacionCuota = nuevoSaldo2
        //   ultimacuota = amortizacionCuota + desgravamenMensual + interesMesUno + interesMesPrestamo + envioFisico
        //   cuotaTotal = ultimacuota

        //   tabla.push({
        //     cuotaTotal, nuevoSaldo,
        //     desgravamenCuota, seguroCuota, amortizacionCuota,
        //     interesCuota, envioFisico, cuota,
        //     nuevoSaldo2, interesCuota2, nuevoSaldo3, saldoMostrar,
        //     van,
        //     amortizacionUno
        //   })
        // }
      }

      // desgravamenMensual = saldoMostrar * tasaDesgravamen
      // interesMesUno = nuevoSaldo3 * TEM
      // interesMesPrestamo = saldoMostrar * TEM
      // cuotaTotal = re(desgravamenMensual + seguroVehicular + interesMesPrestamo + amortizacionUno + envioFisico)
      // amortizacionUno = 9999999999
      // ultimacuota = amortizacionUno + desgravamenMensual + interesMesUno + interesMesPrestamo + envioFisico
      // cuotaTotal = ultimacuota
      // finalTabla = {
      //   montoInicial, plazoPago, valorVehiculo,
      //   prestamo, desgravamenMensual, seguroVehicular,
      //   financiamientoCuotas, interesMesUno, interesMesPrestamo,
      //   cuotaInicial, amortizacionUno, cuotaTotal
      // }
      responseTabla = {
        tabla
      }
      response = {
        responseTabla,
      }
      function re(num) {
        return Math.round(num * 100) / 100
      }
      res.json(response);
    });

  app
    .route("/creditos/:creditoId")
    .get((req, res) => {
      Creditos.findOne({ where: req.params })
        .then(result => {
          res.json(result);
        })
        .catch(err => {
          res.status(412).json({ msg: err.message });
        });
    })
    .put((req, res) => {
      Creditos.update(req.body, { where: req.params })
        .then(result => {
          res.sendStatus(204);
        })
        .catch(err => {
          res.status(412).json({ msg: err.message });
        });
    })
    .delete((req, res) => {
      Creditos.destroy({ where: req.params })
        .then(result => {
          res.sendStatus(204);
        })
        .catch(err => {
          res.status(412).json({ msg: err.message });
        });
    });
};
