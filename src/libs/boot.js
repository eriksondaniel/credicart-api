module.exports = app => {
  //crear las tablas
  app.db.sequelize.sync().done(() => {
    app.listen(app.get("port"), () => {
      console.log("Server on port", app.get("port"));
    });
  });
};
