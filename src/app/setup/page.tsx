"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SetupWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [verifying, setVerifying] = useState(false);

  const [setupData, setSetupData] = useState({
    // Step 1: License Key
    licenseKey: "",
    customerEmail: "",

    // Step 2: Admin Account
    adminName: "",
    adminEmail: "",
    adminPassword: "",
    adminPasswordConfirm: "",

    // Step 3: Google AI
    googleAiKey: "",

    // Step 4: Branding (Optional)
    companyName: "",
    companyLogo: "",
  });

  const verifyLicense = async () => {
    if (!setupData.licenseKey || !setupData.customerEmail) {
      setError("Please enter both license key and email address");
      return false;
    }

    setVerifying(true);
    setError("");

    try {
      const response = await fetch("/api/setup/verify-license", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          licenseKey: setupData.licenseKey,
          email: setupData.customerEmail,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid license key");
      }

      setVerifying(false);
      return true;
    } catch (err: any) {
      setError(err.message);
      setVerifying(false);
      return false;
    }
  };

  const handleNext = async () => {
    setError("");

    if (step === 1) {
      // Verify license key
      const isValid = await verifyLicense();
      if (!isValid) return;
    }

    if (step === 2) {
      // Validate admin account
      if (!setupData.adminEmail || !setupData.adminPassword || !setupData.adminName) {
        setError("Please fill in all required fields");
        return;
      }
      if (setupData.adminPassword !== setupData.adminPasswordConfirm) {
        setError("Passwords do not match");
        return;
      }
      if (setupData.adminPassword.length < 8) {
        setError("Password must be at least 8 characters");
        return;
      }
    }

    if (step === 3) {
      // Validate Google AI key
      if (!setupData.googleAiKey) {
        setError("Google AI API Key is required for content generation");
        return;
      }
    }

    setStep(step + 1);
  };

  const handleBack = () => {
    setError("");
    setStep(step - 1);
  };

  const handleComplete = async () => {
    setLoading(true);
    setError("");

    try {
      // Submit setup data to API
      const response = await fetch("/api/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(setupData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Setup failed");
      }

      // Redirect to sign in
      router.push("/auth/signin?setup=complete");
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🏠</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Real Estate Champ
          </h1>
          <p className="text-gray-600">
            Let's get your AI-powered content platform set up
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
              step >= 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
            }`}>
              1
            </div>
            <div className={`w-12 h-1 ${step >= 2 ? "bg-blue-600" : "bg-gray-200"}`} />
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
              step >= 2 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
            }`}>
              2
            </div>
            <div className={`w-12 h-1 ${step >= 3 ? "bg-blue-600" : "bg-gray-200"}`} />
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
              step >= 3 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
            }`}>
              3
            </div>
            <div className={`w-12 h-1 ${step >= 4 ? "bg-blue-600" : "bg-gray-200"}`} />
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
              step >= 4 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
            }`}>
              4
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Step 1: License Key */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Step 1: Activate Your License
              </h2>
              <p className="text-gray-600 mb-6">
                Enter the license key you received via email
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>📧 Check your email:</strong> Your license key was sent to you after purchase. It looks like: <code className="bg-blue-100 px-2 py-1 rounded">XXXX-XXXX-XXXX-XXXX</code>
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                License Key *
              </label>
              <input
                type="text"
                value={setupData.licenseKey}
                onChange={(e) => setSetupData({ ...setupData, licenseKey: e.target.value.toUpperCase() })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono uppercase"
                placeholder="XXXX-XXXX-XXXX-XXXX"
                maxLength={19}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address (used for purchase) *
              </label>
              <input
                type="email"
                value={setupData.customerEmail}
                onChange={(e) => setSetupData({ ...setupData, customerEmail: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>
          </div>
        )}

        {/* Step 2: Admin Account */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Step 2: Create Admin Account
              </h2>
              <p className="text-gray-600 mb-6">
                This will be the main administrator account for your installation
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={setupData.adminName}
                onChange={(e) => setSetupData({ ...setupData, adminName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={setupData.adminEmail}
                onChange={(e) => setSetupData({ ...setupData, adminEmail: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="admin@yourcompany.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <input
                type="password"
                value={setupData.adminPassword}
                onChange={(e) => setSetupData({ ...setupData, adminPassword: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Minimum 8 characters"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password *
              </label>
              <input
                type="password"
                value={setupData.adminPasswordConfirm}
                onChange={(e) => setSetupData({ ...setupData, adminPasswordConfirm: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Re-enter password"
              />
            </div>
          </div>
        )}

        {/* Step 3: Google AI */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Step 3: Configure AI Engine
              </h2>
              <p className="text-gray-600 mb-6">
                Real Estate Champ uses Google's Gemini AI to generate content
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">How to get your API key:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
                <li>Go to <a href="https://makersuite.google.com/app/apikey" target="_blank" className="underline">Google AI Studio</a></li>
                <li>Sign in with your Google account</li>
                <li>Click "Create API Key"</li>
                <li>Copy the key and paste it below</li>
              </ol>
              <p className="text-xs text-blue-700 mt-2">
                Note: Google AI has a free tier with generous limits
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Google AI API Key *
              </label>
              <input
                type="text"
                value={setupData.googleAiKey}
                onChange={(e) => setSetupData({ ...setupData, googleAiKey: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                placeholder="AIza..."
              />
              <p className="text-xs text-gray-500 mt-1">
                This key will be securely stored and used for AI content generation
              </p>
            </div>
          </div>
        )}

        {/* Step 4: Branding */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Step 4: Customize Branding (Optional)
              </h2>
              <p className="text-gray-600 mb-6">
                Personalize the platform with your company branding
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name
              </label>
              <input
                type="text"
                value={setupData.companyName}
                onChange={(e) => setSetupData({ ...setupData, companyName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Your Real Estate Company"
              />
              <p className="text-xs text-gray-500 mt-1">
                This will appear in the dashboard and emails
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo URL (Optional)
              </label>
              <input
                type="text"
                value={setupData.companyLogo}
                onChange={(e) => setSetupData({ ...setupData, companyLogo: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/logo.png"
              />
              <p className="text-xs text-gray-500 mt-1">
                Link to your company logo image
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2">✅ Setup Complete!</h3>
              <p className="text-sm text-green-800">
                Click "Complete Setup" below to finish the installation. You'll be redirected to sign in with your admin account.
              </p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t">
          <button
            onClick={handleBack}
            disabled={step === 1 || verifying || loading}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              step === 1 || verifying || loading
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            ← Back
          </button>

          {step < 4 ? (
            <button
              onClick={handleNext}
              disabled={verifying || loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {verifying ? "Verifying..." : "Next →"}
            </button>
          ) : (
            <button
              onClick={handleComplete}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Setting up..." : "Complete Setup ✓"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
