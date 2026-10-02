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
    <div className="flex-center" style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <div className="card" style={{ width: '450px', maxWidth: '90%' }}>
        <div className="card-header text-center">
          <h1 className="card-title" style={{ fontSize: '28px', marginBottom: '10px' }}>SmartBursary</h1>
          <p style={{ color: '#999', fontSize: '14px' }}>Sign in to your account</p>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              placeholder="john.doe@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="form-group">
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>

          <div className="text-center mt-2">
            <p style={{ fontSize: '14px', color: '#666' }}>
              Don't have an account?{' '}
              <button 
                type="button"
                onClick={() => router.push('/register')}
                className="btn-link"
              >
                Register here
              </button>
            </p>
          </div>
        </form>

        <div className="mt-3" style={{ padding: '15px', background: '#f8f9fa', borderRadius: '4px', fontSize: '13px' }}>
          <strong>Demo Accounts:</strong><br />
          <span style={{ color: '#666' }}>
            Applicant: john.doe@student.com / student123<br />
            Admin: admin@smartbursary.com / admin123
          </span>
        </div>
      </div>
    </div>
  );
}
