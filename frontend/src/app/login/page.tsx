'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formBody = new URLSearchParams();
      formBody.append('username', formData.email);
      formBody.append('password', formData.password);

      const response = await api.post('/auth/login', formBody, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      localStorage.setItem('token', response.data.access_token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div>
      {/* Top Header */}
      <div className="top-header">
        <div className="top-header-content">
          <div className="logo-group">
            <svg width="50" height="50" viewBox="0 0 50 50" fill="white">
              <rect width="50" height="50" rx="8" fill="white" fillOpacity="0.2"/>
              <path d="M25 15L35 30H15L25 15Z" fill="white"/>
              <text x="25" y="42" fontSize="10" fill="white" textAnchor="middle" fontWeight="bold">SB</text>
            </svg>
          </div>
          <div>
            <div className="header-title">SMARTBURSARY MANAGEMENT PORTAL</div>
            <div className="header-subtitle">Fostering Equity In Access to Education</div>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="nav-bar">
        <div className="nav-content">
          <a href="/" className="nav-item active">
            <span>🏠</span> Back to Main Website
          </a>
          <a href="/login" className="nav-item">
            <span>👤</span> Account Login
          </a>
          <a href="/register" className="nav-item">
            <span>📝</span> User Registration
          </a>
          <a href="#" className="nav-item">
            <span>📖</span> Application Guide
          </a>
          <a href="#" className="nav-item">
            <span>📄</span> Documents
          </a>
          <a href="#" className="nav-item">
            <span>❓</span> HELP & Support
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-container">
        <div className="login-container">
          <div className="login-header">
            <div className="login-logo">
              <svg width="80" height="80" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="38" fill="#f5f5f5" stroke="#ddd" strokeWidth="2"/>
                <path d="M40 20L55 45H25L40 20Z" fill="#7e57c2"/>
                <text x="40" y="65" fontSize="12" fill="#333" textAnchor="middle" fontWeight="bold">SmartBursary</text>
              </svg>
            </div>
            <h2 className="login-title">Sign In to your Account</h2>
          </div>

          <div className="login-body">
            <div className="register-link">
              Register if you don't have an account by <a href="#" onClick={(e) => { e.preventDefault(); router.push('/register'); }}>Clicking Here &gt;&gt;</a>
            </div>

            <div className="info-box">
              Login with your email or ID number and password below
            </div>

            {error && (
              <div className="alert alert-error">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <div className="input-wrapper">
                  <span className="input-icon">👤</span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input input-with-icon"
                    placeholder="Email or ID Number"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="form-input input-with-icon"
                    style={{ paddingRight: '45px' }}
                    placeholder="Password"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div className="checkbox-group" style={{ margin: 0 }}>
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label htmlFor="remember">Remember Me</label>
                </div>
                <a href="#" className="forgot-password">Forget Password?</a>
              </div>

              <button type="submit" className="btn btn-login" disabled={loading}>
                {loading ? (
                  <>
                    <div className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }}></div>
                    Signing In...
                  </>
                ) : (
                  <>
                    🔓 Login
                  </>
                )}
              </button>

              <div className="divider">
                <span>Don't Have An Account?</span>
              </div>

              <button 
                type="button" 
                className="btn btn-register"
                onClick={() => router.push('/register')}
              >
                👤 Register
              </button>
            </form>

            <div className="demo-box">
              <strong>Demo Credentials:</strong>
              <div className="demo-account">
                <div>📧 Applicant: <strong>john.doe@student.com</strong> / <strong>student123</strong></div>
                <div>📧 Admin: <strong>admin@smartbursary.com</strong> / <strong>admin123</strong></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="footer">
        <p>&copy; 2026 SmartBursary Management System. All rights reserved.</p>
      </div>
    </div>
  );
}
