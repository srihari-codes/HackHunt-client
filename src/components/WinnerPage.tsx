import React, { useState, useEffect } from 'react';
import { Trophy, Crown, Medal, Users, Clock, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useEvent } from '../contexts/EventContext';

interface LeaderboardEntry {
  _id: string;
  name: string;
  email: string;
  score: number;
  completionTime?: number;
  challengesCompleted: number;
}

const WinnerPage: React.FC = () => {
  const { user } = useAuth();
  const { leaderboard: liveLeaderboard } = useEvent();
  const [finalLeaderboard, setFinalLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [userRank, setUserRank] = useState<number | null>(null);
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
      const response = await fetch('/api/results/status', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('ctf_token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setShowResults(data.resultsReleased);
        
        if (data.resultsReleased && data.leaderboard) {
          setFinalLeaderboard(data.leaderboard);
          
          // Find user's rank
          const rank = data.leaderboard.findIndex((entry: LeaderboardEntry) => 
            entry._id === user?._id
          ) + 1;
          setUserRank(rank || null);
        }
      }
    } catch (error) {
      console.error('Failed to check results status:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-8 h-8 text-yellow-400" />;
      case 2:
        return <Medal className="w-8 h-8 text-gray-300" />;
      case 3:
        return <Medal className="w-8 h-8 text-orange-400" />;
      default:
        return <Trophy className="w-6 h-6 text-gray-400" />;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400';
      case 2:
        return 'text-gray-300 bg-gray-300/10 border-gray-300';
      case 3:
        return 'text-orange-400 bg-orange-400/10 border-orange-400';
      default:
        return 'text-gray-400 bg-gray-800/30 border-gray-600';
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
                  <h3 className="text-lg font-bold text-green-400 mb-4">Your Performance</h3>
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
                The cyber elite have been ranked
              </p>
            </div>

            {/* User's Achievement Card */}
            {userRank && (
              <div className="cyber-card p-8 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-4">
                    {getRankIcon(userRank)}
                    <span className="ml-4 text-3xl font-bold text-cyan-400">
                      Your Final Ranking
                    </span>
                  </div>
                  
                  <div className={`inline-flex items-center px-6 py-3 rounded-full border ${getRankColor(userRank)} font-mono text-2xl font-bold`}>
                    #{userRank} of {finalLeaderboard.length}
                  </div>

                  <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-mono font-bold text-green-400">
                        {user?.score || 0}
                      </div>
                      <div className="text-sm text-gray-400">Points</div>
                    </div>
                    <div>
                      <div className="text-2xl font-mono font-bold text-pink-400">
                        {finalLeaderboard.find(entry => entry._id === user?._id)?.challengesCompleted || 0}
                      </div>
                      <div className="text-sm text-gray-400">Solved</div>
                    </div>
                    <div>
                      <div className="text-2xl font-mono font-bold text-cyan-400">
                        {finalLeaderboard.find(entry => entry._id === user?._id)?.completionTime 
                          ? formatTime(finalLeaderboard.find(entry => entry._id === user?._id)!.completionTime!)
                          : 'N/A'
                        }
                      </div>
                      <div className="text-sm text-gray-400">Time</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Final Leaderboard */}
            <div className="cyber-card p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-green-400 flex items-center">
                  <Users className="w-8 h-8 mr-3" />
                  HALL OF FAME
                </h2>
                <span className="text-gray-400 font-mono">
                  {finalLeaderboard.length} participants
                </span>
              </div>

              <div className="space-y-3">
                {finalLeaderboard.map((entry, index) => (
                  <div
                    key={entry._id}
                    className={`flex items-center justify-between p-4 rounded border ${
                      entry._id === user?._id 
                        ? 'bg-cyan-900/30 border-cyan-500' 
                        : getRankColor(index + 1)
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-12">
                        {getRankIcon(index + 1)}
                      </div>
                      
                      <div>
                        <div className="flex items-center space-x-3">
                          <span className="text-lg font-bold text-white">
                            {entry.name}
                          </span>
                          {entry._id === user?._id && (
                            <span className="text-xs bg-cyan-500 text-black px-2 py-1 rounded font-mono">
                              YOU
                            </span>
                          )}
                        </div>
                        {index < 3 && (
                          <div className="text-sm text-gray-400 font-mono mt-1">
                            {entry.challengesCompleted} challenges completed
                            {entry.completionTime && ` in ${formatTime(entry.completionTime)}`}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-mono font-bold text-green-400">
                        {entry.score}
                      </div>
                      <div className="text-sm text-gray-400">points</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Congratulations */}
            <div className="text-center cyber-card p-8">
              <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-green-400 mb-4">
                CYBER CHALLENGE COMPLETE
              </h3>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Thank you for participating in this elite cybersecurity challenge. 
                Your skills have been tested and your dedication recognized. 
                The future of digital security is in capable hands.
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