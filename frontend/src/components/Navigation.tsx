'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const isActive = (path: string) => pathname === path;

  if (!user) return null;

  return (
    <header className="header-nav">
      <div className="nav-container">
        <a href="/dashboard" className="nav-logo">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="#1e40af"/>
            <path d="M16 8L24 20H8L16 8Z" fill="white"/>
          </svg>
          SmartBursary
        </a>

        <nav>
          <ul className="nav-links">
            <li>
              <a 
                href="/dashboard" 
                className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
              >
                Dashboard
              </a>
            </li>
            {user.role === 'APPLICANT' && (
              <>
                <li>
                  <a 
                    href="/profile" 
                    className={`nav-link ${isActive('/profile') ? 'active' : ''}`}
                  >
                    Profile
                  </a>
                </li>
                <li>
                  <a 
                    href="/bursaries" 
                    className={`nav-link ${isActive('/bursaries') ? 'active' : ''}`}
                  >
                    Bursaries
                  </a>
                </li>
                <li>
                  <a 
                    href="/applications" 
                    className={`nav-link ${isActive('/applications') ? 'active' : ''}`}
                  >
                    My Applications
                  </a>
                </li>
                <li>
                  <a 
                    href="/settings" 
                    className={`nav-link ${isActive('/settings') ? 'active' : ''}`}
                  >
                    Settings
                  </a>
                </li>
              </>
            )}
            <li>
              <button 
                onClick={handleLogout}
                className="nav-link"
                style={{ border: 'none', background: 'none', cursor: 'pointer' }}
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
