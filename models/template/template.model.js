module.exports = (sequelize, DataTypes) => {
    const attributes = {
        uid: { type: DataTypes.INTEGER, allowNull: false },
        TemplateName: { type: DataTypes.STRING, allowNull: false },
        Path: { type: DataTypes.STRING, allowNull: false },
        status: { type: DataTypes.ENUM('active','inactive'), allowNull: false }
    };
    return sequelize.define('templatepath', attributes);
}
