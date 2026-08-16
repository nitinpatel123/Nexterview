import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import toast from "react-hot-toast";
import Loader from "../../components/common/Loader";
import api from "../../services/api";

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    try {
      const { data } = await api.get("/admin/students");
      setStudents(data.data);
    } catch (err) {
      toast.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this student?")) return;
    try {
      await api.delete(`/admin/students/${id}`);
      toast.success("Student removed");
      setStudents((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      toast.error("Failed to remove student");
    }
  };

  if (loading) return <Loader text="Loading students..." />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <PageHeader icon={Users} title="Manage Students" />

      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Email</th>
              <th className="text-left px-4 py-3">ATS Score</th>
              <th className="text-left px-4 py-3">College</th>
              <th className="text-left px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s._id} className="border-t border-gray-100">
                <td className="px-4 py-3 font-medium">{s.name}</td>
                <td className="px-4 py-3 text-gray-500">{s.email}</td>
                <td className="px-4 py-3">{s.atsScore || 0}%</td>
                <td className="px-4 py-3 text-gray-500">{s.college || "-"}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleDelete(s._id)}
                    className="text-red-500 hover:text-red-600 font-medium"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-400">
                  No students found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageStudents;
