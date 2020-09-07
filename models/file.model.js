module.exports = (sequelize, DataTypes) => {
    const file = sequelize.define("file", {
      refId: {
        type: DataTypes.STRING,
      },
      data: {
        type: DataTypes.BLOB("long"),
      },
    });
  
    return file;
  };