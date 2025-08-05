import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Trophy, Clock, Zap } from "lucide-react";
import { useEvent } from "../contexts/EventContext";
import { useAuth } from "../contexts/AuthContext";

const WaitingRoom: React.FC = () => {
  const navigate = useNavigate();
  const { timer, timeRemaining, isEventActive, isEventStarted, leaderboard } =
    useEvent();
  const { user } = useAuth();
  const [showInstructions, setShowInstructions] = useState(true);

  useEffect(() => {
    // Auto-redirect to challenge when event starts
    if (isEventStarted && timeRemaining > 0 && !timer.paused) {
      const redirectTimer = setTimeout(() => {
        navigate("/challenge");
      }, 2000); // 2 second delay for dramatic effect

      return () => clearTimeout(redirectTimer);
    }
  }, [isEventStarted, timeRemaining, timer.paused, navigate]);

  const formatTime = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-pink-500 to-green-400 bg-clip-text text-transparent">
            CYBER ARENA
          </h1>
          <p className="text-xl text-gray-400 font-mono">
            Welcome, <span className="text-cyan-400">{user?.name}</span>
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Countdown Section */}
          <div className="cyber-card p-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-6">
                <Clock className="w-12 h-12 text-cyan-400 mr-4" />
                <h2 className="text-3xl font-bold text-cyan-400">
                  {isEventStarted ? "EVENT LIVE" : "STARTING IN"}
                </h2>
              </div>

              {!isEventStarted && timer.startTime ? (
                <div className="text-6xl font-mono font-bold text-green-400 mb-4 animate-pulse">
                  {formatTime(
                    new Date(timer.startTime).getTime() - new Date().getTime()
                  )}
                </div>
              ) : isEventStarted ? (
                <div className="space-y-4">
                  <div className="text-4xl font-bold text-green-400 animate-pulse">
                    🚀 LAUNCHING...
                  </div>
                  <p className="text-gray-400">Redirecting to challenges...</p>
                </div>
              ) : (
                <div className="text-2xl text-yellow-400">
                  Waiting for admin to start event...
                </div>
              )}

              {timer.paused && (
                <div className="mt-4 p-4 bg-yellow-900/30 border border-yellow-500 rounded">
                  <p className="text-yellow-400 font-mono">
                    ⏸️ Event paused by administrator
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="cyber-card p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-pink-400">
                MISSION BRIEFING
              </h3>
              <button
                onClick={() => setShowInstructions(!showInstructions)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {showInstructions ? "▼" : "▶"}
              </button>
            </div>

            {showInstructions && (
              <div className="space-y-4 text-sm">
                <div className="flex items-start space-x-3">
                  <Zap className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-gray-300 font-semibold">
                      Challenge System
                    </p>
                    <p className="text-gray-400">
                      Each participant gets unique challenges. No two hackers
                      face the same puzzle.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Trophy className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-gray-300 font-semibold">
                      Scoring System
                    </p>
                    <p className="text-gray-400">
                      Correct answers earn points. Hints cost points. Choose
                      wisely.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-gray-300 font-semibold">Time Pressure</p>
                    <p className="text-gray-400">
                      Global timer is ticking. When it hits zero, all inputs
                      lock down.
                    </p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-red-900/30 border border-red-500 rounded">
                  <p className="text-red-400 font-mono text-xs">
                    <strong>WARNING:</strong> Wrong answers allow infinite
                    retries. No mercy until you crack the code!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Current Leaderboard Preview */}
        {leaderboard.length > 0 && (
          <div className="mt-8 cyber-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-green-400 flex items-center">
                <Users className="w-6 h-6 mr-2" />
                LEADERBOARD
              </h3>
              <span className="text-sm text-gray-400 font-mono">
                {leaderboard.length} operatives active
              </span>
            </div>

            <div className="space-y-2">
              {leaderboard.slice(0, 5).map((player, index) => (
                <div
                  key={player._id}
                  className={`flex items-center justify-between p-3 rounded ${
                    player._id === user?._id
                      ? "bg-cyan-900/30 border border-cyan-500"
                      : "bg-gray-800/30"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span
                      className={`font-mono font-bold ${
                        index === 0
                          ? "text-yellow-400"
                          : index === 1
                          ? "text-gray-300"
                          : index === 2
                          ? "text-orange-400"
                          : "text-gray-400"
                      }`}
                    >
                      #{index + 1}
                    </span>
                    <span className="text-white">{player.name}</span>
                    {player._id === user?._id && (
                      <span className="text-xs text-cyan-400 font-mono">
                        (YOU)
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-green-400">
                    {player.score}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WaitingRoom;
