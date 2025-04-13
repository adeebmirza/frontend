import { useState, useEffect } from 'react'
import './App.css'
import NewsPage from './NewsPage.jsx'
import SearchPage from "../Routes/SearchPage"
import Header from '../components/Header'

function Landing() {
  const [scrolled, setScrolled] = useState(false)
  const [showNews, setShowNews] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [currentTime, setCurrentTime] = useState('')

  useEffect(() => {
    const timer = setInterval(() => {
      const options = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }
      setCurrentTime(new Date().toLocaleTimeString('en-IN', options))
    }, 1000)

    const handleScroll = () => {
      if (window.scrollY > 100 && !scrolled) {
        setScrolled(true)
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      clearInterval(timer)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    if (scrolled) {
      const delay = setTimeout(() => {
        setShowNews(true)
      }, 500)
      return () => clearTimeout(delay)
    }
  }, [scrolled])

  return (
    <>
      {/* Background */}
      <div
        className="fixed top-0 left-0 w-full h-full bg-cover bg-center z-0"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1501854140801-50d01698950b')"
        }}
      />

      {/* Add Header */}
      <Header />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen text-white pt-16">
        <div className="flex flex-col items-center justify-center h-screen relative">
          <div className="absolute top-10 right-10 text-white text-6xl font-bold shadow-md">
            {currentTime}
          </div>
          <div className="absolute bottom-20 w-full max-w-md px-4">
            <input
              type="text"
              onFocus={() => setShowSearch(true)} // 👈 Trigger search popout
              className="w-full p-4 rounded-lg border border-gray-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
              placeholder="Search the web privately"
            />
          </div>
        </div>

        {/* Spacer for scroll trigger */}
        <div style={{ height: '150vh' }}></div>

        {/* News Page appears on scroll */}
        {showNews && (
          <div className="fade-in-up">
            <NewsPage />
          </div>
        )}

        {/* SearchPage Popout Overlay */}
        {showSearch && (
          <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-start pt-20">
            <div className="bg-white w-full max-w-3xl rounded-lg shadow-lg p-6 relative">
              <button
                className="absolute top-4 right-4 text-gray-600 hover:text-red-500 text-2xl font-bold"
                onClick={() => setShowSearch(false)}
              >
                &times;
              </button>
              <SearchPage />
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default Landing
