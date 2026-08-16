import { useState, useRef, useEffect } from "react";
import { Mic, FileText as FileTextIcon } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import toast from "react-hot-toast";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import * as aiService from "../../services/aiService";

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const speechSupported = !!SpeechRecognition;

const MockInterview = () => {
  const [role, setRole] = useState("Software Engineer");
  const [type, setType] = useState("technical");
  const [mode, setMode] = useState("text"); // "text" | "voice"
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [loadingQ, setLoadingQ] = useState(false);
  const [loadingEval, setLoadingEval] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!speechSupported) return;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setAnswer(transcript);
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
  }, []);

  const speakQuestion = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return toast.error("Voice input not supported in this browser");
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setAnswer("");
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const startInterview = async () => {
    setLoadingQ(true);
    setFeedback(null);
    setCurrent(0);
    try {
      const result = await aiService.getInterviewQuestions(role, type, 5);
      setQuestions(result.questions || []);
      if (mode === "voice" && result.questions?.[0]) {
        setTimeout(() => speakQuestion(result.questions[0].question), 400);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to generate questions");
    } finally {
      setLoadingQ(false);
    }
  };

  const submitAnswer = async () => {
    if (!answer.trim()) return toast.error("Please write or speak an answer first");
    if (isListening) recognitionRef.current?.stop();
    setLoadingEval(true);
    try {
      const result = await aiService.evaluateAnswer(questions[current].question, answer, role, type);
      setFeedback(result);
    } catch (err) {
      toast.error(err.response?.data?.message || "Evaluation failed");
    } finally {
      setLoadingEval(false);
    }
  };

  const nextQuestion = () => {
    setAnswer("");
    setFeedback(null);
    const nextIdx = current + 1;
    setCurrent(nextIdx);
    if (mode === "voice" && questions[nextIdx]) {
      setTimeout(() => speakQuestion(questions[nextIdx].question), 400);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <PageHeader icon={Mic} title="AI Mock Interview" subtitle="Practice interview questions and get instant AI feedback" />

      {questions.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Target Role</label>
            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Interview Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
            >
              <option value="technical">Technical</option>
              <option value="hr">HR</option>
              <option value="behavioral">Behavioral</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Mode</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setMode("text")}
                className={`px-4 py-2 rounded-lg text-sm font-medium border ${
                  mode === "text" ? "bg-primary-500 text-white border-primary-500" : "border-gray-300 text-gray-600"
                }`}
              >
                <span className="inline-flex items-center gap-1"><FileTextIcon size={14}/> Text</span>
              </button>
              <button
                type="button"
                onClick={() => setMode("voice")}
                disabled={!speechSupported}
                className={`px-4 py-2 rounded-lg text-sm font-medium border disabled:opacity-40 ${
                  mode === "voice" ? "bg-primary-500 text-white border-primary-500" : "border-gray-300 text-gray-600"
                }`}
              >
                🎙️ Voice
              </button>
            </div>
            {!speechSupported && (
              <p className="text-xs text-gray-400 mt-1">
                Voice mode needs Chrome/Edge — not supported in this browser.
              </p>
            )}
          </div>
          <Button onClick={startInterview} loading={loadingQ} fullWidth>
            Start Interview
          </Button>
        </div>
      ) : current >= questions.length ? (
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 text-center">
          <p className="text-xl font-semibold mb-2">🎉 Interview Complete!</p>
          <p className="text-gray-500 mb-4">You answered all {questions.length} questions.</p>
          <Button onClick={() => setQuestions([])}>Start New Interview</Button>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">
              Question {current + 1} of {questions.length}
            </p>
            {mode === "voice" && (
              <button
                onClick={() => speakQuestion(questions[current].question)}
                className="text-primary-600 text-sm hover:underline"
              >
                🔊 Replay
              </button>
            )}
          </div>
          <p className="text-lg font-medium">{questions[current].question}</p>

          {mode === "voice" && (
            <button
              type="button"
              onClick={toggleListening}
              disabled={!!feedback}
              className={`w-full py-3 rounded-lg font-medium text-sm ${
                isListening
                  ? "bg-red-500 text-white animate-pulse"
                  : "bg-primary-50 text-primary-600 border border-primary-200"
              }`}
            >
              {isListening ? "🔴 Listening... tap to stop" : "🎙️ Tap to speak your answer"}
            </button>
          )}

          <textarea
            rows={5}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
            placeholder={mode === "voice" ? "Your speech will appear here (editable)..." : "Type your answer here..."}
            disabled={!!feedback}
          />

          {!feedback ? (
            <Button onClick={submitAnswer} loading={loadingEval}>Submit Answer</Button>
          ) : (
            <div className="border-t pt-4 space-y-2">
              <p className="font-semibold text-primary-600">Score: {feedback.score}/10</p>
              <p className="text-sm text-gray-600">{feedback.feedback}</p>
              <p className="text-sm text-gray-500 italic">💡 {feedback.improvedAnswer}</p>
              <Button onClick={nextQuestion} className="mt-2">
                {current + 1 === questions.length ? "Finish" : "Next Question"}
              </Button>
            </div>
          )}
        </div>
      )}

      {loadingQ && <Loader text="Generating your interview questions..." />}
    </div>
  );
};

export default MockInterview;
