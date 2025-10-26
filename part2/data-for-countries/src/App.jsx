import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

const CountryDetails = ({ country }) => {
  const [weather, setWeather] = useState(null)
  const [weatherError, setWeatherError] = useState(null)
  const [weatherLoading, setWeatherLoading] = useState(false)

  const capitalNames = Array.isArray(country.capital)
    ? country.capital
    : country.capital
      ? [country.capital]
      : []
  const capitalDisplay = capitalNames.length ? capitalNames.join(', ') : '—'
  const primaryCapital = capitalNames[0] || country.name.common
  const [lat, lon] = country.capitalInfo?.latlng ?? country.latlng ?? []

  useEffect(() => {
    let cancelled = false
    const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY

    const fetchWeather = async () => {
      setWeather(null)
      setWeatherError(null)
      setWeatherLoading(false)

      if (!apiKey) {
        setWeatherError('Weather service not configured (missing API key)')
        return
      }

      if (typeof lat !== 'number' || typeof lon !== 'number') {
        setWeatherError('No coordinates available for weather data')
        return
      }

      try {
        setWeatherLoading(true)
        const response = await axios.get(
          'https://api.openweathermap.org/data/2.5/weather',
          {
            params: {
              lat,
              lon,
              units: 'metric',
              appid: apiKey,
            },
          }
        )

        if (!cancelled) {
          setWeather(response.data)
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Failed to fetch weather', err)
          const message =
            err.response?.data?.message || err.message || 'Failed to load weather data'
          setWeatherError(`Failed to load weather data: ${message}`)
        }
      } finally {
        if (!cancelled) {
          setWeatherLoading(false)
        }
      }
    }

    fetchWeather()

    return () => {
      cancelled = true
    }
  }, [country.cca3, lat, lon])

  const languages = country.languages ? Object.values(country.languages) : []
  const flagSrc = country.flags?.png || country.flags?.svg
  const flagAlt = country.flags?.alt || `Flag of ${country.name.common}`

  const weatherIcon = weather?.weather?.[0]?.icon
  const weatherDescription = weather?.weather?.[0]?.description
  const temperature = weather?.main?.temp
  const windSpeed = weather?.wind?.speed

  return (
    <div className="country-details">
      <h2>{country.name.common}</h2>
      <div>capital {capitalDisplay}</div>
      <div>area {country.area ?? '—'}</div>

      <h3>languages:</h3>
      <ul>
        {languages.map((lang) => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>

      {flagSrc && (
        <img
          className="country-flag"
          src={flagSrc}
          alt={flagAlt}
        />
      )}

      <h3>Weather in {primaryCapital}</h3>
      {weatherLoading && <div>Loading weather…</div>}
      {weatherError && <div className="error">{weatherError}</div>}
      {!weatherLoading && !weatherError && weather && (
        <div className="weather">
          {typeof temperature === 'number' && (
            <div>temperature {temperature.toFixed(1)} °C</div>
          )}
          {weatherIcon && (
            <div className="weather-overview">
              <img
                src={`https://openweathermap.org/img/wn/${weatherIcon}@2x.png`}
                alt={weatherDescription || 'Weather icon'}
              />
              {weatherDescription && (
                <div className="weather-description">{weatherDescription}</div>
              )}
            </div>
          )}
          {typeof windSpeed === 'number' && (
            <div>wind {windSpeed.toFixed(1)} m/s</div>
          )}
        </div>
      )}
    </div>
  )
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await axios.get(
          'https://studies.cs.helsinki.fi/restcountries/api/all'
        )
        setCountries(res.data)
      } catch (err) {
        console.error('Failed to fetch countries', err)
        setError('Failed to load countries')
      } finally {
        setLoading(false)
      }
    }

    fetchCountries()
  }, [])

  const handleFilterChange = (e) => setFilter(e.target.value)

  const filtered = countries.filter((c) =>
    c.name?.common?.toLowerCase().includes(filter.toLowerCase())
  )

  const renderResults = () => {
    if (!filter) return <div>Type to search countries</div>
    if (filtered.length > 10)
      return <div>Too many matches, specify another filter</div>
    if (filtered.length > 1)
      return (
        <div>
          {filtered.map((c) => (
            <div key={c.cca3}>
              {c.name.common}{' '}
              <button type="button" onClick={() => setFilter(c.name.common)}>
                show
              </button>
            </div>
          ))}
        </div>
      )
    if (filtered.length === 1) {
      return <CountryDetails country={filtered[0]} />
    }
    return <div>No matches</div>
  }

  return (
    <div>
      <div>
        find countries <input value={filter} onChange={handleFilterChange} />
      </div>
      {loading && <div>Loading…</div>}
      {error && <div className="error">{error}</div>}
      {!loading && !error && renderResults()}
    </div>
  )
}

export default App
