import React from 'react';
import { Clock, Pause, Play, AlertTriangle } from 'lucide-react';
import { useEvent } from '../contexts/EventContext';

const GlobalTimer: React.FC = () => {
  const { timer, timeRemaining, isEventActive, isEventStarted } = useEvent();

  const formatTime = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (!isEventActive) return 'text-red-400';
    if (timeRemaining < 300000) return 'text-yellow-400'; // Last 5 minutes
    return 'text-cyan-400';
  };

  const getTimerStatus = () => {
    if (!isEventStarted) return 'WAITING TO START';
    if (timer.paused) return 'PAUSED';
    if (timeRemaining <= 0) return 'EVENT OVER';
    return 'ACTIVE';
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-cyan-500/30">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Timer Display */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {timer.paused ? (
                <Pause className="w-5 h-5 text-yellow-400" />
              ) : timeRemaining <= 0 ? (
                <AlertTriangle className="w-5 h-5 text-red-400" />
              ) : (
                <Clock className="w-5 h-5 text-cyan-400" />
              )}
              <span className="text-sm font-mono text-gray-400">
                {getTimerStatus()}
              </span>
            </div>
            
            <div className={`text-2xl font-mono font-bold ${getTimerColor()}`}>
              {timeRemaining > 0 ? formatTime(timeRemaining) : '00:00:00'}
            </div>
          </div>

          {/* Event Info */}
          <div className="hidden md:flex items-center space-x-6 text-sm font-mono">
            {timer.startTime && (
              <div className="text-gray-400">
                Started: {new Date(timer.startTime).toLocaleTimeString()}
              </div>
            )}
            {timer.endTime && (
              <div className="text-gray-400">
                Ends: {new Date(timer.endTime).toLocaleTimeString()}
              </div>
            )}
          </div>

          {/* Status Indicator */}
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${
              isEventActive ? 'bg-green-400 animate-pulse' : 
              timer.paused ? 'bg-yellow-400' : 'bg-red-400'
            }`}></div>
            <span className="text-xs font-mono text-gray-400">
              {isEventActive ? 'LIVE' : timer.paused ? 'PAUSED' : 'ENDED'}
            </span>
          </div>
        </div>

        {/* Warning Banner */}
        {timeRemaining <= 0 && (
          <div className="mt-2 p-2 bg-red-900/50 border border-red-500 rounded text-center">
            <p className="text-red-400 font-mono text-sm font-bold">
              🚨 EVENT OVER - GAME'S UP! 🚨
            </p>
          </div>
        )}

        {timer.paused && (
          <div className="mt-2 p-2 bg-yellow-900/50 border border-yellow-500 rounded text-center">
            <p className="text-yellow-400 font-mono text-sm">
              ⏸️ Hold your horses! Event is paused by admin.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GlobalTimer;