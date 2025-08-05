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

        // Render the button
        window.google.accounts.id.renderButton(
          document.getElementById("google-signin-button"),
          {
            theme: "outline",
            size: "large",
            width: "100%",
          }
        );
      }
    };

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
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
          <div id="google-signin-button" className="w-full"></div>

          {/* Features */}
          <div className="space-y-3 pt-4 border-t border-gray-700">
            <div className="flex items-center space-x-3 text-sm text-gray-400">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span>Live challenges and real-time updates</span>
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
