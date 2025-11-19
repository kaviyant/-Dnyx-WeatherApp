import './App.css';
import { useEffect, useState } from 'react';

function App() {

  const [search,setSearch] = useState("chennai");
  const [city,setCity] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [isCelsius, setIsCelsius] = useState(true);

  const convertTemp = (celsius) => {
    return Math.round((celsius * 9/5) + 32);
  };

  const displayTemp = (celsius) => {
    return isCelsius ? Math.round(celsius) : convertTemp(celsius);
  };

  const getTempUnit = () => {
    return isCelsius ? '°C' : '°F';
  };

  const getWeatherData = async()=>{
    try {
      let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${search}&appid=7db7f4dc24f41ff2956b0ddce4ddf5da&units=metric`);
      let result = await response.json();
      setCity(result);
      
      if (result.coord) {
        let forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${result.coord.lat}&lon=${result.coord.lon}&appid=7db7f4dc24f41ff2956b0ddce4ddf5da&units=metric`);
        let forecastResult = await forecastResponse.json();
        
        const dailyData = {};
        forecastResult.list.forEach(item => {
          const date = new Date(item.dt * 1000).toLocaleDateString();
          if (!dailyData[date]) {
            dailyData[date] = item;
          }
        });
        
        setForecast(Object.values(dailyData).slice(0, 5));
      }
    } catch (err) {
      console.error('Error fetching weather data:', err);
    }
  };

  useEffect(()=>{
    getWeatherData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[search])

  return (
    <div className="App">

     <div className="weather-card">
  <div className="search-container">
    <input type="search" placeholder="enter city name" spellCheck="false" onChange={(e)=>setSearch(e.target.value)} />
    <button className="temp-toggle" onClick={() => setIsCelsius(!isCelsius)}>
      Switch to {isCelsius ? '°F' : '°C'}
    </button>
  </div>
  <div className="weather">
    <img className="weather-icon" src="https://static.vecteezy.com/system/resources/previews/024/825/182/non_2x/3d-weather-icon-day-with-rain-free-png.png" alt="weather icon" />
    <h1 className="temp">{displayTemp(city?.main?.temp)}{getTempUnit()}</h1>
    <h2 className="city">{city?.name}</h2>
    <p className="feels-like">Feels like: {displayTemp(city?.main?.feels_like)}{getTempUnit()}</p>
  </div>

  {forecast.map((day, index) => (
        <div key={index} className="forecast-card">
          <p className="forecast-date">{new Date(day.dt * 1000).toLocaleDateString()}</p>
          <p className="forecast-condition">{day.weather[0].main}</p>
          <p className="forecast-temp">
            <strong>{displayTemp(day.main.temp_max)}{getTempUnit()}</strong>
          </p>
          <p className="forecast-temp-min">{displayTemp(day.main.temp_min)}{getTempUnit()}</p>
        </div>
      ))}
</div>

    </div>
  );
}

export default App;
