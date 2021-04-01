module.exports = (sequelize, DataTypes) => {
    const attributes = {
        count: { type: DataTypes.INTEGER, allowNull: false },
        is_reachlimit: { type: DataTypes.BOOLEAN, allowNull: false },
    };
    return sequelize.define('user_usage', attributes);
}
