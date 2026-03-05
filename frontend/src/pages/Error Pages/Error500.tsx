import React from 'react'
import { Link } from 'react-router-dom'

const Error500: React.FC = () => {
  return (
    <div className="main-wrapper">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xxl-5 col-xl-5 col-md-6">
            <div className="d-flex flex-column justify-content-between vh-100">
              <div className="text-center p-4">
                <img src="/template/assets/img/logo.png" alt="img" className="img-fluid" />
              </div>
              <div className="d-flex flex-column align-items-center justify-content-center mb-4">
                <div className="mb-4">
                  <img src="/template/assets/img/authentication/error-500.svg" className="error-img img-fluid" alt="Img" />
                </div>
                <h3 className="h2 mb-3">Oops, something went wrong</h3>
                <p className="text-center">Server Error 500. We apologise and are fixing the problem.</p>
                <Link to="/" className="btn btn-primary d-flex align-items-center">
                  <i className="ti ti-arrow-left me-2"></i>Back to Dashboard
                </Link>
              </div>
              <div className="text-center p-4">
                <p>Copyright &copy; 2026 - Ultrakey</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Error500
