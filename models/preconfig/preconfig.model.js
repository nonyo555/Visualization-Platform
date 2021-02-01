module.exports = (sequelize, DataTypes) => {
    const attributes = {
        file_id: { type: DataTypes.INTEGER, allowNull: false },
        vname: { type: DataTypes.STRING, allowNull: false },
        data: { type: DataTypes.BLOB("long"), allowNull: false },
        config: { type: DataTypes.BLOB("long"), allowNull: false },
        dataFileName:  { type: DataTypes.STRING, allowNull: false },
        configFileName : { type: DataTypes.STRING, allowNull: false }
    };
    return sequelize.define('preconfig', attributes);
}
