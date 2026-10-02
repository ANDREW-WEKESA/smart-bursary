'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';

interface Bursary {
  id: number;
  name: string;
  description: string;
  amount: number;
  category: string;
  academic_level: string;
  application_deadline: string;
  status: string;
  eligibility_criteria: string;
  required_documents: string;
  created_at: string;
}

export default function BursariesPage() {
  const router = useRouter();
  const [bursaries, setBursaries] = useState<Bursary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterLevel, setFilterLevel] = useState('');

  useEffect(() => {
    const fetchBursaries = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await api.get('/bursaries/');
        setBursaries(response.data);
      } catch (error: any) {
        console.error('Error fetching bursaries:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          router.push('/login');
        } else {
          setError('Failed to load bursaries');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBursaries();
  }, [router]);

  const filteredBursaries = bursaries.filter(bursary => {
    const matchesSearch = bursary.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bursary.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || bursary.category === filterCategory;
    const matchesLevel = !filterLevel || bursary.academic_level === filterLevel;
    const isActive = bursary.status === 'ACTIVE';
    
    return matchesSearch && matchesCategory && matchesLevel && isActive;
  });

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysRemaining = (deadlineString: string) => {
    const deadline = new Date(deadlineString);
    const today = new Date();
    const diff = deadline.getTime() - today.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'MERIT_BASED': 'bg-blue-100 text-blue-800',
      'NEED_BASED': 'bg-green-100 text-green-800',
      'SPORTS': 'bg-purple-100 text-purple-800',
      'DISABILITY': 'bg-orange-100 text-orange-800',
      'GENDER_SPECIFIC': 'bg-pink-100 text-pink-800',
      'COUNTY_SPECIFIC': 'bg-yellow-100 text-yellow-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getLevelColor = (level: string) => {
    const colors: { [key: string]: string } = {
      'SECONDARY': 'bg-indigo-100 text-indigo-800',
      'COLLEGE': 'bg-teal-100 text-teal-800',
      'UNIVERSITY': 'bg-cyan-100 text-cyan-800',
      'VOCATIONAL': 'bg-emerald-100 text-emerald-800'
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading bursaries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Available Bursaries</h1>
            <p className="text-sm text-gray-600">Browse and apply for bursary opportunities</p>
          </div>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
          >
            Back to Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Bursaries
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or description..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Categories</option>
                <option value="MERIT_BASED">Merit Based</option>
                <option value="NEED_BASED">Need Based</option>
                <option value="SPORTS">Sports</option>
                <option value="DISABILITY">Disability</option>
                <option value="GENDER_SPECIFIC">Gender Specific</option>
                <option value="COUNTY_SPECIFIC">County Specific</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Academic Level
              </label>
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Levels</option>
                <option value="SECONDARY">Secondary</option>
                <option value="COLLEGE">College</option>
                <option value="UNIVERSITY">University</option>
                <option value="VOCATIONAL">Vocational</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing <span className="font-semibold">{filteredBursaries.length}</span> of{' '}
              <span className="font-semibold">{bursaries.length}</span> bursaries
            </p>
            {(searchTerm || filterCategory || filterLevel) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterCategory('');
                  setFilterLevel('');
                }}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Bursaries Grid */}
        {filteredBursaries.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <svg
              className="mx-auto h-16 w-16 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No bursaries found</h3>
            <p className="mt-2 text-gray-600">
              {bursaries.length === 0
                ? 'No active bursaries available at the moment. Check back later!'
                : 'Try adjusting your search or filter criteria.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBursaries.map((bursary) => {
              const daysRemaining = getDaysRemaining(bursary.application_deadline);
              const isUrgent = daysRemaining <= 7 && daysRemaining > 0;
              const isExpired = daysRemaining < 0;

              return (
                <div key={bursary.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                  {/* Card Header */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1 mr-2">
                        {bursary.name}
                      </h3>
                      {!isExpired && (
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
                            isUrgent ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {daysRemaining}d left
                        </span>
                      )}
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(bursary.category)}`}>
                        {bursary.category.replace('_', ' ')}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getLevelColor(bursary.academic_level)}`}>
                        {bursary.academic_level}
                      </span>
                    </div>

                    {/* Amount */}
                    <div className="mb-4">
                      <p className="text-sm text-gray-600">Award Amount</p>
                      <p className="text-2xl font-bold text-blue-600">{formatAmount(bursary.amount)}</p>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {bursary.description}
                    </p>

                    {/* Deadline */}
                    <div className="mb-4 pb-4 border-b border-gray-200">
                      <p className="text-sm text-gray-600">Application Deadline</p>
                      <p className="text-sm font-medium text-gray-900">
                        {formatDate(bursary.application_deadline)}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Link
                        href={`/bursaries/${bursary.id}`}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition text-center"
                      >
                        View Details
                      </Link>
                      <Link
                        href={`/apply/${bursary.id}`}
                        className="flex-1 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition text-center"
                      >
                        Apply Now
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
