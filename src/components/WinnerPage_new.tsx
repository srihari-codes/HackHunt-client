import React, { useState, useEffect } from "react";
import { Trophy, Clock, Zap } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const WinnerPage: React.FC = () => {
  const { user } = useAuth();
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if results have been officially released
    checkResultsStatus();

    // Set up polling for result announcement
    const interval = setInterval(checkResultsStatus, 5000);

    return () => clearInterval(interval);
  }, []);

  const checkResultsStatus = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/results/status`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("ctf_token")}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setShowResults(data.resultsReleased);
      }
    } catch (error) {
      console.error("Failed to check results status:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="cyber-spinner mb-4"></div>
          <p className="text-cyan-400 font-mono">PROCESSING RESULTS...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="container mx-auto max-w-6xl">
        {!showResults ? (
          /* Waiting for Results */
          <div className="text-center">
            <div className="cyber-card p-12 max-w-2xl mx-auto">
              <div className="mb-8">
                <Clock className="w-20 h-20 text-cyan-400 mx-auto mb-6 animate-pulse" />
                <h1 className="text-4xl font-bold text-cyan-400 mb-4">
                  EVENT COMPLETED
                </h1>
                <p className="text-xl text-gray-400 font-mono">
                  Stand by for principal's announcement
                </p>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-900/50 p-6 rounded border border-cyan-500/30">
                  <h3 className="text-lg font-bold text-green-400 mb-4">
                    Your Performance
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-3xl font-mono font-bold text-cyan-400">
                        {user?.score || 0}
                      </div>
                      <div className="text-sm text-gray-400">Final Score</div>
                    </div>
                    <div>
                      <div className="text-3xl font-mono font-bold text-pink-400">
                        {user?.assignedQuestions?.length || 0}
                      </div>
                      <div className="text-sm text-gray-400">Challenges</div>
                    </div>
                  </div>
                </div>

                <div className="animate-pulse">
                  <div className="flex items-center justify-center space-x-2 text-yellow-400">
                    <Zap className="w-5 h-5" />
                    <span className="font-mono">Results being compiled...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Final Results */
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center">
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">
                FINAL RESULTS
              </h1>
              <p className="text-xl text-gray-400 font-mono">
                Challenge completed successfully!
              </p>
            </div>

            {/* User's Achievement Card */}
            <div className="cyber-card p-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <Trophy className="w-12 h-12 text-yellow-400" />
                  <span className="ml-4 text-3xl font-bold text-cyan-400">
                    Your Final Results
                  </span>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-mono font-bold text-green-400">
                      {user?.score || 0}
                    </div>
                    <div className="text-sm text-gray-400">Points</div>
                  </div>
                  <div>
                    <div className="text-2xl font-mono font-bold text-pink-400">
                      {user?.assignedQuestions?.length || 0}
                    </div>
                    <div className="text-sm text-gray-400">Challenges</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Congratulations */}
            <div className="text-center cyber-card p-8">
              <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-green-400 mb-4">
                CYBER CHALLENGE COMPLETE
              </h3>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Thank you for participating in this elite cybersecurity
                challenge. Your skills have been tested and your dedication
                recognized. The future of digital security is in capable hands.
              </p>

              <div className="mt-6 text-sm text-gray-500 font-mono">
                Event concluded • Results are final
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WinnerPage;
