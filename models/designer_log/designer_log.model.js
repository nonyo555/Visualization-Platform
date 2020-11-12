module.exports = (sequelize, DataTypes) => {
    const attributes = {
        uid: { type: DataTypes.INTEGER, allowNull: false },
        template_id: { type: DataTypes.INTEGER, allowNull: false },
        method: { type: DataTypes.ENUM('create','update','delete'), allowNull: false },
    };
    return sequelize.define('designer_log', attributes);
}
