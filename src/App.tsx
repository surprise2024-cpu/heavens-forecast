import { useState } from 'react'
import './App.css'
import { WeatherDashboard } from './components/WeatherDashboard/WeatherDashboard'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div id='app-cont'>
      <div className='scrollable'>
        <WeatherDashboard />
      </div>
    </div>
  )
}

export default App
