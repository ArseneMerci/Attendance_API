import AllowedLocations from '../database/models/allowedLocations'
import { 
    toLatLon,  insideCircle
  } from 'geolocation-utils'


const checkLocation = async(lati, long)=>{
  
    const data = await AllowedLocations.find()
    const polygon =[]
    for(var i = 0; i < data.length; i++) {
      const {latitude, longitude,radius} = data[i]
      const location = toLatLon({lat:parseFloat(latitude), lng:parseFloat(longitude)})
      const data2 = {latitude:location.lat, longitude:location.lon, radius}
       polygon.push(data2)
     }
     
     for(let i = 0; i<polygon.length; i++){
      const data = polygon[i]
      const location = toLatLon({lat:parseFloat(data.latitude), lng:parseFloat(data.longitude)})
      const userLocation = toLatLon({lat:parseFloat(lati), lng:parseFloat(long)})
      const center = {lat: location.lat , lon: location.lon}
       if(insideCircle({lat: userLocation.lat, lon: userLocation.lon}, center, data.radius)){
         return true
       }
     }
    return false;
 
}
export default checkLocation