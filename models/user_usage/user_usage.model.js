module.exports = (sequelize, DataTypes) => {
    const attributes = {
        uid: { type: DataTypes.INTEGER, allowNull: false },
        count: { type: DataTypes.INTEGER, allowNull: false },
        is_reachlimit: { type: DataTypes.BOOLEAN, allowNull: false },
    };
    return sequelize.define('user_usage', attributes);
}
