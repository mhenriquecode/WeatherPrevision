// src/components/Weather.js
import React, { useState } from 'react';
import axios from 'axios';
console.log('API KEY:', process.env.REACT_APP_WEATHER_API_KEY);

const Weather = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);

  const [error, setError] = useState(null);

  const apiKey = process.env.REACT_APP_WEATHER_API_KEY;


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

      } catch (err) {
        setWeather(null);
        setForecast(null);
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

    </div>
  );
};

export default Weather;
