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
  status?: string;
  timeRemaining?: number;
}

interface EventContextType {
  timer: EventTimer;
  timeRemaining: number;
  isEventActive: boolean;
  isEventStarted: boolean;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

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

  useEffect(() => {
    // Initialize polling for timer updates
    const API_BASE_URL =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

    // Get polling interval from environment variables
    const TIMER_POLL_INTERVAL = parseInt(
      import.meta.env.VITE_TIMER_POLL_INTERVAL || "2000"
    );

    const fetchTimerData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/timer`);
        if (response.ok) {
          const data = await response.json();
          // Handle the nested timer structure from the API response
          const timerData = data.success ? data.timer : data;
          setTimer((prevTimer) => ({
            ...prevTimer,
            startTime: timerData.startTime
              ? new Date(timerData.startTime)
              : null,
            endTime: timerData.endTime ? new Date(timerData.endTime) : null,
            paused: timerData.paused || false,
            currentTime: new Date(),
            status: timerData.status,
            timeRemaining: timerData.timeRemaining,
          }));
        }
      } catch (error) {
        console.error("Failed to fetch timer data:", error);
      }
    };

    // Initial fetch
    fetchTimerData();

    // Set up polling interval using environment variable
    const timerInterval = setInterval(fetchTimerData, TIMER_POLL_INTERVAL);

    // Cleanup on unmount
    return () => {
      clearInterval(timerInterval);
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
    !!timer.startTime &&
    new Date(timer.startTime).getTime() <= timer.currentTime.getTime();

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
  };

  return (
    <EventContext.Provider value={value}>{children}</EventContext.Provider>
  );
};

// Export the hook separately to avoid Fast Refresh issues
export const useEvent = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error("useEvent must be used within an EventProvider");
  }
  return context;
};
