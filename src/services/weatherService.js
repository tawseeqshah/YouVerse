import axios from 'axios';

const VISUAL_CROSSING_API_KEY = 'NAJZZ686RFTEJVHCDH6UHHCLB';
const VISUAL_CROSSING_URL = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline';

export const fetchWeather = async (latitude, longitude) => {
  try {
    console.log('Fetching weather for coordinates:', { latitude, longitude });
    
    const response = await axios.get(`${VISUAL_CROSSING_URL}/${latitude},${longitude}`, {
      params: {
        unitGroup: 'metric',
        include: 'days,hours,alerts,current,events',
        key: VISUAL_CROSSING_API_KEY,
        contentType: 'json'
      }
    });

    const data = response.data;
    console.log('Weather data received:', data);

    // Format current weather data using the first hour of the day
    const currentHour = data.days[0].hours[new Date().getHours()];
    const current = {
      temperature: Math.round(currentHour.temp),
      feelsLike: Math.round(currentHour.feelslike),
      precipitation: Math.round(currentHour.precipprob || 0),
      cloudCover: currentHour.cloudcover,
      windSpeed: Math.round(currentHour.windspeed),
      uvIndex: Math.round(currentHour.uvindex),
      isDay: currentHour.icon.includes('day'),
      humidity: currentHour.humidity,
      conditions: currentHour.conditions,
      icon: currentHour.icon
    };

    // Format daily data
    const daily = {
      sunrise: data.days[0].sunrise,
      sunset: data.days[0].sunset,
      daylightDuration: data.days[0].sunhours,
      maxUvIndex: data.days[0].uvindex,
      precipitationProbability: data.days[0].precipprob,
      description: data.days[0].description,
      icon: data.days[0].icon,
      tempMax: Math.round(data.days[0].tempmax),
      tempMin: Math.round(data.days[0].tempmin)
    };

    // Format hourly forecast (next 24 hours)
    const currentHourIndex = new Date().getHours();
    const hourlyForecast = data.days[0].hours
      .slice(currentHourIndex)
      .concat(data.days[1]?.hours.slice(0, currentHourIndex) || [])
      .slice(0, 24)
      .map(hour => ({
        time: new Date(hour.datetimeEpoch * 1000).getHours() + ':00',
        temperature: Math.round(hour.temp),
        feelsLike: Math.round(hour.feelslike),
        precipitation: Math.round(hour.precipprob || 0),
        cloudCover: hour.cloudcover,
        uvIndex: Math.round(hour.uvindex),
        isDay: hour.icon.includes('day'),
        conditions: hour.conditions,
        icon: hour.icon,
        humidity: hour.humidity,
        windSpeed: Math.round(hour.windspeed)
      }));

    return {
      current,
      daily,
      hourlyForecast,
      alerts: data.alerts || [],
      description: data.description
    };
  } catch (error) {
    console.error('Error fetching weather:', error);
    if (error.response) {
      console.error('API Response:', error.response.data);
      throw new Error(`Weather API error: ${error.response.data.message || 'Unknown error'}`);
    }
    throw error;
  }
}; 