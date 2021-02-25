module.exports = (sequelize, DataTypes) => {
    const file = sequelize.define("file", {
      refId: { type: DataTypes.STRING, allowNull: false },
      data: { type: DataTypes.BLOB("long"), allowNull: false },
      template: { type: DataTypes.STRING, allowNull: false },
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      status: { type: DataTypes.ENUM('active','inactive'), allowNull: false },
      img : { type: DataTypes.STRING, allowNull: false }
    });
  
    return file;
  };