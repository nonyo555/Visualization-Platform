module.exports = (sequelize, DataTypes) => {
    const attributes = {
        role: { type: DataTypes.ENUM('user','admin','superadmin','designer'), allowNull: false, defaultValue: 'user'},
        method: { type: DataTypes.ENUM('CREATE','GET','UPDATE','DELETE','FORGOT_PASSWORD','RESET_PASSWORD'), allowNull: false },
        target: { type: DataTypes.STRING, allowNull: false },
        target_id: { type: DataTypes.INTEGER, allowNull: false }
    };
    return sequelize.define('designer_log', attributes);
}
