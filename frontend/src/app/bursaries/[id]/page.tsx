'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
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

export default function BursaryDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const [bursary, setBursary] = useState<Bursary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBursary = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await api.get(`/bursaries/${params.id}`);
        setBursary(response.data);
      } catch (error: any) {
        console.error('Error fetching bursary:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          router.push('/login');
        } else {
          setError('Failed to load bursary details');
        }
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchBursary();
    }
  }, [params.id, router]);

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
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600">Loading bursary details...</p>
        </div>
      </div>
    );
  }

  if (error || !bursary) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <svg className="mx-auto h-16 w-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="mt-4 text-xl font-semibold text-gray-900">Bursary Not Found</h2>
          <p className="mt-2 text-gray-600">{error || 'The bursary you are looking for does not exist.'}</p>
          <Link href="/bursaries" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Back to Bursaries
          </Link>
        </div>
      </div>
    );
  }

  const daysRemaining = getDaysRemaining(bursary.application_deadline);
  const isExpired = daysRemaining < 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bursary Details</h1>
            <p className="text-sm text-gray-600">Review bursary information and requirements</p>
          </div>
          <Link
            href="/bursaries"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
          >
            Back to Bursaries
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Bursary Header Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-white">
            <h2 className="text-3xl font-bold mb-2">{bursary.name}</h2>
            <div className="flex items-center gap-4 text-sm">
              <span className="px-3 py-1 bg-white/20 rounded-full">
                {bursary.category.replace('_', ' ')}
              </span>
              <span className="px-3 py-1 bg-white/20 rounded-full">
                {bursary.academic_level}
              </span>
            </div>
          </div>

          <div className="p-6">
            {/* Amount & Deadline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 pb-6 border-b border-gray-200">
              <div>
                <p className="text-sm text-gray-600 mb-1">Award Amount</p>
                <p className="text-3xl font-bold text-blue-600">{formatAmount(bursary.amount)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Application Deadline</p>
                <p className="text-2xl font-semibold text-gray-900">{formatDate(bursary.application_deadline)}</p>
                {!isExpired ? (
                  <p className={`text-sm mt-1 ${daysRemaining <= 7 ? 'text-red-600 font-semibold' : 'text-green-600'}`}>
                    {daysRemaining} days remaining
                  </p>
                ) : (
                  <p className="text-sm mt-1 text-red-600 font-semibold">Application period closed</p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-700 whitespace-pre-line">{bursary.description}</p>
            </div>

            {/* Eligibility Criteria */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Eligibility Criteria
              </h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-gray-800 whitespace-pre-line">{bursary.eligibility_criteria}</p>
              </div>
            </div>

            {/* Required Documents */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Required Documents
              </h3>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <p className="text-gray-800 whitespace-pre-line">{bursary.required_documents}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              {!isExpired && (
                <Link
                  href={`/apply/${bursary.id}`}
                  className="flex-1 px-6 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition text-center"
                >
                  Apply for this Bursary
                </Link>
              )}
              <button
                onClick={() => window.print()}
                className="px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-md hover:bg-gray-300 transition"
              >
                Print Details
              </button>
            </div>

            {isExpired && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 font-medium">
                  ⚠️ This bursary is no longer accepting applications. The deadline has passed.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Bursary ID</p>
              <p className="font-medium text-gray-900">#{bursary.id}</p>
            </div>
            <div>
              <p className="text-gray-600">Status</p>
              <p className="font-medium text-green-600">{bursary.status}</p>
            </div>
            <div>
              <p className="text-gray-600">Category</p>
              <p className="font-medium text-gray-900">{bursary.category.replace('_', ' ')}</p>
            </div>
            <div>
              <p className="text-gray-600">Academic Level</p>
              <p className="font-medium text-gray-900">{bursary.academic_level}</p>
            </div>
            <div>
              <p className="text-gray-600">Created On</p>
              <p className="font-medium text-gray-900">{formatDate(bursary.created_at)}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
