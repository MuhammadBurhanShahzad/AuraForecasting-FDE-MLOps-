import React, { useState } from 'react'
import LandingPage from './LandingPage'
import Dashboard from './Dashboard'

function App() {
  const [view, setView] = useState('landing')
  const [selectedIndustry, setSelectedIndustry] = useState('retail')

  const handleStart = (industry) => {
    setSelectedIndustry(industry)
    setView('dashboard')
  }

  const handleBack = () => {
    setView('landing')
  }

  return (
    <div className="aura-app">
      {view === 'landing' ? (
        <LandingPage onStart={handleStart} />
      ) : (
        <Dashboard 
          defaultIndustry={selectedIndustry} 
          onBackToHome={handleBack} 
        />
      )}
    </div>
  )
}

export default App
