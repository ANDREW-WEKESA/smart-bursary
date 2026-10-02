'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';

interface Bursary {
  id: number;
  name: string;
  amount: number;
  application_deadline: string;
}

interface ApplicationData {
  bursary_id: number;
  status: string;
  application_text: string;
  family_income: number | null;
  institution_name: string;
  course_of_study: string;
  year_of_study: number;
  expected_completion_year: number;
}

export default function ApplyPage() {
  const router = useRouter();
  const params = useParams();
  const [bursary, setBursary] = useState<Bursary | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState<ApplicationData>({
    bursary_id: parseInt(params.id as string),
    status: 'DRAFT',
    application_text: '',
    family_income: null,
    institution_name: '',
    course_of_study: '',
    year_of_study: 1,
    expected_completion_year: new Date().getFullYear() + 4
  });

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'family_income' || name === 'year_of_study' || name === 'expected_completion_year'
        ? value === '' ? null : parseInt(value)
        : value
    }));
  };

  const handleNextStep = () => {
    setError('');
    
    // Validation for each step
    if (currentStep === 1) {
      if (!formData.institution_name || !formData.course_of_study) {
        setError('Please fill in all required academic information');
        return;
      }
    } else if (currentStep === 2) {
      if (!formData.application_text || formData.application_text.length < 100) {
        setError('Please write at least 100 characters explaining why you deserve this bursary');
        return;
      }
    }

    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const handlePreviousStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const saveDraft = async () => {
    setSubmitting(true);
    setError('');

    try {
      const dataToSave = {
        ...formData,
        status: 'DRAFT'
      };

      await api.post('/applications/', dataToSave);
      setSuccess(true);
      setTimeout(() => {
        router.push('/applications');
      }, 2000);
    } catch (error: any) {
      setError(error.response?.data?.detail || 'Failed to save draft');
    } finally {
      setSubmitting(false);
    }
  };

  const submitApplication = async () => {
    setSubmitting(true);
    setError('');

    // Final validation
    if (!formData.institution_name || !formData.course_of_study || !formData.application_text) {
      setError('Please complete all required fields');
      setSubmitting(false);
      return;
    }

    try {
      const dataToSubmit = {
        ...formData,
        status: 'SUBMITTED'
      };

      await api.post('/applications/', dataToSubmit);
      setSuccess(true);
      setTimeout(() => {
        router.push('/applications');
      }, 2000);
    } catch (error: any) {
      setError(error.response?.data?.detail || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
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

  if (error && !bursary) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <Link href="/bursaries" className="mt-4 inline-block text-blue-600 hover:underline">
            Back to Bursaries
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
          <p className="text-gray-600 mb-4">Your application has been successfully submitted.</p>
          <p className="text-sm text-gray-500">Redirecting to your applications...</p>
        </div>
      </div>
    );
  }

  const getStepStatus = (step: number) => {
    if (step < currentStep) return 'complete';
    if (step === currentStep) return 'current';
    return 'upcoming';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Apply for Bursary</h1>
              <p className="text-sm text-gray-600 mt-1">{bursary?.name}</p>
              <p className="text-sm text-blue-600 font-medium">Award: KES {bursary?.amount.toLocaleString()}</p>
            </div>
            <Link
              href={`/bursaries/${params.id}`}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
            >
              Cancel
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((step) => {
              const status = getStepStatus(step);
              return (
                <div key={step} className="flex-1 relative">
                  <div className="flex items-center">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      status === 'complete' ? 'bg-green-600 border-green-600' :
                      status === 'current' ? 'bg-blue-600 border-blue-600' :
                      'bg-white border-gray-300'
                    }`}>
                      {status === 'complete' ? (
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <span className={status === 'current' ? 'text-white font-semibold' : 'text-gray-500'}>
                          {step}
                        </span>
                      )}
                    </div>
                    {step < 4 && (
                      <div className={`flex-1 h-1 mx-2 ${
                        status === 'complete' ? 'bg-green-600' : 'bg-gray-300'
                      }`} />
                    )}
                  </div>
                  <div className="mt-2">
                    <p className={`text-xs ${status === 'current' ? 'font-semibold text-blue-600' : 'text-gray-600'}`}>
                      {step === 1 && 'Academic Info'}
                      {step === 2 && 'Application Statement'}
                      {step === 3 && 'Financial Info'}
                      {step === 4 && 'Review & Submit'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Form Steps */}
        <div className="bg-white rounded-lg shadow p-6">
          {/* Step 1: Academic Information */}
          {currentStep === 1 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Academic Information</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Institution Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="institution_name"
                    value={formData.institution_name}
                    onChange={handleInputChange}
                    placeholder="e.g., University of Nairobi"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course of Study <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="course_of_study"
                    value={formData.course_of_study}
                    onChange={handleInputChange}
                    placeholder="e.g., Bachelor of Science in Computer Science"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Year of Study <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="year_of_study"
                      value={formData.year_of_study}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                      <option value="5">5th Year</option>
                      <option value="6">6th Year</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expected Completion Year <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="expected_completion_year"
                      value={formData.expected_completion_year}
                      onChange={handleInputChange}
                      min={new Date().getFullYear()}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Application Statement */}
          {currentStep === 2 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Application Statement</h3>
              <p className="text-sm text-gray-600 mb-6">
                Tell us why you deserve this bursary. Minimum 100 characters.
              </p>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Why do you deserve this bursary? <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="application_text"
                  value={formData.application_text}
                  onChange={handleInputChange}
                  rows={10}
                  placeholder="Explain your academic achievements, financial need, and how this bursary will help you achieve your goals..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formData.application_text.length} / 100 characters minimum
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Financial Information */}
          {currentStep === 3 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Financial Information</h3>
              <p className="text-sm text-gray-600 mb-6">
                Help us understand your financial need (optional but recommended).
              </p>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Family Monthly Income (KES)
                </label>
                <input
                  type="number"
                  name="family_income"
                  value={formData.family_income || ''}
                  onChange={handleInputChange}
                  placeholder="Enter approximate monthly income"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-sm text-gray-500 mt-1">
                  This information helps us assess financial need
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Review Your Application</h3>
              
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Academic Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Institution</p>
                      <p className="font-medium">{formData.institution_name}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Course</p>
                      <p className="font-medium">{formData.course_of_study}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Year of Study</p>
                      <p className="font-medium">{formData.year_of_study}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Completion Year</p>
                      <p className="font-medium">{formData.expected_completion_year}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Application Statement</h4>
                  <p className="text-sm text-gray-700 whitespace-pre-line">{formData.application_text}</p>
                </div>

                {formData.family_income && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Financial Information</h4>
                    <p className="text-sm">
                      <span className="text-gray-600">Family Monthly Income: </span>
                      <span className="font-medium">KES {formData.family_income.toLocaleString()}</span>
                    </p>
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Important:</strong> Once submitted, you cannot edit this application. 
                    Please review carefully before submitting.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between">
            <div>
              {currentStep > 1 && (
                <button
                  onClick={handlePreviousStep}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                >
                  Previous
                </button>
              )}
            </div>

            <div className="flex gap-3">
              {currentStep < 4 ? (
                <>
                  <button
                    onClick={saveDraft}
                    disabled={submitting}
                    className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200 transition disabled:bg-gray-300"
                  >
                    Save Draft
                  </button>
                  <button
                    onClick={handleNextStep}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  >
                    Next
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={saveDraft}
                    disabled={submitting}
                    className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-md hover:bg-yellow-200 transition disabled:bg-gray-300"
                  >
                    Save as Draft
                  </button>
                  <button
                    onClick={submitApplication}
                    disabled={submitting}
                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition disabled:bg-gray-400"
                  >
                    {submitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
