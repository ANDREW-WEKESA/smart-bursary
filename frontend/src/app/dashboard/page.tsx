'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import ApplicantDashboard from '@/components/dashboards/ApplicantDashboard';
import AdministratorDashboard from '@/components/dashboards/AdministratorDashboard';
import ReviewerDashboard from '@/components/dashboards/ReviewerDashboard';

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
      } catch (error) {
        localStorage.removeItem('token');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const getRoleDisplay = (role: string) => {
    const roleMap: { [key: string]: string } = {
      'applicant': 'Applicant',
      'administrator': 'Administrator',
      'system_admin': 'System Admin',
      'reviewer': 'Reviewer',
      'finance_officer': 'Finance Officer',
      'institution_officer': 'Institution Officer'
    };
    return roleMap[role.toLowerCase()] || role;
  };

  const renderDashboard = () => {
    if (!user) return null;

    const role = user.role.toLowerCase();

    switch (role) {
      case 'administrator':
      case 'system_admin':
        return <AdministratorDashboard user={user} />;
      case 'applicant':
        return <ApplicantDashboard user={user} />;
      case 'reviewer':
        return <ReviewerDashboard user={user} />;
      case 'finance_officer':
        return <div className="text-center py-12 text-gray-600">Finance Officer dashboard coming soon...</div>;
      case 'institution_officer':
        return <div className="text-center py-12 text-gray-600">Institution Officer dashboard coming soon...</div>;
      default:
        return <ApplicantDashboard user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">SmartBursary</h1>
            <p className="text-sm text-gray-600">{getRoleDisplay(user?.role || '')}</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderDashboard()}
      </main>
    </div>
  );
}
