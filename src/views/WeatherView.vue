<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

// Key lives in .env so it never reaches GitHub
const apikey = import.meta.env.VITE_OPENWEATHER_API_KEY

const city = ref('')
const weatherData = ref(null)
const error = ref(null)

// units=metric gives Celsius directly
const temperature = computed(() =>
  weatherData.value ? Math.round(weatherData.value.main.temp) : null
)

const iconUrl = computed(() =>
  weatherData.value
    ? `https://openweathermap.org/img/wn/${weatherData.value.weather[0].icon}@2x.png`
    : null
)

const fetchWeatherData = async (url) => {
  error.value = null
  try {
    const response = await axios.get(url)
    weatherData.value = response.data
    console.log('Weather data:', response.data)
  } catch (e) {
    weatherData.value = null
    error.value =
      e.response?.status === 401 ? 'API key not active yet (can take up to 2 hours).'
      : e.response?.status === 404 ? 'City not found. Try a format like "Clayton, AU".'
      : 'Could not fetch weather data.'
    console.error('Error fetching weather data:', e)
  }
}

// 10.1 – weather for the user's current location
const fetchCurrentLocationWeather = () => {
  if (!navigator.geolocation) {
    error.value = 'Geolocation is not supported by this browser.'
    return
  }
  navigator.geolocation.getCurrentPosition(
    ({ coords }) => {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.latitude}&lon=${coords.longitude}&units=metric&appid=${apikey}`
      fetchWeatherData(url)
    },
    () => (error.value = 'Location permission denied. Search by city instead.')
  )
}

// 10.2 – weather by city name, e.g. "Clayton, AU"
const searchByCity = () => {
  if (!city.value.trim()) return
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city.value.trim())}&units=metric&appid=${apikey}`
  fetchWeatherData(url)
}

onMounted(fetchCurrentLocationWeather)
</script>

<template>
  <div class="container mt-4 text-center">
    <h1>WEATHER APP</h1>

    <div class="d-flex justify-content-center gap-2 my-3">
      <input
        v-model="city"
        type="text"
        class="form-control"
        style="max-width: 280px"
        placeholder="Enter city name (e.g. Clayton, AU)"
        @keyup.enter="searchByCity"
      />
      <button class="btn btn-primary" @click="searchByCity">Search</button>
      <button class="btn btn-outline-secondary" @click="fetchCurrentLocationWeather">My Location</button>
    </div>

    <main>
      <div v-if="weatherData">
        <h2>{{ weatherData.name }}, {{ weatherData.sys.country }}</h2>
        <div>
          <img :src="iconUrl" alt="Weather Icon" />
          <p class="fs-3">{{ temperature }} °C</p>
        </div>
        <span class="text-capitalize">{{ weatherData.weather[0].description }}</span>
      </div>
      <p v-if="error" class="text-danger">{{ error }}</p>
    </main>
  </div>
</template>