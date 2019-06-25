module.exports = (sequelize, DataType) => {
    const Creditos = sequelize.define("Creditos", {
        creditoId: {
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        valorVehiculo: {
            type: DataType.DOUBLE,
            allowNull: false
        },
        cuotaInicial: {
            type: DataType.DOUBLE,
            allowNull: false
        },
        moneda: {
            type: DataType.STRING(30),
            allowNull: false
        },
        cuota: {
            type: DataType.INTEGER,
            allowNull: false
        },
        tasa: {
            type: DataType.STRING(30),
            allowNull: false
        },
        tipoSeguroVehicular: {
            type: DataType.STRING(30),
            allowNull: false
        },
        costoOportunidad: {
            type: DataType.DOUBLE,
            allowNull: false
        },
        periodoGracia: {
            type: DataType.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        cuotaIPG: {
            type: DataType.INTEGER,
            allowNull: false
        },
        cuotaFPG: {
            type: DataType.INTEGER,
            allowNull: false
        },
    });
    Creditos.associate = models => {
        Creditos.belongsTo(models.Clientes, {
            foreignKey: { name: "clienteId", allowNull: false },
            onDelete: "CASCADE"
        });
        // Projects.hasMany(models.Routes, {
        //     foreignKey: { name: "projectId", allowNull: false },
        //     onDelete: "CASCADE"
        // });
    };

    return Creditos;
};
