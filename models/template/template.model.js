module.exports = (sequelize, DataTypes) => {
    const attributes = {
        uid: { type: DataTypes.INTEGER, allowNull: false },
        TemplateName: { type: DataTypes.STRING, allowNull: false },
        description: { type: DataTypes.BLOB("long"), allowNull: false },
        img: { type: DataTypes.STRING, allowNull: false },
        class_path: { type: DataTypes.STRING, allowNull: false },
        embedded_path: { type: DataTypes.STRING, allowNull: false },
        data: { type: DataTypes.STRING, allowNull: false },
        config: { type: DataTypes.STRING, allowNull: false },
        status: { type: DataTypes.ENUM('active','inactive'), allowNull: false }
    };
    return sequelize.define('template', attributes);
}
