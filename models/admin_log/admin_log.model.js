module.exports = (sequelize, DataTypes) => {
    const attributes = {
        uid: { type: DataTypes.INTEGER, allowNull: false },
        role: { type: DataTypes.ENUM('user','admin','superadmin','designer'), allowNull: false, defaultValue: 'user'},
        method: { type: DataTypes.ENUM('UPDATE','DELETE','FORGOT_PASSWORD','RESET_PASSWORD'), allowNull: false },
        target_id: { type: DataTypes.INTEGER, allowNull: false },
        target: { type: DataTypes.STRING, allowNull: false }
    };
    return sequelize.define('admin_log', attributes);
}
