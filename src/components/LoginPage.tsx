import React, { useState, useEffect } from "react";
import { Shield, Zap, Lock } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

declare global {
  interface Window {
    google: any;
  }
}

const LoginPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  useEffect(() => {
    // Load Google Identity Services
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
        });
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleCredentialResponse = async (response: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const success = await login(response.credential);
      if (!success) {
        setError(
          "Authentication failed. You may not be authorized for this event."
        );
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    if (window.google) {
      window.google.accounts.id.prompt();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-cyan-400 to-pink-500 mb-6 animate-pulse">
            <Shield className="w-10 h-10 text-black" />
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-pink-500 to-green-400 bg-clip-text text-transparent">
            CYBER CHALLENGE
          </h1>
          <p className="text-gray-400 text-lg">
            Elite hackers only. Prove your worth.
          </p>
        </div>

        {/* Login Card */}
        <div className="cyber-card p-8 space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-cyan-400 mb-2">
              ACCESS TERMINAL
            </h2>
            <p className="text-gray-400 text-sm">
              Only pre-approved operatives may enter
            </p>
          </div>

          {error && (
            <div className="cyber-alert cyber-alert-error">
              <Lock className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full cyber-btn cyber-btn-primary flex items-center justify-center space-x-3 py-4"
          >
            {isLoading ? (
              <>
                <div className="cyber-spinner-sm"></div>
                <span>AUTHENTICATING...</span>
              </>
            ) : (
              <>
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>AUTHENTICATE WITH GOOGLE</span>
              </>
            )}
          </button>

          {/* Features */}
          <div className="space-y-3 pt-4 border-t border-gray-700">
            <div className="flex items-center space-x-3 text-sm text-gray-400">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span>Live challenges and leaderboard</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-400">
              <Shield className="w-4 h-4 text-green-400" />
              <span>Secure authentication required</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-400">
              <Lock className="w-4 h-4 text-cyan-400" />
              <span>Invitation-only access</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-xs text-gray-500">
          <p>Unauthorized access is prohibited and monitored</p>
          <p className="mt-1">© 2025 Cyber Challenge Arena</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
