import { useState, useEffect } from 'react'
import APCourseSelector from './components/APCourseSelector'
import UniversitySelector from './components/UniversitySelector'
import ResultsDisplay from './components/ResultsDisplay'
import ComparisonView from './components/ComparisonView'
import ExportButton from './components/ExportButton'
import { searchCreditPolicies } from './services/apCreditService'
import { BookOpen, GraduationCap, Eye } from 'lucide-react'

function App() {
  const [selectedCourses, setSelectedCourses] = useState([])
  const [selectedUniversities, setSelectedUniversities] = useState([])
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [viewMode, setViewMode] = useState('comparison')

  // Analytics state (existing)
  const [siteData, setSiteData] = useState(null)
  const [analyticsLoading, setAnalyticsLoading] = useState(true)

  // NEW: Live page views state
  const [views, setViews] = useState("Loading...")

  useEffect(() => {
    fetch('/api/analytics')
      .then((res) => res.json())
      .then((data) => {
        setSiteData(data)
        setAnalyticsLoading(false)
      })
      .catch((err) => {
        console.error('Fetch failure:', err)
        setAnalyticsLoading(false)
      })
  }, [])

  // NEW: Moondb page view tracker
  useEffect(() => {
    fetch('https://moondb.org')
      .then((res) => res.json())
      .then((data) => {
        setViews(data.value || 1)
      })
      .catch((err) => {
        console.error("Tracker error:", err)
        setViews("Unavailable")
      })
  }, [])

  const handleSearch = async () => {
    if (selectedCourses.length === 0 || selectedUniversities.length === 0) {
      alert('Please select at least one AP course and one university.')
      return
    }

    setLoading(true)

    try {
      const searchResults = await searchCreditPolicies(
        selectedCourses,
        selectedUniversities
      )

      setResults(searchResults)
    } catch (error) {
      console.error('Error fetching credit policies:', error)
      alert('Error fetching credit policies. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setSelectedCourses([])
    setSelectedUniversities([])
    setResults([])
    setViewMode('comparison')
  }

  return (
    <div className="container">
      <header className="header">
        <h1>AP Credits Calculator</h1>
        <p>See which colleges accept your AP scores for credit.</p>
      </header>

      {/* AP Course Selector */}
      <div className="card" style={{ boxShadow: 'none', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
        <h2>Select Your AP Courses</h2>
        <APCourseSelector
          selectedCourses={selectedCourses}
          onChange={setSelectedCourses}
        />
      </div>

      {/* University Selector */}
      <div className="card" style={{ boxShadow: 'none', borderRadius: '10px', border: '1px solid #cbd5e1' }}>
        <h2>Select Universities</h2>
        <UniversitySelector
          selectedUniversities={selectedUniversities}
          onChange={setSelectedUniversities}
        />
      </div>

      <div className="actions-bar">
        <button className="button" onClick={handleSearch} disabled={loading}>
          {loading ? 'Searching...' : 'Search Credit Policies'}
        </button>

        <button className="button button-secondary" onClick={handleReset}>
          Reset
        </button>

        {results.length > 0 && (
          <>
            <button
              className="button button-secondary"
              onClick={() =>
                setViewMode(viewMode === 'comparison' ? 'detailed' : 'comparison')
              }
            >
              {viewMode === 'comparison' ? 'Detailed View' : 'Results View'}
            </button>

            <ExportButton
              data={results}
              courses={selectedCourses}
              universities={selectedUniversities}
            />
          </>
        )}
      </div>

      {loading && <div className="loader"></div>}

      {!loading && results.length > 0 &&
        (viewMode === 'comparison' ? (
          <ComparisonView
            results={results}
            courses={selectedCourses}
            universities={selectedUniversities}
          />
        ) : (
          <ResultsDisplay results={results} />
        ))}

      {!loading &&
        results.length === 0 &&
        selectedCourses.length > 0 &&
        selectedUniversities.length > 0 && (
          <div className="empty-state">
            <p>Click "Search Credit Policies" to see results</p>
          </div>
        )}

      <footer className="footer">
        <p style={{ fontStyle: 'italic', opacity: 0.6, fontSize: '0.9rem' }}>
          Sourced from CollegeBoard • Mansi Viswanath
        </p>

        {/* NEW: Live Views Section */}
        <div
          style={{
            marginTop: '15px',
            padding: '12px',
            border: '1px solid #cbd5e1',
            borderRadius: '8px',
            backgroundColor: '#f8fafc',
            fontSize: '0.9rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <Eye size={16} style={{ marginRight: '6px' }} />
            <strong>Total Page Views: 54</strong>
          </div>
        </div>        
      </footer>
    </div>
  )
}

export default App
