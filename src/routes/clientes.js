module.exports = app => {
  const Clientes = app.db.models.Clientes;
  const Creditos = app.db.models.Creditos;
  const admin = app.libs.firebase;

  app
    .route("/clientes")
    .get((req, res) => {
      Clientes.findAll({})
        .then(result => {
          res.json(result);
        })
        .catch(err => {
          res.status(412).json({ msg: err.message });
        });
    })
    .post((req, res) => {
      let body = req.body;
      console.log(body);
      admin
        .auth()
        .createUser({
          email: body.clienteEmail,
          emailVerified: false,
          phoneNumber: body.clientePhoneNumber,
          password: body.clientePassword,
          displayName: body.clienteFirstName,
          photoURL: body.clientePhotoURL,
          disabled: false
        })
        .then(function (userRecord) {
          console.log("Successfully created new user:", userRecord.uid);
          Clientes.create({
            clienteUid: userRecord.uid,
            clienteFirstName: body.clienteFirstName,
            clienteLastName: body.clienteLastName,
            clientePhotoURL: body.clientePhotoURL,
            clientePhoneNumber: body.clientePhoneNumber,
            clienteDni: body.clienteDni,
            clienteEmail: body.clienteEmail,
            customerId: body.customerId,
            clienteMonthyIncome: body.clienteMonthyIncome
          })
            .then(result => {
              res.json(result);
            })
            .catch(err => {
              console.log(err.message);
              res.status(412).json({ msg: err.message });
            });
        })
        .catch(function (error) {
          console.log("Error creating new user:", error);
        });
    });
  app
    .route("/clientes/:clienteId")
    .get((req, res) => {
      Clientes.findOne({
        where: req.params,
        include: [
          {
            model: Routes
          },
          {
            model: Customers
          }
        ]
      })
        .then(result => {
          res.json(result);
        })
        .catch(err => {
          res.status(412).json({ msg: err.message });
        });
    })
    .put((req, res) => {
      Clientes.update(req.body, { where: req.params })
        .then(result => {
          res.sendStatus(204);
        })
        .catch(err => {
          res.status(412).json({ msg: err.message });
        });
    })
    .delete((req, res) => {
      Clientes.destroy({ where: req.params })
        .then(result => {
          res.sendStatus(204);
        })
        .catch(err => {
          res.status(412).json({ msg: err.message });
        });
    });
  app.route("/creditosCliente/:clienteId").get((req, res) => {
    console.log(req.params);
    Clientes.findAll({
      where: req.params,
      include: [
        {
          model: Creditos,
          order: [["createdAt", "DESC"]],
          limit: 10
        }
      ],
    })
      .then(result => {
        res.json(result);
      })
      .catch(err => {
        res.status(412).json({ msg: err.message });
      });
  });
};
