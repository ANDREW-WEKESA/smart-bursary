'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await api.get('/auth/me');
        setUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) return null;

  const isApplicant = user.role === 'APPLICANT';
  const isStaff = !isApplicant;

  return (
    <div>
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <a href="/dashboard" className="logo">SmartBursary</a>
            <nav>
              <ul className="nav-menu">
                <li><a href="/dashboard" className="nav-link active">Dashboard</a></li>
                {isApplicant && (
                  <>
                    <li><a href="/profile" className="nav-link">Profile</a></li>
                    <li><a href="/bursaries" className="nav-link">Bursaries</a></li>
                    <li><a href="/applications" className="nav-link">Applications</a></li>
                    <li><a href="/settings" className="nav-link">Settings</a></li>
                  </>
                )}
                <li><button onClick={handleLogout} className="btn-link">Logout</button></li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="container">
          <div className="card">
            <div className="card-header">
              <h1 className="card-title">Welcome, {user.full_name}</h1>
              <p style={{ color: '#666', marginTop: '5px' }}>
                {isApplicant ? 'Applicant Dashboard' : 'Staff Dashboard'}
              </p>
            </div>

            {/* Tabs */}
            <div className="tabs">
              <button className="tab active">Overview</button>
              {isApplicant && (
                <>
                  <button className="tab" onClick={() => router.push('/applications')}>
                    My Applications
                  </button>
                  <button className="tab" onClick={() => router.push('/bursaries')}>
                    Available Bursaries
                  </button>
                </>
              )}
              {isStaff && (
                <>
                  <button className="tab">Applications</button>
                  <button className="tab">Reports</button>
                </>
              )}
            </div>

            {/* Stats Grid */}
            {isApplicant && (
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-label">Total Applications</div>
                  <div className="stat-value">0</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Pending Review</div>
                  <div className="stat-value">0</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Approved</div>
                  <div className="stat-value">0</div>
                </div>
                <div className="stat-card">
                  <div className="stat-label">Total Awarded</div>
                  <div className="stat-value">KES 0</div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            {isApplicant && (
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>Quick Actions</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                  <button 
                    onClick={() => router.push('/profile')}
                    className="btn btn-primary"
                    style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}
                  >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span>Complete Profile</span>
                  </button>

                  <button 
                    onClick={() => router.push('/bursaries')}
                    className="btn btn-success"
                    style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}
                  >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                    </svg>
                    <span>Browse Bursaries</span>
                  </button>

                  <button 
                    onClick={() => router.push('/applications')}
                    className="btn btn-secondary"
                    style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}
                  >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                    <span>My Applications</span>
                  </button>
                </div>
              </div>
            )}

            {/* Staff Content */}
            {isStaff && (
              <div className="text-center mt-4">
                <p style={{ fontSize: '16px', color: '#666' }}>
                  Staff dashboard features coming soon...
                </p>
              </div>
            )}
          </div>

          {/* Note */}
          <div className="alert alert-info mt-3">
            <strong>Note:</strong> AI shows indicators only; the committee makes every award decision. Sample data.
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p className="footer-text">&copy; 2026 SmartBursary. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
