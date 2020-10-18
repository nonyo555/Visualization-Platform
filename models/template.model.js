module.exports = (sequelize, DataTypes) => {
    const attributes = {
        TemplateName: { type: DataTypes.STRING, allowNull: false },
        Path: { type: DataTypes.STRING, allowNull: false },
    };
    return sequelize.define('templatepath', attributes);
}
