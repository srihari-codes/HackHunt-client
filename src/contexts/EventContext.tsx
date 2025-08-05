import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface EventTimer {
  startTime: Date | null;
  endTime: Date | null;
  paused: boolean;
  currentTime: Date;
}

interface EventContextType {
  timer: EventTimer;
  timeRemaining: number;
  isEventActive: boolean;
  isEventStarted: boolean;
  leaderboard: any[];
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const useEvent = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error("useEvent must be used within an EventProvider");
  }
  return context;
};

interface EventProviderProps {
  children: ReactNode;
}

export const EventProvider: React.FC<EventProviderProps> = ({ children }) => {
  const [timer, setTimer] = useState<EventTimer>({
    startTime: null,
    endTime: null,
    paused: false,
    currentTime: new Date(),
  });
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    // Initialize polling for timer and leaderboard updates
    const fetchTimerData = async () => {
      try {
        const response = await fetch("/api/timer");
        if (response.ok) {
          const timerData = await response.json();
          setTimer((prevTimer) => ({
            ...prevTimer,
            ...timerData,
            currentTime: new Date(),
          }));
        }
      } catch (error) {
        console.error("Failed to fetch timer data:", error);
      }
    };

    const fetchLeaderboard = async () => {
      try {
        const response = await fetch("/api/leaderboard");
        if (response.ok) {
          const leaderboardData = await response.json();
          setLeaderboard(leaderboardData);
        }
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
      }
    };

    // Initial fetch
    fetchTimerData();
    fetchLeaderboard();

    // Set up polling intervals
    const timerInterval = setInterval(fetchTimerData, 2000); // Poll every 2 seconds
    const leaderboardInterval = setInterval(fetchLeaderboard, 5000); // Poll every 5 seconds

    // Cleanup on unmount
    return () => {
      clearInterval(timerInterval);
      clearInterval(leaderboardInterval);
    };
  }, []);

  // Calculate time remaining
  const timeRemaining = timer.endTime
    ? Math.max(
        0,
        new Date(timer.endTime).getTime() - timer.currentTime.getTime()
      )
    : 0;

  const isEventActive = timeRemaining > 0 && !timer.paused;
  const isEventStarted =
    !!timer.startTime && new Date(timer.startTime as Date) <= timer.currentTime;

  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => ({
        ...prevTimer,
        currentTime: new Date(),
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const value = {
    timer,
    timeRemaining,
    isEventActive,
    isEventStarted,
    leaderboard,
  };

  return (
    <EventContext.Provider value={value}>{children}</EventContext.Provider>
  );
};
