module.exports = (sequelize, DataTypes) => {
    const attributes = {
        uid: { type: DataTypes.INTEGER, allowNull: false },
        user: { type: DataTypes.INTEGER, allowNull: false },
        method: { type: DataTypes.ENUM('update','delete'), allowNull: false },
    };
    return sequelize.define('admin_log', attributes);
}
