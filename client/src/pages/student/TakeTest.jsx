import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import * as testService from "../../services/testService";
import * as codeService from "../../services/codeService";

const TakeTest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [languages, setLanguages] = useState({}); // per-question selected language
  const [runOutputs, setRunOutputs] = useState({}); // per-question last run result
  const [running, setRunning] = useState({}); // per-question run-in-progress flag
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const load = async () => {
      try {
        const data = await testService.getTestById(id);
        setTest(data);
        setSecondsLeft(data.duration * 60);
        // default every coding question to JavaScript
        const defaultLangs = {};
        data.questions.forEach((q, idx) => {
          if (q.type === "coding") defaultLangs[idx] = "javascript";
        });
        setLanguages(defaultLangs);
      } catch {
        toast.error("Failed to load test");
        navigate("/tests");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, navigate]);

  const handleRunCode = async (idx, sampleInput) => {
    const code = answers[idx];
    if (!code?.trim()) return toast.error("Write some code first");

    setRunning({ ...running, [idx]: true });
    try {
      const res = await codeService.runCode(code, languages[idx], sampleInput || "");
      setRunOutputs({ ...runOutputs, [idx]: res });
    } catch (err) {
      toast.error(err.response?.data?.message || "Code execution failed");
    } finally {
      setRunning({ ...running, [idx]: false });
    }
  };

  const handleSubmit = useCallback(async () => {
    if (submitting || result) return;
    setSubmitting(true);
    try {
      const timeTaken = Math.round((Date.now() - startTime) / 1000);
      const formattedAnswers = Object.entries(answers).map(([questionIndex, submittedAnswer]) => ({
        questionIndex: Number(questionIndex),
        submittedAnswer,
        language: languages[questionIndex],
      }));
      const res = await testService.submitTest(id, formattedAnswers, timeTaken);
      setResult(res);
      toast.success("Test submitted!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  }, [answers, languages, id, startTime, submitting, result]);

  useEffect(() => {
    if (!test || result) return;
    if (secondsLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [secondsLeft, test, result, handleSubmit]);

  if (loading) return <Loader text="Loading test..." />;

  if (result) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-white border border-gray-100 rounded-2xl shadow-card p-8">
          <p className="text-4xl mb-2">🎉</p>
          <p className="font-display text-2xl font-semibold mb-1">
            You scored {result.score}/{result.totalMarks}
          </p>
          <p className="text-primary-600 font-tabular font-semibold text-lg mb-4">
            {result.percentage}%
          </p>
          <Button onClick={() => navigate("/tests")}>Back to Tests</Button>
        </div>
      </div>
    );
  }

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-xl font-semibold">{test.title}</h1>
        <span className="font-tabular text-sm bg-primary-50 text-primary-600 px-3 py-1 rounded-lg">
          ⏱ {mins}:{secs.toString().padStart(2, "0")}
        </span>
      </div>

      <div className="space-y-5">
        {test.questions.map((q, idx) => (
          <div key={idx} className="bg-white border border-gray-100 rounded-2xl shadow-card p-5">
            <p className="font-medium mb-3">
              {idx + 1}. {q.questionText}
            </p>

            {q.type === "coding" ? (
              <>
                {q.sampleInput && (
                  <div className="text-xs text-gray-500 mb-2 bg-gray-50 rounded-lg p-2 font-tabular">
                    <span className="font-semibold">Sample Input:</span> {q.sampleInput.replace(/\n/g, " ↵ ")}
                  </div>
                )}

                <select
                  value={languages[idx] || "javascript"}
                  onChange={(e) => setLanguages({ ...languages, [idx]: e.target.value })}
                  className="mb-2 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-400 focus:outline-none"
                >
                  {codeService.SUPPORTED_LANGUAGES.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </select>

                <textarea
                  rows={8}
                  value={answers[idx] || ""}
                  onChange={(e) => setAnswers({ ...answers, [idx]: e.target.value })}
                  className="w-full font-mono text-sm px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-400 focus:outline-none"
                  placeholder="Write a complete program that reads from stdin and prints to stdout..."
                />

                <div className="flex items-center gap-3 mt-2">
                  <Button
                    variant="outline"
                    onClick={() => handleRunCode(idx, q.sampleInput)}
                    loading={running[idx]}
                    className="text-xs px-4 py-1.5"
                  >
                    ▶ Run Code
                  </Button>
                  {runOutputs[idx] && (
                    <span className="text-xs text-gray-400">{runOutputs[idx].status}</span>
                  )}
                </div>

                {runOutputs[idx] && (
                  <div className="mt-2 bg-ink text-white rounded-xl p-3 text-xs font-mono space-y-1">
                    <p className="text-gray-400">Output:</p>
                    <pre className="whitespace-pre-wrap">{runOutputs[idx].stdout || "(no output)"}</pre>
                    {runOutputs[idx].stderr && (
                      <>
                        <p className="text-rose-400 mt-2">Error:</p>
                        <pre className="whitespace-pre-wrap text-rose-300">{runOutputs[idx].stderr}</pre>
                      </>
                    )}
                    {runOutputs[idx].compileOutput && (
                      <>
                        <p className="text-accent-400 mt-2">Compile Output:</p>
                        <pre className="whitespace-pre-wrap">{runOutputs[idx].compileOutput}</pre>
                      </>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-2">
                {q.options?.map((opt, i) => (
                  <label
                    key={i}
                    className={`flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer text-sm transition-colors ${
                      answers[idx] === opt
                        ? "border-primary-400 bg-primary-50"
                        : "border-gray-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`q-${idx}`}
                      checked={answers[idx] === opt}
                      onChange={() => setAnswers({ ...answers, [idx]: opt })}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <Button onClick={handleSubmit} loading={submitting} fullWidth className="mt-6">
        Submit Test
      </Button>
    </div>
  );
};

export default TakeTest;
