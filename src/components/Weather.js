// src/components/Weather.js
import React, { useState } from 'react';
import axios from 'axios';
console.log('API KEY:', process.env.REACT_APP_WEATHER_API_KEY);

const Weather = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [airQuality, setAirQuality] = useState(null);
  const [error, setError] = useState(null);

  const apiKey = process.env.REACT_APP_WEATHER_API_KEY;

    const fetchAirQuality = async (lat, lon) => {
          try {
            const res = await axios.get(
              `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`
            );
            setAirQuality(res.data);
          } catch (err) {
            setAirQuality(null);
          }
        };

    const fetchWeather = async () => {
      try {
      const resWeather = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=pt_br&appid=${apiKey}`
      );
      setWeather(resWeather.data);
      setError(null);

        const resForecast = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&lang=pt_br&appid=${apiKey}`
        );
        setForecast(resForecast.data);

        const {lat, lon} = resWeather.data.coord;
        await fetchAirQuality(lat, lon);

      } catch (err) {
        setWeather(null);
        setForecast(null);
        setAirQuality(null);
        setError('Cidade não encontrada.');
      }
      
    

  };

  return (
    <div>
      <h2>Previsão do Tempo</h2>
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Digite uma cidade"
      />
      <button onClick={fetchWeather}>Buscar</button>

      {error && <p>{error}</p>}
      {weather && (
        <div>
          <h3>{weather.name}, {weather.sys.country}</h3>
          <p>{weather.weather[0].description}</p>
          <p>🌡️ {weather.main.temp} °C</p>
          <p>💧 Umidade: {weather.main.humidity}%</p>
          <p>🌬️ Vento: {weather.wind.speed} km/h</p>
          <img
            src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="Ícone do clima"
          />
        </div>
      )}

      {forecast && (
        <div>
          <h3>Previsão para 5 dias</h3>
          <div style={{ display: 'flex', overflowX: 'auto' }}>
            {forecast.list
              .filter((item, index) => index % 8 === 0)
              .map((item) => (
                <div key={item.dt} style={{ margin: '0 10px', textAlign: 'center' }}>
                  <p>{new Date(item.dt_txt).toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'numeric' })}</p>
                  <img
                    src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                    alt={item.weather[0].description}
                  />
                  <p>{item.weather[0].description}</p>
                  <p>🌡️ {item.main.temp.toFixed(1)} °C</p>
                </div>
              ))}
          </div>
        </div>
      )}

     {airQuality && (
      <div>
        <h3>Qualidade do Ar</h3>
        <p>
          Índice de Qualidade do Ar (AQI): {airQuality.list[0].main.aqi} {' '}
          {airQuality.list[0].main.aqi === 1 && '(Bom)'}
          {airQuality.list[0].main.aqi === 2 && '(Moderado)'}
          {airQuality.list[0].main.aqi === 3 && '(Ruim)'}
          {airQuality.list[0].main.aqi === 4 && '(Muito Ruim)'}
          {airQuality.list[0].main.aqi === 5 && '(Péssimo)'}
        </p>
        <p>CO: {airQuality.list[0].components.co} μg/m³</p>
        <p>NO: {airQuality.list[0].components.no} μg/m³</p>
        <p>NO₂: {airQuality.list[0].components.no2} μg/m³</p>
        <p>O₃: {airQuality.list[0].components.o3} μg/m³</p>
        <p>SO₂: {airQuality.list[0].components.so2} μg/m³</p>
        <p>PM2.5: {airQuality.list[0].components.pm2_5} μg/m³</p>
        <p>PM10: {airQuality.list[0].components.pm10} μg/m³</p>
        <p>NH₃: {airQuality.list[0].components.nh3} μg/m³</p>
      </div>

    )}
    
    </div>
  );
};

export default Weather;
