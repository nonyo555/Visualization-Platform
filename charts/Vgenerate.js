const sunburst = require('./ZoomableSunburst/classSunburst.js')
const polygon = require('./ThaiPolygon/classThaiPolygon.js')
class Vgen{
    graphs = [1,2,3,4,5] 
    static getGrap(){
        return graphs
    }
    static createSunburst()
    {
        return new sunburst.Sunburst()
    }
    static createThaiPolygon()
    {
        return new polygon.ThaiPolygon()
    }
}
module.exports ={Vgen}