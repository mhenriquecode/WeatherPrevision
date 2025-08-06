// src/components/Weather.js
import React, { useState } from 'react';
import axios from 'axios';
import { Container, Form, Button, Card, Row, Col, Alert } from 'react-bootstrap';

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

      const { lat, lon } = resWeather.data.coord;
      await fetchAirQuality(lat, lon);
    } catch (err) {
      setWeather(null);
      setForecast(null);
      setAirQuality(null);
      setError('Cidade não encontrada.');
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="mb-4 text-center">Previsão do Tempo</h2>

      <Form className="mb-4">
        <Form.Group controlId="cityInput">
          <Form.Control
            type="text"
            value={city}
            placeholder="Digite uma cidade"
            onChange={(e) => setCity(e.target.value)}
          />
        </Form.Group>
        <Button className="mt-2 w-100" onClick={fetchWeather}>Buscar</Button>
      </Form>

      {error && <Alert variant="danger">{error}</Alert>}

      {weather && (
        <Card className="mb-4">
          <Card.Body>
            <Card.Title>{weather.name}, {weather.sys.country}</Card.Title>
            <Card.Text className="text-capitalize">{weather.weather[0].description}</Card.Text>
            <Row className="mb-3">
              <Col>🌡️ {weather.main.temp} °C</Col>
              <Col>💧 Umidade: {weather.main.humidity}%</Col>
              <Col>🌬️ Vento: {weather.wind.speed} km/h</Col>
            </Row>
            <img
              src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt="Ícone do clima"
            />
          </Card.Body>
        </Card>
      )}

      {forecast && (
        <>
          <h3 className="mb-3">Previsão para 5 dias</h3>
          <Row className="flex-nowrap overflow-auto mb-4">
            {forecast.list
              .filter((item, index) => index % 8 === 0)
              .map((item) => (
                <Col key={item.dt} xs={6} sm={4} md={3} lg={2} className="mb-3">
                  <Card className="text-center">
                    <Card.Body>
                      <Card.Title>
                        {new Date(item.dt_txt).toLocaleDateString('pt-BR', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'numeric'
                        })}
                      </Card.Title>
                      <Card.Img
                        variant="top"
                        src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                        alt={item.weather[0].description}
                      />
                      <Card.Text className="text-capitalize">{item.weather[0].description}</Card.Text>
                      <Card.Text>🌡️ {item.main.temp.toFixed(1)} °C</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
          </Row>
        </>
      )}

      {airQuality && (
        <Card>
          <Card.Body>
            <Card.Title>Qualidade do Ar</Card.Title>
            <Card.Text>
              AQI: {airQuality.list[0].main.aqi} {' '}
              {['(Bom)', '(Moderado)', '(Ruim)', '(Muito Ruim)', '(Péssimo)'][airQuality.list[0].main.aqi - 1]}
            </Card.Text>
            <Row>
              {Object.entries(airQuality.list[0].components).map(([key, value]) => (
                <Col xs={6} md={4} key={key}>
                  <p><strong>{key.toUpperCase()}:</strong> {value} μg/m³</p>
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default Weather;
