module.exports = (sequelize, DataTypes) => {
    const file = sequelize.define("file", {
      refId: { type: DataTypes.STRING, allowNull: false },
      data: { type: DataTypes.BLOB("long"), allowNull: false },
      username: { type: DataTypes.STRING, allowNull: false },
      status: { type: DataTypes.ENUM('active','inactive'), allowNull: false }
    });
  
    return file;
  };