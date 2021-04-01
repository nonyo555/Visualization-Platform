module.exports = (sequelize, DataTypes) => {
    const attributes = {
        title: { type: DataTypes.STRING, allowNull: false },
        message: { type: DataTypes.TEXT, allowNull: false },
    };
    return sequelize.define('announcement', attributes);
}
