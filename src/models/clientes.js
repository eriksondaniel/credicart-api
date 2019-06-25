module.exports = (sequelize, DataType) => {
  const Clientes = sequelize.define("Clientes", {
    clienteId: {
      type: DataType.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    clienteUid: {
      type: DataType.STRING(50),
      allowNull: false
    },
    clienteFirstName: {
      type: DataType.STRING(30),
      allowNull: false
    },
    clienteLastName: {
      type: DataType.STRING(30),
      allowNull: false
    },
    clientePhotoURL: {
      type: DataType.STRING(200),
      allowNull: false
    },
    clientePhoneNumber: {
      type: DataType.STRING(20),
      allowNull: false
    },
    clienteDni: {
      type: DataType.STRING(10),
      allowNull: false
    },
    clienteEmail: {
      type: DataType.STRING(30),
      allowNull: false
    },
    clienteRole: {
      type: DataType.STRING(30),
      allowNull: false,
      defaultValue: 'USER_ROLE'
    },
    clienteMonthyIncome: {
      type: DataType.STRING(30),
      allowNull: false
    },
  });
  Clientes.associate = models => {
    // clientes.belongsTo(models.Credits, {
    //   foreignKey: { name: "creditId", allowNull: false },
    //   onDelete: "CASCADE"
    // });

    Clientes.hasMany(models.Creditos, {
      foreignKey: { name: "clienteId", allowNull: false },
      onDelete: "CASCADE"
    });
    // clientes.belongsToMany(models.Routes, {
    //   through: models.Assignments,
    //   uniqueKey: "assignmentId",
    //   foreignKey: { name: "clienteId", allowNull: false },
    //   onDelete: "CASCADE"
    // });
  };

  return Clientes;
};
