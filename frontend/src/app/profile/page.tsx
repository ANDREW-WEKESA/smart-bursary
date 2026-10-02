'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { getCounties, getConstituencies, getSubCounty, getWards } from '@/data/kenyaLocations';

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
  constituency: string;
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
  const [activeTab, setActiveTab] = useState<'personal' | 'guardian' | 'documents'>('personal');

  // Location data
  const [counties, setCounties] = useState<string[]>([]);
  const [constituencies, setConstituencies] = useState<string[]>([]);
  const [subCounties, setSubCounties] = useState<string[]>([]);
  const [wards, setWards] = useState<string[]>([]);

  // Documents
  const [documents, setDocuments] = useState({
    nationalId: null as File | null,
    feeStructure: null as File | null,
    schoolId: '',
    resultSlip: null as File | null
  });

  // Personal Information
  const [personalInfo, setPersonalInfo] = useState<ApplicantProfile>({
    id_number: '',
    date_of_birth: '',
    gender: '',
    county: '',
    constituency: '',
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
    // Load counties on mount
    setCounties(getCounties());

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

            // Load constituencies, sub-counties and wards if county exists
            if (applicantResponse.data.county) {
              const constits = getConstituencies(applicantResponse.data.county);
              setConstituencies(constits);
              
              if (applicantResponse.data.constituency) {
                // Get sub-county for this constituency
                const subCounty = getSubCounty(applicantResponse.data.county, applicantResponse.data.constituency);
                setSubCounties([subCounty]);
                
                // Load wards
                const wardsData = getWards(applicantResponse.data.county, applicantResponse.data.constituency);
                setWards(wardsData);
              }
            }

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

    // Handle cascading dropdowns
    if (name === 'county') {
      const constits = getConstituencies(value);
      setConstituencies(constits);
      setSubCounties([]);
      setWards([]);
      setPersonalInfo(prev => ({
        ...prev,
        county: value,
        constituency: '',
        sub_county: '',
        ward: ''
      }));
    } else if (name === 'constituency') {
      const subCounty = getSubCounty(personalInfo.county, value);
      setSubCounties([subCounty]);
      const wardsData = getWards(personalInfo.county, value);
      setWards(wardsData);
      setPersonalInfo(prev => ({
        ...prev,
        constituency: value,
        sub_county: subCounty,
        ward: ''
      }));
    }
  };

  const handleGuardianInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setGuardianInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocuments(prev => ({
        ...prev,
        [field]: file
      }));
    }
  };

  const handleSchoolIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDocuments(prev => ({
      ...prev,
      schoolId: e.target.value
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
    let total = 11; // Increased for documents

    if (personalInfo.id_number) completed++;
    if (personalInfo.date_of_birth) completed++;
    if (personalInfo.gender) completed++;
    if (personalInfo.county) completed++;
    if (personalInfo.constituency) completed++;
    if (personalInfo.sub_county) completed++;
    if (personalInfo.ward) completed++;
    if (personalInfo.address) completed++;
    if (guardianInfo.full_name) completed++;
    if (guardianInfo.phone) completed++;
    if (guardianInfo.guardian_relationship) completed++;
    if (documents.nationalId || documents.feeStructure || documents.schoolId) completed++;

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
              <button
                onClick={() => setActiveTab('documents')}
                className={`py-4 px-6 text-sm font-medium border-b-2 ${
                  activeTab === 'documents'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Required Documents
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
                  <select
                    name="county"
                    value={personalInfo.county}
                    onChange={handlePersonalInfoChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select County</option>
                    {counties.map(county => (
                      <option key={county} value={county}>{county}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Constituency <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="constituency"
                    value={personalInfo.constituency}
                    onChange={handlePersonalInfoChange}
                    disabled={!personalInfo.county}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  >
                    <option value="">Select Constituency</option>
                    {constituencies.map(constituency => (
                      <option key={constituency} value={constituency}>{constituency}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sub-County <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="sub_county"
                    value={personalInfo.sub_county}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                    placeholder="Auto-filled based on constituency"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ward <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="ward"
                    value={personalInfo.ward}
                    onChange={handlePersonalInfoChange}
                    disabled={!personalInfo.constituency}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                  >
                    <option value="">Select Ward</option>
                    {wards.map(ward => (
                      <option key={ward} value={ward}>{ward}</option>
                    ))}
                  </select>
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

          {/* Documents Upload Form */}
          {activeTab === 'documents' && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Required Documents</h3>
              <p className="text-sm text-gray-600 mb-6">
                Upload the following documents to complete your application profile
              </p>

              <div className="space-y-6">
                {/* National ID */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-500 transition">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                      </svg>
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="text-sm font-medium text-gray-900 mb-1">
                        National ID / Birth Certificate <span className="text-red-500">*</span>
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Upload a clear scanned copy or photo of your ID or birth certificate
                      </p>
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={(e) => handleFileChange(e, 'nationalId')}
                        className="text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                      {documents.nationalId && (
                        <p className="mt-2 text-sm text-green-600">✓ {documents.nationalId.name}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Fee Structure */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-500 transition">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="text-sm font-medium text-gray-900 mb-1">
                        School Fee Structure <span className="text-red-500">*</span>
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Upload your official school/college/university fee structure
                      </p>
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={(e) => handleFileChange(e, 'feeStructure')}
                        className="text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                      />
                      {documents.feeStructure && (
                        <p className="mt-2 text-sm text-green-600">✓ {documents.feeStructure.name}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* School ID Number */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-500 transition">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                      </svg>
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="text-sm font-medium text-gray-900 mb-1">
                        School/Student ID Number <span className="text-red-500">*</span>
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Enter your official school/college/university student ID number
                      </p>
                      <input
                        type="text"
                        value={documents.schoolId}
                        onChange={handleSchoolIdChange}
                        placeholder="e.g., S21/12345/2024"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Result Slip - For Continuing Students */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-500 transition">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="text-sm font-medium text-gray-900 mb-1">
                        Latest Result Slip <span className="text-gray-500">(For Continuing Students)</span>
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Upload your most recent exam results or transcript
                      </p>
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={(e) => handleFileChange(e, 'resultSlip')}
                        className="text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                      />
                      {documents.resultSlip && (
                        <p className="mt-2 text-sm text-green-600">✓ {documents.resultSlip.name}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex">
                  <svg className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Important Notes:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>All documents must be clear and readable</li>
                      <li>Accepted formats: JPG, PNG, PDF</li>
                      <li>Maximum file size: 5MB per document</li>
                      <li>Documents marked with * are required</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => {
                    setMessage({ type: 'success', text: 'Documents uploaded successfully!' });
                  }}
                  disabled={!documents.nationalId || !documents.feeStructure || !documents.schoolId}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Save Documents
                </button>
              </div>
            </div>
          )}
          )}
        </div>
      </main>
    </div>
  );
}
