import { useState } from "react";
import { ClipboardList } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import toast from "react-hot-toast";
import Button from "../../components/common/Button";
import * as testService from "../../services/testService";

const emptyQuestion = { questionText: "", options: ["", "", "", ""], correctAnswer: "", type: "mcq", marks: 1 };

const CreateTest = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Aptitude");
  const [duration, setDuration] = useState(30);
  const [questions, setQuestions] = useState([{ ...emptyQuestion }]);
  const [saving, setSaving] = useState(false);

  const updateQuestion = (idx, field, value) => {
    const updated = [...questions];
    updated[idx][field] = value;
    setQuestions(updated);
  };

  const updateOption = (qIdx, optIdx, value) => {
    const updated = [...questions];
    updated[qIdx].options[optIdx] = value;
    setQuestions(updated);
  };

  const addQuestion = () => setQuestions([...questions, { ...emptyQuestion, options: [...emptyQuestion.options] }]);
  const removeQuestion = (idx) => setQuestions(questions.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await testService.createTest({ title, category, duration: Number(duration), questions });
      toast.success("Test created successfully!");
      setTitle("");
      setQuestions([{ ...emptyQuestion, options: [...emptyQuestion.options] }]);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create test");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <PageHeader icon={ClipboardList} title="Create Test" />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 space-y-4">
          <input
            required
            placeholder="Test Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
            >
              <option>Aptitude</option>
              <option>Coding</option>
              <option>Reasoning</option>
              <option>Technical</option>
            </select>
            <input
              type="number"
              min={1}
              placeholder="Duration (minutes)"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
            />
          </div>
        </div>

        {questions.map((q, idx) => (
          <div key={idx} className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 space-y-3">
            <div className="flex justify-between items-center">
              <p className="font-medium text-sm text-gray-500">Question {idx + 1}</p>
              {questions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeQuestion(idx)}
                  className="text-red-500 text-sm hover:text-red-600"
                >
                  Remove
                </button>
              )}
            </div>
            <input
              required
              placeholder="Question text"
              value={q.questionText}
              onChange={(e) => updateQuestion(idx, "questionText", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
            />

            <select
              value={q.type}
              onChange={(e) => updateQuestion(idx, "type", e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
            >
              <option value="mcq">MCQ</option>
              <option value="coding">Coding</option>
            </select>

            {q.type === "mcq" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {q.options.map((opt, optIdx) => (
                  <input
                    key={optIdx}
                    placeholder={`Option ${optIdx + 1}`}
                    value={opt}
                    onChange={(e) => updateOption(idx, optIdx, e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none text-sm"
                  />
                ))}
              </div>
            ) : null}

            <input
              required
              placeholder={q.type === "mcq" ? "Correct answer (must match one option)" : "Expected output"}
              value={q.correctAnswer}
              onChange={(e) => updateQuestion(idx, "correctAnswer", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none text-sm"
            />

            <input
              type="number"
              min={1}
              placeholder="Marks"
              value={q.marks}
              onChange={(e) => updateQuestion(idx, "marks", Number(e.target.value))}
              className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none text-sm"
            />
          </div>
        ))}

        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={addQuestion}>+ Add Question</Button>
          <Button type="submit" loading={saving}>Create Test</Button>
        </div>
      </form>
    </div>
  );
};

export default CreateTest;
