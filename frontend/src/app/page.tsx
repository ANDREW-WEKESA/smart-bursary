import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to SmartBursary
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Intelligent Bursary Application, Verification & Tracking System
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-4xl mb-4">📝</div>
              <h2 className="text-2xl font-semibold mb-4">For Applicants</h2>
              <p className="text-gray-600 mb-6">
                Submit bursary applications online, upload documents, and track your application status in real-time.
              </p>
              <Link
                href="/register"
                className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition"
              >
                Apply Now
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-4xl mb-4">🔍</div>
              <h2 className="text-2xl font-semibold mb-4">For Administrators</h2>
              <p className="text-gray-600 mb-6">
                Manage applications efficiently with AI-assisted verification, duplicate detection, and comprehensive reporting.
              </p>
              <Link
                href="/login"
                className="inline-block bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition"
              >
                Admin Login
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-semibold mb-6">Key Features</h3>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div>
                <div className="text-2xl mb-2">✅</div>
                <h4 className="font-semibold mb-2">Easy Application</h4>
                <p className="text-sm text-gray-600">
                  Simple online forms with step-by-step guidance
                </p>
              </div>
              <div>
                <div className="text-2xl mb-2">🤖</div>
                <h4 className="font-semibold mb-2">AI-Assisted</h4>
                <p className="text-sm text-gray-600">
                  Intelligent verification and duplicate detection
                </p>
              </div>
              <div>
                <div className="text-2xl mb-2">📊</div>
                <h4 className="font-semibold mb-2">Real-time Tracking</h4>
                <p className="text-sm text-gray-600">
                  Monitor your application status at every step
                </p>
              </div>
              <div>
                <div className="text-2xl mb-2">🔒</div>
                <h4 className="font-semibold mb-2">Secure & Private</h4>
                <p className="text-sm text-gray-600">
                  Your data is encrypted and protected
                </p>
              </div>
              <div>
                <div className="text-2xl mb-2">📱</div>
                <h4 className="font-semibold mb-2">Mobile Friendly</h4>
                <p className="text-sm text-gray-600">
                  Apply from any device, anywhere
                </p>
              </div>
              <div>
                <div className="text-2xl mb-2">🔔</div>
                <h4 className="font-semibold mb-2">Notifications</h4>
                <p className="text-sm text-gray-600">
                  Get updates via email and in-app alerts
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 SmartBursary. Academic Group Project.</p>
        </div>
      </footer>
    </div>
  );
}
