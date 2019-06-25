import Sequelize from "sequelize";
import fs from "fs";
import path from "path";
let db = null;
module.exports = app => {
  const config = app.libs.config;
  console.log(config);

  if (!db) {
    const sequelize = new Sequelize(
      config.database,
      config.username,
      config.password,
      config.params
    );
    sequelize
      .authenticate()
      .then(() => {
        console.log("Connection has been established successfully.");
      })
      .catch(err => {
        console.error("Unable to connect to the database:", err);
      });
    db = {
      sequelize,
      Sequelize,
      models: {}
    };
    const dir = path.join(__dirname, "models");
    fs.readdirSync(dir).forEach(fileName => {
      const modelDir = path.join(dir, fileName);
      const model = sequelize.import(modelDir);
      db.models[model.name] = model;
    });

    Object.keys(db.models).forEach(key => {
      db.models[key].associate(db.models);
    });
  }

  return db;
};
