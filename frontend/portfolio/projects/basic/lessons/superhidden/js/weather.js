const apiKey = "001bd120c306c43d7b2d54f355a5db89";
const CITY = "Höganäs";

(async function initWeather() {
  try {
    const data = await getWeatherData(CITY);
    updateWeatherWidget(data);
  } catch (e) {
    console.warn("Could not load weather:", e);
  }
})();

async function getWeatherData(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Could not fetch weather data");
  return res.json();
}

function updateWeatherWidget(data) {
  const { name: city, main: { temp }, weather: [{ description, id }] } = data;
  const iconName = getWeatherImageName(id);
  const widget = document.querySelector(".weather-widget");
  if (!widget) return;
  const img = widget.querySelector(".weather-widget__icon");
  const tempEl = widget.querySelector(".weather-widget__temp");
  const cityEl = widget.querySelector(".weather-widget__city");
  if (img) {
    img.src = `assets/weathericons/${iconName}.png`;
    img.alt = description;
    img.hidden = false;
  }
  if (tempEl) tempEl.textContent = `${temp.toFixed(1)}°C`;
  if (cityEl) cityEl.textContent = city;
  widget.classList.add("weather-widget--active");
}

function getWeatherImageName(weatherId) {
  if (weatherId >= 200 && weatherId < 300) return "thunderstorm";
  if (weatherId >= 300 && weatherId < 400) return "showerrain";
  if (weatherId >= 500 && weatherId < 600) return weatherId >= 520 ? "showerrain" : "rain";
  if (weatherId >= 600 && weatherId < 700) return "snow";
  if (weatherId >= 700 && weatherId < 800) return "mist";
  if (weatherId === 800) return "clearsky";
  if (weatherId === 801) return "fewclouds";
  if (weatherId === 802) return "scatteredclouds";
  if (weatherId >= 803 && weatherId < 810) return "brokenclouds";
  return "clearsky";
}
