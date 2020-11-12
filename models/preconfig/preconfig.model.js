module.exports = (sequelize, DataTypes) => {
    const attributes = {
        refId: { type: DataTypes.INTEGER, allowNull: false },
        data: { type: DataTypes.BLOB("long"), allowNull: false },
        config: { type: DataTypes.STRING, allowNull: false },
    };
    return sequelize.define('preconfig', attributes);
}
