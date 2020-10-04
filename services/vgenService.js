const sunburst = require('../charts/ZoomableSunburst/classSunburst')
const polygon = require('../charts/ThaiPolygon/classThaiPolygon')
const barChart = require('../charts/barChart/classBarChart')
const uploadController = require("../controller/upload");
const filedb = require("../models/file.db");
const file = filedb.file;

//check refId if already in db
async function isRefIdUnique(refId) {
  if(await file.findOne({where: { refId: refId }})){
    return false;
  }
  return true;
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
  static createBarChart(){
    return new barChart.BarChart();
  }
}

module.exports = { Vgen, generateRefId }
