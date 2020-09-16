const sunburst = require('../charts/ZoomableSunburst/classSunburst')
const polygon = require('../charts/ThaiPolygon/classThaiPolygon')
const uploadController = require("../controller/upload");
const db = require("../models");
const file = db.file;

//check refId if already in db
async function isRefIdUnique(refId) {
  try {
    return file.count({
      where: { refId: refId }
    }).then((count) => {
      console.log("count = " + count)
      if (count != 0) {
        return false;
      }
      return true;
    })
  } catch (err) {
    console.log(err);
  }
}

async function generateRefId() {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < 10; i++) { //10 digit id
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  while (!(await isRefIdUnique(result))) {
    result = '';
    for (var i = 0; i < 10; i++) { //10 digit id
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
  }
  return result;
}

class Vgen {
  constructor() {
    this.graphs = [1, 2, 3, 4, 5]
  }
  static getGrap() {
    return graphs
  }
  static createSunburst() {
    return new sunburst.Sunburst();
  }
  static createThaiPolygon() {
    return new polygon.ThaiPolygon();
  }
}

module.exports = { Vgen, generateRefId }
