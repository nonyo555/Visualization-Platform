module.exports = (sequelize, DataTypes) => {
    const attributes = {
        file_id: { type: DataTypes.INTEGER, allowNull: false },
        vname: { type: DataTypes.STRING, allowNull: false},
        data: { type: DataTypes.STRING, allowNull: false },
        config: { type: DataTypes.STRING, allowNull: false },
    };
    return sequelize.define('preconfig', attributes);
}
