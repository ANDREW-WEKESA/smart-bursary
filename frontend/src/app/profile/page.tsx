'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

interface User {
  id: number;
  email: string;
  full_name: string;
  phone: string | null;
  role: string;
}

interface ApplicantProfile {
  id?: number;
  user_id?: number;
  id_number: string;
  date_of_birth: string;
  gender: string;
  county: string;
  sub_county: string;
  ward: string;
  address: string;
  disability_status: string;
  disability_description?: string;
}

interface Guardian {
  id?: number;
  applicant_id?: number;
  full_name: string;
  guardian_relationship: string;
  phone: string;
  email?: string;
  address: string;
  occupation: string;
  monthly_income?: number;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'personal' | 'guardian'>('personal');

  // Personal Information
  const [personalInfo, setPersonalInfo] = useState<ApplicantProfile>({
    id_number: '',
    date_of_birth: '',
    gender: '',
    county: '',
    sub_county: '',
    ward: '',
    address: '',
    disability_status: 'NO'
  });

  // Guardian Information
  const [guardianInfo, setGuardianInfo] = useState<Guardian>({
    full_name: '',
    guardian_relationship: '',
    phone: '',
    address: '',
    occupation: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        // Get user info
        const userResponse = await api.get('/auth/me');
        setUser(userResponse.data);

        // Try to get existing applicant profile
        try {
          const applicantResponse = await api.get(`/applicants/${userResponse.data.id}`);
          if (applicantResponse.data) {
            setPersonalInfo(applicantResponse.data);

            // Try to get guardian info
            try {
              const guardiansResponse = await api.get(`/applicants/${applicantResponse.data.id}/guardians`);
              if (guardiansResponse.data && guardiansResponse.data.length > 0) {
                setGuardianInfo(guardiansResponse.data[0]);
              }
            } catch (err) {
              console.log('No guardian info found');
            }
          }
        } catch (err) {
          console.log('No applicant profile found - will create new');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        localStorage.removeItem('token');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGuardianInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setGuardianInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const savePersonalInfo = async () => {
    setSaving(true);
    setMessage(null);

    try {
      if (!user) return;

      const data = {
        ...personalInfo,
        user_id: user.id
      };

      if (personalInfo.id) {
        // Update existing
        await api.put(`/applicants/${personalInfo.id}`, data);
        setMessage({ type: 'success', text: 'Personal information updated successfully!' });
      } else {
        // Create new
        const response = await api.post('/applicants/', data);
        setPersonalInfo(response.data);
        setMessage({ type: 'success', text: 'Personal information saved successfully!' });
      }
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.detail || 'Failed to save personal information' 
      });
    } finally {
      setSaving(false);
    }
  };

  const saveGuardianInfo = async () => {
    setSaving(true);
    setMessage(null);

    try {
      if (!personalInfo.id) {
        setMessage({ type: 'error', text: 'Please save personal information first' });
        setSaving(false);
        return;
      }

      const data = {
        ...guardianInfo,
        applicant_id: personalInfo.id
      };

      if (guardianInfo.id) {
        // Update existing
        await api.put(`/guardians/${guardianInfo.id}`, data);
        setMessage({ type: 'success', text: 'Guardian information updated successfully!' });
      } else {
        // Create new
        const response = await api.post('/guardians/', data);
        setGuardianInfo(response.data);
        setMessage({ type: 'success', text: 'Guardian information saved successfully!' });
      }
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.detail || 'Failed to save guardian information' 
      });
    } finally {
      setSaving(false);
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

  const getProfileCompletion = () => {
    let completed = 0;
    let total = 8;

    if (personalInfo.id_number) completed++;
    if (personalInfo.date_of_birth) completed++;
    if (personalInfo.gender) completed++;
    if (personalInfo.county) completed++;
    if (personalInfo.address) completed++;
    if (guardianInfo.full_name) completed++;
    if (guardianInfo.phone) completed++;
    if (guardianInfo.guardian_relationship) completed++;

    return Math.round((completed / total) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            <p className="text-sm text-gray-600">Complete your profile to apply for bursaries</p>
          </div>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
          >
            Back to Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Completion */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">Profile Completion</h3>
            <span className="text-2xl font-bold text-blue-600">{getProfileCompletion()}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-500" 
              style={{ width: `${getProfileCompletion()}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Complete your profile to unlock all features
          </p>
        </div>

        {/* Success/Error Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <p className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
              {message.text}
            </p>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('personal')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'personal'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Personal Information
              </button>
              <button
                onClick={() => setActiveTab('guardian')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'guardian'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Guardian Information
              </button>
            </nav>
          </div>

          {/* Personal Information Form */}
          {activeTab === 'personal' && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name (from account)
                  </label>
                  <input
                    type="text"
                    value={user?.full_name || ''}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ID Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="id_number"
                    value={personalInfo.id_number}
                    onChange={handlePersonalInfoChange}
                    placeholder="12345678"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="date_of_birth"
                    value={personalInfo.date_of_birth}
                    onChange={handlePersonalInfoChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="gender"
                    value={personalInfo.gender}
                    onChange={handlePersonalInfoChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select Gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    County <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="county"
                    value={personalInfo.county}
                    onChange={handlePersonalInfoChange}
                    placeholder="e.g., Nairobi"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sub-County
                  </label>
                  <input
                    type="text"
                    name="sub_county"
                    value={personalInfo.sub_county}
                    onChange={handlePersonalInfoChange}
                    placeholder="e.g., Westlands"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ward
                  </label>
                  <input
                    type="text"
                    name="ward"
                    value={personalInfo.ward}
                    onChange={handlePersonalInfoChange}
                    placeholder="e.g., Kitisuru"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Disability Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="disability_status"
                    value={personalInfo.disability_status}
                    onChange={handlePersonalInfoChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="NO">No Disability</option>
                    <option value="YES">Yes, I have a disability</option>
                  </select>
                </div>

                {personalInfo.disability_status === 'YES' && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Disability Description
                    </label>
                    <textarea
                      name="disability_description"
                      value={personalInfo.disability_description || ''}
                      onChange={handlePersonalInfoChange}
                      rows={3}
                      placeholder="Please describe your disability"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Physical Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="address"
                    value={personalInfo.address}
                    onChange={handlePersonalInfoChange}
                    rows={3}
                    placeholder="Enter your complete physical address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={savePersonalInfo}
                  disabled={saving}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:bg-gray-400"
                >
                  {saving ? 'Saving...' : 'Save Personal Information'}
                </button>
              </div>
            </div>
          )}

          {/* Guardian Information Form */}
          {activeTab === 'guardian' && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Guardian/Parent Details</h3>
              
              {!personalInfo.id && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800">
                    Please save your personal information first before adding guardian details.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Guardian Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={guardianInfo.full_name}
                    onChange={handleGuardianInfoChange}
                    placeholder="Enter guardian's full name"
                    disabled={!personalInfo.id}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Relationship <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="guardian_relationship"
                    value={guardianInfo.guardian_relationship}
                    onChange={handleGuardianInfoChange}
                    disabled={!personalInfo.id}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  >
                    <option value="">Select Relationship</option>
                    <option value="FATHER">Father</option>
                    <option value="MOTHER">Mother</option>
                    <option value="GUARDIAN">Guardian</option>
                    <option value="SIBLING">Sibling</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={guardianInfo.phone}
                    onChange={handleGuardianInfoChange}
                    placeholder="+254700000000"
                    disabled={!personalInfo.id}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={guardianInfo.email || ''}
                    onChange={handleGuardianInfoChange}
                    placeholder="guardian@example.com"
                    disabled={!personalInfo.id}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Occupation <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="occupation"
                    value={guardianInfo.occupation}
                    onChange={handleGuardianInfoChange}
                    placeholder="e.g., Teacher, Farmer, Business"
                    disabled={!personalInfo.id}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monthly Income (Optional)
                  </label>
                  <input
                    type="number"
                    name="monthly_income"
                    value={guardianInfo.monthly_income || ''}
                    onChange={handleGuardianInfoChange}
                    placeholder="Enter amount in KES"
                    disabled={!personalInfo.id}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Guardian Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="address"
                    value={guardianInfo.address}
                    onChange={handleGuardianInfoChange}
                    rows={3}
                    placeholder="Enter guardian's complete address"
                    disabled={!personalInfo.id}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={saveGuardianInfo}
                  disabled={saving || !personalInfo.id}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:bg-gray-400"
                >
                  {saving ? 'Saving...' : 'Save Guardian Information'}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
