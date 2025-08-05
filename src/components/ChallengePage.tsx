import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Flag,
  HelpCircle,
  SkipForward,
  Trophy,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { useEvent } from "../contexts/EventContext";
import { useAuth } from "../contexts/AuthContext";

interface Challenge {
  _id: string;
  text: string;
  hints: string[];
  pointValue: number;
  penalties: {
    hint: number;
    skip: number;
  };
}

interface HintState {
  unlocked: boolean;
  used: boolean;
}

const ChallengePage: React.FC = () => {
  const navigate = useNavigate();
  const { timeRemaining, isEventActive } = useEvent();
  const { user } = useAuth();

  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(
    null
  );
  const [answer, setAnswer] = useState("");
  const [hints, setHints] = useState<HintState[]>([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmHint, setConfirmHint] = useState<number | null>(null);
  const [confirmSkip, setConfirmSkip] = useState(false);

  useEffect(() => {
    if (!isEventActive) {
      navigate("/winner");
      return;
    }

    loadNextChallenge();
  }, [isEventActive, navigate]);

  const loadNextChallenge = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/challenges/next`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("ctf_token")}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Handle the nested challenge structure from the API response
        const challenge = data.success ? data.challenge : data;
        setCurrentChallenge(challenge);
        setHints(
          challenge.hints?.map(() => ({ unlocked: false, used: false })) || []
        );
        setAnswer("");
        setFeedback(null);
      } else if (response.status === 404) {
        // No more challenges
        navigate("/winner");
      } else {
        throw new Error("Failed to load challenge");
      }
    } catch (error) {
      setFeedback({
        type: "error",
        message: "Failed to load challenge. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!currentChallenge || !answer.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/challenges/${
          currentChallenge._id
        }/validate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("ctf_token")}`,
          },
          body: JSON.stringify({ flag: answer.trim() }),
        }
      );

      const result = await response.json();

      if (result.correct) {
        setFeedback({
          type: "success",
          message: `Correct! +${currentChallenge.pointValue} points ${
            result.deduction ? `(${result.deduction} penalty applied)` : ""
          }`,
        });

        // Load next challenge after a short delay
        setTimeout(() => {
          loadNextChallenge();
        }, 2000);
      } else {
        setFeedback({
          type: "error",
          message: "Incorrect flag. Try again - no mercy until you crack it!",
        });
        setAnswer("");
      }
    } catch (error) {
      setFeedback({
        type: "error",
        message: "Network error. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestHint = async (hintIndex: number) => {
    if (!currentChallenge || hints[hintIndex].unlocked) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/challenges/${
          currentChallenge._id
        }/hint`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("ctf_token")}`,
          },
          body: JSON.stringify({
            confirm: "confirm",
            hintIndex,
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();

        setHints((prev) =>
          prev.map((hint, index) =>
            index === hintIndex ? { ...hint, unlocked: true, used: true } : hint
          )
        );

        setFeedback({
          type: "info",
          message: `Hint unlocked! -${currentChallenge.penalties.hint} points`,
        });
      } else {
        throw new Error("Failed to unlock hint");
      }
    } catch (error) {
      setFeedback({
        type: "error",
        message: "Failed to unlock hint. Please try again.",
      });
    } finally {
      setConfirmHint(null);
    }
  };

  const handleSkipChallenge = async () => {
    if (!currentChallenge) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/challenges/${
          currentChallenge._id
        }/skip`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("ctf_token")}`,
          },
        }
      );

      if (response.ok) {
        setFeedback({
          type: "info",
          message: `Challenge skipped. 0 points awarded.`,
        });

        setTimeout(() => {
          loadNextChallenge();
        }, 1500);
      }
    } catch (error) {
      setFeedback({ type: "error", message: "Failed to skip challenge." });
    } finally {
      setConfirmSkip(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="cyber-spinner mb-4"></div>
          <p className="text-cyan-400 font-mono">LOADING CHALLENGE...</p>
        </div>
      </div>
    );
  }

  if (!currentChallenge) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-green-400 mb-2">
            ALL CHALLENGES COMPLETED!
          </h2>
          <p className="text-gray-400">Redirecting to results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Challenge Header */}
        <div className="cyber-card p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Flag className="w-8 h-8 text-cyan-400" />
              <div>
                <h1 className="text-3xl font-bold text-cyan-400">CHALLENGE</h1>
                <p className="text-gray-400 font-mono">
                  Worth {currentChallenge.pointValue} points
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-2xl font-mono font-bold text-green-400">
                {user?.score || 0}
              </div>
              <div className="text-sm text-gray-400">Your Score</div>
            </div>
          </div>

          {/* Challenge Text */}
          <div className="bg-gray-900/50 p-6 rounded border border-cyan-500/30 mb-6">
            <pre className="text-green-400 font-mono text-lg whitespace-pre-wrap leading-relaxed">
              {currentChallenge.text}
            </pre>
          </div>

          {/* Answer Input */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-mono text-gray-400 mb-2">
                ENTER FLAG:
              </label>
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSubmitAnswer()}
                  disabled={isSubmitting || timeRemaining <= 0}
                  placeholder="flag{...}"
                  className="flex-1 cyber-input font-mono"
                />
                <button
                  onClick={handleSubmitAnswer}
                  disabled={
                    isSubmitting || !answer.trim() || timeRemaining <= 0
                  }
                  className="cyber-btn cyber-btn-primary px-8 flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="cyber-spinner-sm"></div>
                      <span>VALIDATING...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>SUBMIT</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Feedback */}
            {feedback && (
              <div className={`cyber-alert cyber-alert-${feedback.type}`}>
                {feedback.type === "success" && (
                  <CheckCircle className="w-5 h-5" />
                )}
                {feedback.type === "error" && (
                  <AlertTriangle className="w-5 h-5" />
                )}
                {feedback.type === "info" && <HelpCircle className="w-5 h-5" />}
                <span>{feedback.message}</span>
              </div>
            )}
          </div>
        </div>

        {/* Hints Section */}
        <div className="cyber-card p-8 mb-6">
          <h3 className="text-xl font-bold text-pink-400 mb-6 flex items-center">
            <HelpCircle className="w-6 h-6 mr-2" />
            INTELLIGENCE SUPPORT
          </h3>

          <div className="grid gap-4">
            {currentChallenge?.hints?.map((hint, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setConfirmHint(index)}
                    disabled={hints[index].unlocked || timeRemaining <= 0}
                    className={`flex items-center space-x-2 px-4 py-2 rounded border font-mono text-sm ${
                      hints[index].unlocked
                        ? "bg-green-900/30 border-green-500 text-green-400 cursor-default"
                        : "bg-gray-800 border-gray-600 text-gray-400 hover:border-yellow-400 hover:text-yellow-400"
                    }`}
                  >
                    <HelpCircle className="w-4 h-4" />
                    <span>
                      HINT {index + 1}{" "}
                      {!hints[index].unlocked &&
                        `(-${currentChallenge.penalties.hint} pts)`}
                    </span>
                  </button>
                </div>

                {hints[index].unlocked && (
                  <div className="bg-yellow-900/20 border border-yellow-500/30 p-4 rounded">
                    <p className="text-yellow-300 font-mono text-sm">{hint}</p>
                  </div>
                )}

                {/* Hint Confirmation Modal */}
                {confirmHint === index && (
                  <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                    <div className="cyber-card p-6 max-w-md">
                      <h4 className="text-lg font-bold text-yellow-400 mb-4">
                        CONFIRM HINT REQUEST
                      </h4>
                      <p className="text-gray-300 mb-4">
                        This will cost you{" "}
                        <span className="text-red-400 font-bold">
                          {currentChallenge.penalties.hint} points
                        </span>
                        . Continue?
                      </p>
                      <div className="flex space-x-4">
                        <button
                          onClick={() => handleRequestHint(index)}
                          className="cyber-btn cyber-btn-primary flex-1"
                        >
                          CONFIRM
                        </button>
                        <button
                          onClick={() => setConfirmHint(null)}
                          className="cyber-btn cyber-btn-secondary flex-1"
                        >
                          CANCEL
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Skip Option */}
        <div className="cyber-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-bold text-red-400 mb-2">
                EMERGENCY SKIP
              </h4>
              <p className="text-gray-400 text-sm">
                Give up on this challenge for 0 points and move to the next one.
              </p>
            </div>
            <button
              onClick={() => setConfirmSkip(true)}
              disabled={timeRemaining <= 0}
              className="cyber-btn cyber-btn-danger flex items-center space-x-2"
            >
              <SkipForward className="w-5 h-5" />
              <span>SKIP</span>
            </button>
          </div>

          {/* Skip Confirmation Modal */}
          {confirmSkip && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
              <div className="cyber-card p-6 max-w-md">
                <h4 className="text-lg font-bold text-red-400 mb-4">
                  CONFIRM SKIP
                </h4>
                <p className="text-gray-300 mb-4">
                  Are you sure you want to skip this challenge? You'll receive
                  <span className="text-red-400 font-bold"> 0 points</span>.
                </p>
                <div className="flex space-x-4">
                  <button
                    onClick={handleSkipChallenge}
                    className="cyber-btn cyber-btn-danger flex-1"
                  >
                    SKIP CHALLENGE
                  </button>
                  <button
                    onClick={() => setConfirmSkip(false)}
                    className="cyber-btn cyber-btn-secondary flex-1"
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChallengePage;
