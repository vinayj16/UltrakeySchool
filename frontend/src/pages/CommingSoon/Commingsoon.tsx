import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { apiClient } from '../../api/client'

const Commingsoon: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [targetDate, setTargetDate] = useState<Date | null>(null)

  // Fetch launch date from backend
  useEffect(() => {
    const fetchLaunchDate = async () => {
      try {
        const response = await apiClient.get('/settings/launch-date')
        if (response.data.success && response.data.data?.launchDate) {
          setTargetDate(new Date(response.data.data.launchDate))
        } else {
          // Default to 60 days from now if no launch date set
          const defaultDate = new Date()
          defaultDate.setDate(defaultDate.getDate() + 60)
          setTargetDate(defaultDate)
        }
      } catch (error) {
        console.error('Error fetching launch date:', error)
        // Default to 60 days from now on error
        const defaultDate = new Date()
        defaultDate.setDate(defaultDate.getDate() + 60)
        setTargetDate(defaultDate)
      }
    }

    fetchLaunchDate()
  }, [])

  // Countdown timer
  useEffect(() => {
    if (!targetDate) return

    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const target = targetDate.getTime()
      const difference = target - now

      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 }
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      return { days, hours, minutes, seconds }
    }

    // Initial calculation
    setTimeLeft(calculateTimeLeft())

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      toast.error('Please enter your email address')
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address')
      return
    }

    setLoading(true)

    try {
      const response = await apiClient.post('/subscriptions/coming-soon', { email })

      if (response.data.success) {
        toast.success('Thank you for subscribing! We will notify you when we launch.')
        setEmail('')
      } else {
        throw new Error(response.data.message || 'Subscription failed')
      }
    } catch (error: any) {
      console.error('Subscription error:', error)
      
      if (error.response?.data?.error?.message) {
        toast.error(error.response.data.error.message)
      } else {
        toast.error(error.message || 'Failed to subscribe. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="main-wrapper">
      <div className="text-center mt-4">
        <img src="/assets/img/logo.png" alt="img" className="img-fluid" />
      </div>
      <div className="comming-soon-pg w-100">
        <div>
          <div className="error-img m-auto">
            <img src="/assets/img/authentication/coming-soon.svg" className="img-fluid" alt="Img" />
          </div>
          <ul className="d-inline-flex align-items-center justify-content-center mb-3">
            <li className="me-sm-3 me-2">
              <div className="d-flex align-items-center justify-content-center flex-column border rounded bg-white px-sm-4 py-sm-3 p-2">
                <h3 className="days fs-sm-30 fs-30">{timeLeft.days}</h3>
                <p className="fs-16">Day</p>
              </div>
            </li>
            <li className="text-gray fw-medium me-sm-3 me-2">:</li>
            <li className="me-sm-3 me-2">
              <div className="d-flex align-items-center justify-content-center flex-column border rounded bg-white px-sm-4 py-sm-3 p-2">
                <h3 className="hours fs-sm-30 fs-30">{timeLeft.hours}</h3>
                <p className="fs-16">Hrs</p>
              </div>
            </li>
            <li className="text-gray fw-medium me-sm-3 me-2">:</li>
            <li className="me-sm-3 me-2">
              <div className="d-flex align-items-center justify-content-center flex-column border rounded bg-white px-sm-4 py-sm-3 p-2">
                <h3 className="minutes fs-sm-30 fs-30">{timeLeft.minutes}</h3>
                <p className="fs-16">Min</p>
              </div>
            </li>
            <li className="text-gray fw-medium me-sm-3 me-2">:</li>
            <li>
              <div className="d-flex align-items-center justify-content-center flex-column border rounded bg-white px-sm-4 py-sm-3 p-2">
                <h3 className="seconds fs-sm-30 fs-30">{timeLeft.seconds}</h3>
                <p className="fs-16">Sec</p>
              </div>
            </li>
          </ul>
          <div className="subscribe-form">
            <form onSubmit={handleSubscribe}>
              <div className="mb-3 position-relative">
                <label className="d-flex form-label">Subscribe to get notified!</label>
                <div className="bg-white border border-2 p-1 d-flex align-items-center rounded ps-0">
                  <input 
                    type="email" 
                    className="form-control border-0" 
                    placeholder="Enter Your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                  />
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading}
                    style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
                  >
                    {loading ? (
                      <>
                        <i className="ti ti-loader" style={{ marginRight: 4, animation: 'spin 1s linear infinite' }}></i>
                        Subscribing...
                      </>
                    ) : (
                      'Subscribe'
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
          <div className="d-flex flex-wrap justify-content-center align-items-center">
            <a href="#" className="btn btn-dark btn-icon btn-sm me-2"><i className="ti ti-brand-facebook fs-16"></i></a>
            <a href="#" className="btn btn-dark btn-icon btn-sm me-2"><i className="ti ti-brand-instagram fs-16"></i></a>
            <a href="#" className="btn btn-dark btn-icon btn-sm me-2"><i className="ti ti-brand-twitter fs-16"></i></a>
            <a href="#" className="btn btn-dark btn-icon btn-sm me-2"><i className="ti ti-brand-pinterest fs-16"></i></a>
            <a href="#" className="btn btn-dark btn-icon btn-sm"><i className="ti ti-brand-linkedin fs-16"></i></a>
          </div>
        </div>
      </div>
      <div className="text-center mb-5">
        <p>Copyright &copy; 2026 - Ultrakey</p>
      </div>
    </div>
  )
}

export default Commingsoon
