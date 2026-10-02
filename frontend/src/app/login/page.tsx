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
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // FastAPI OAuth2 expects form data with 'username' field
      const formBody = new URLSearchParams();
      formBody.append('username', formData.email);
      formBody.append('password', formData.password);

      const response = await api.post('/auth/login', formBody, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      // Store token
      localStorage.setItem('token', response.data.access_token);

      // Redirect to dashboard
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
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px'
    }}>
      <div style={{
        width: '480px',
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)',
          padding: '40px',
          textAlign: 'center'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'white',
            borderRadius: '50%',
            margin: '0 auto 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
          }}>
            <svg width="48" height="48" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#1e40af"/>
              <path d="M16 8L24 20H8L16 8Z" fill="white"/>
            </svg>
          </div>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: 'white',
            marginBottom: '8px'
          }}>
            SmartBursary
          </h1>
          <p style={{
            fontSize: '16px',
            color: 'rgba(255, 255, 255, 0.9)'
          }}>
            Sign in to your account
          </p>
        </div>

        {/* Form */}
        <div style={{ padding: '40px' }}>
          {error && (
            <div className="alert alert-error" style={{ marginBottom: '24px' }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">
                Email Address
                <span className="required">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="john.doe@example.com"
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Password
                <span className="required">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your password"
                required
                autoComplete="current-password"
              />
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '24px'
            }}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                color: 'var(--gray-700)',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  style={{
                    width: '18px',
                    height: '18px',
                    cursor: 'pointer'
                  }}
                />
                Remember me
              </label>
              <a
                href="#"
                style={{
                  fontSize: '14px',
                  color: 'var(--primary-blue)',
                  textDecoration: 'none',
                  fontWeight: '500'
                }}
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px' }}
            >
              {loading ? (
                <>
                  <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div style={{
            marginTop: '32px',
            paddingTop: '32px',
            borderTop: '1px solid var(--gray-200)',
            textAlign: 'center'
          }}>
            <p style={{
              fontSize: '14px',
              color: 'var(--gray-600)',
              marginBottom: '16px'
            }}>
              Don't have an account?
            </p>
            <button
              onClick={() => router.push('/register')}
              className="btn btn-secondary"
              style={{ width: '100%' }}
            >
              Create New Account
            </button>
          </div>

          {/* Demo Credentials */}
          <div style={{
            marginTop: '24px',
            padding: '16px',
            background: 'var(--gray-50)',
            borderRadius: '8px',
            fontSize: '13px'
          }}>
            <p style={{
              fontWeight: '600',
              color: 'var(--gray-700)',
              marginBottom: '8px'
            }}>
              Demo Credentials:
            </p>
            <div style={{ color: 'var(--gray-600)', lineHeight: '1.6' }}>
              <strong>Applicant:</strong> john.doe@student.com / student123<br/>
              <strong>Admin:</strong> admin@smartbursary.com / admin123
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
