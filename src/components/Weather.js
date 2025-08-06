// src/components/Weather.js
import React, { useState } from 'react';
import axios from 'axios';

const Weather = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  const apiKey = '--------------';

  const fetchWeather = async () => {
    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=pt_br&appid=${apiKey}`
      );
      setWeather(res.data);
      setError(null);
    } catch (err) {
      setWeather(null);
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
    </div>
  );
};

export default Weather;
