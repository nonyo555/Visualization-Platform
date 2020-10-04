module.exports = (sequelize, DataTypes) => {
    const file = sequelize.define("file", {
      refId: {
        type: DataTypes.STRING,
        allowNull: false
      },
      data: {
        type: DataTypes.BLOB("long"),
        allowNull: false
      },
    });
  
    return file;
  };