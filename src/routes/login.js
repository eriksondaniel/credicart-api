module.exports = app => {
  const Clientes = app.db.models.Clientes;
  const admin = app.libs.firebase;

  app.route("/login").post((req, res) => {
    console.log(req.body);

    let body = req.body;
    console.log("email: " + body.email);
    console.log("idToken: " + body.idToken);

    admin
      .auth()
      .verifyIdToken(body.idToken)
      .then(function (decodedToken) {
        var uid = decodedToken.uid;
        console.log(uid);
        // ...
        Clientes.findOne({
          where: { clienteUid: uid },
        })
          .then(result => {
            if (result == null) {
              res.status(400).json({ ok: false, msg: "Usuario no encontrado" });
            } else {
              res.json({ ok: true, result });
            }
          })
          .catch(err => {
            res.status(500).json({ ok: false, msg: err.message });
          });
      })
      .catch(function (error) {
        console.log(error);
        // Handle error
      });
  });
};
