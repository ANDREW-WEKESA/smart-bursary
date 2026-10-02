'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Navigation from '@/components/Navigation';

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

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) return null;

  const isApplicant = user.role === 'APPLICANT';

  return (
    <>
      <Navigation />
      
      <div className="page-wrapper">
        <div className="container">
          <div className="page-header">
            <h1 className="page-title">Welcome back, {user.full_name}!</h1>
            <p className="page-subtitle">
              {isApplicant 
                ? 'Manage your bursary applications and track your progress' 
                : 'Manage bursary applications and awards'}
            </p>
          </div>

          {/* Stats Grid */}
          {isApplicant && (
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-label">Total Applications</div>
                <div className="stat-value">0</div>
                <div className="stat-change positive">Start your first application</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Pending Review</div>
                <div className="stat-value">0</div>
                <div className="stat-change">No pending applications</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Approved</div>
                <div className="stat-value">0</div>
                <div className="stat-change">No approved applications yet</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Total Awarded</div>
                <div className="stat-value">KES 0</div>
                <div className="stat-change">Total amount awarded</div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          {isApplicant && (
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Quick Actions</h2>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                <button 
                  onClick={() => router.push('/profile')}
                  className="btn btn-primary"
                  style={{ padding: '32px', flexDirection: 'column', height: 'auto' }}
                >
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span style={{ marginTop: '12px', fontSize: '16px' }}>Complete Profile</span>
                  <span style={{ marginTop: '4px', fontSize: '13px', opacity: 0.9 }}>
                    Update your personal information
                  </span>
                </button>

                <button 
                  onClick={() => router.push('/bursaries')}
                  className="btn btn-primary"
                  style={{ padding: '32px', flexDirection: 'column', height: 'auto' }}
                >
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                  <span style={{ marginTop: '12px', fontSize: '16px' }}>Browse Bursaries</span>
                  <span style={{ marginTop: '4px', fontSize: '13px', opacity: 0.9 }}>
                    View available opportunities
                  </span>
                </button>

                <button 
                  onClick={() => router.push('/applications')}
                  className="btn btn-primary"
                  style={{ padding: '32px', flexDirection: 'column', height: 'auto' }}
                >
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                  <span style={{ marginTop: '12px', fontSize: '16px' }}>My Applications</span>
                  <span style={{ marginTop: '4px', fontSize: '13px', opacity: 0.9 }}>
                    Track application status
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Getting Started */}
          {isApplicant && (
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Getting Started</h2>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '16px', background: 'var(--gray-50)', borderRadius: '8px' }}>
                  <div style={{ 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '50%', 
                    background: 'var(--primary-blue)', 
                    color: 'white', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontWeight: '600',
                    flexShrink: 0
                  }}>
                    1
                  </div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
                      Complete Your Profile
                    </h3>
                    <p style={{ fontSize: '14px', color: 'var(--gray-600)' }}>
                      Add your personal information, guardian details, and upload required documents
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '16px', background: 'var(--gray-50)', borderRadius: '8px' }}>
                  <div style={{ 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '50%', 
                    background: 'var(--primary-blue)', 
                    color: 'white', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontWeight: '600',
                    flexShrink: 0
                  }}>
                    2
                  </div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
                      Browse Available Bursaries
                    </h3>
                    <p style={{ fontSize: '14px', color: 'var(--gray-600)' }}>
                      Explore bursary opportunities that match your education level and needs
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '16px', background: 'var(--gray-50)', borderRadius: '8px' }}>
                  <div style={{ 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '50%', 
                    background: 'var(--primary-blue)', 
                    color: 'white', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontWeight: '600',
                    flexShrink: 0
                  }}>
                    3
                  </div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
                      Submit Your Application
                    </h3>
                    <p style={{ fontSize: '14px', color: 'var(--gray-600)' }}>
                      Fill out the application form with accurate information and submit for review
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '16px', background: 'var(--gray-50)', borderRadius: '8px' }}>
                  <div style={{ 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '50%', 
                    background: 'var(--primary-blue)', 
                    color: 'white', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontWeight: '600',
                    flexShrink: 0
                  }}>
                    4
                  </div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
                      Track Your Application
                    </h3>
                    <p style={{ fontSize: '14px', color: 'var(--gray-600)' }}>
                      Monitor your application status and receive updates on your bursary
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Admin Dashboard */}
          {!isApplicant && (
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Admin Dashboard</h2>
              </div>
              <div className="empty-state">
                <div className="empty-state-icon">📊</div>
                <h3 className="empty-state-title">Administrator Dashboard</h3>
                <p className="empty-state-text">
                  Admin features coming soon. You can manage applications and awards from here.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
