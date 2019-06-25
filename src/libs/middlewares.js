import express from "express";
import path from "path";
import cors from "cors";
module.exports = app => {
  //settings
  app.set("port", process.env.PORT || 4000);

  //static files
  app.use(express.static(path.join(__dirname, "../public/")));

  //coors
  app.use(cors());

  //middleware
  app.use(express.json());
};
