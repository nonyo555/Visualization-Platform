module.exports = (sequelize, DataTypes) => {
    const attributes = {
        uid: { type: DataTypes.INTEGER, allowNull: false },
        file_id: { type: DataTypes.INTEGER, allowNull: false },
        method: { type: DataTypes.ENUM('create','get','update','delete'), allowNull: false },
    };
    return sequelize.define('user_log', attributes);
}
