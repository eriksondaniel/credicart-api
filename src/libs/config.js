// module.exports = {
//   database: "db_finanzas",
//   username: "root",
//   password: "root",
//   params: {
//     dialect: "mysql",
//     define: {
//       underscore: false
//     },
//     operatorsAliases: false,
//     // sync: { force: true }
//   }
// };

module.exports = {
  database: "d8qj4gakrsi30",
  username: "ryufieewnykmba",
  password: "15e5bc7d17d627386315176db114b4c99f5b6ad148c63c90107de0651173e6a9",
  params: {
    host: "ec2-107-20-185-16.compute-1.amazonaws.com",
    port: "5432",
    dialect: "postgres",
    protocol: "postgres",
    logging: console.log,
    maxConcurrentQueries: 100,
    dialectOptions: {
      ssl: true
    },
    define: {
      underscore: false
    },
    operatorsAliases: false,
    // sync: { force: true }
  }
};
