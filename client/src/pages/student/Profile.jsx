import { useState, useEffect } from "react";
import { Award, UserCircle } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import toast from "react-hot-toast";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import * as studentService from "../../services/studentService";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [skillsInput, setSkillsInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [certTitle, setCertTitle] = useState("");
  const [certFile, setCertFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const loadProfile = async () => {
    try {
      const data = await studentService.getProfile();
      setProfile(data);
      setSkillsInput(data.skills?.join(", ") || "");
    } catch {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await studentService.updateProfile({
        ...profile,
        skills: skillsInput.split(",").map((s) => s.trim()).filter(Boolean),
      });
      setProfile(updated);
      toast.success("Profile updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCertUpload = async (e) => {
    e.preventDefault();
    if (!certFile) return toast.error("Please choose a file");
    setUploading(true);
    try {
      const certs = await studentService.uploadCertificate(certFile, certTitle || certFile.name);
      setProfile({ ...profile, certificates: certs });
      setCertTitle("");
      setCertFile(null);
      toast.success("Certificate uploaded!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleCertDelete = async (certId) => {
    try {
      const certs = await studentService.deleteCertificate(certId);
      setProfile({ ...profile, certificates: certs });
      toast.success("Certificate removed");
    } catch {
      toast.error("Failed to remove certificate");
    }
  };

  if (loading) return <Loader text="Loading profile..." />;

  if (!profile) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 mb-4">
          Couldn't load your profile. Please make sure you're logged in and try again.
        </p>
        <button
          onClick={loadProfile}
          className="text-primary-600 font-medium hover:underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <PageHeader icon={UserCircle} title="My Profile" />

      <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Name</label>
            <input
              value={profile.name || ""}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Email (read-only)</label>
            <input
              value={profile.email || ""}
              disabled
              className="w-full mt-1 px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg text-gray-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">College</label>
            <input
              value={profile.college || ""}
              onChange={(e) => setProfile({ ...profile, college: e.target.value })}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Branch</label>
            <input
              value={profile.branch || ""}
              onChange={(e) => setProfile({ ...profile, branch: e.target.value })}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Graduation Year</label>
            <input
              type="number"
              value={profile.graduationYear || ""}
              onChange={(e) => setProfile({ ...profile, graduationYear: e.target.value })}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Phone</label>
            <input
              value={profile.phone || ""}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Skills (comma separated)</label>
          <input
            value={skillsInput}
            onChange={(e) => setSkillsInput(e.target.value)}
            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
          />
        </div>
        <Button onClick={handleSave} loading={saving}>Save Profile</Button>
      </div>

      {/* Certificates */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 mt-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Award size={18} className="text-primary-500" /> Certificates</h2>

        <form onSubmit={handleCertUpload} className="flex flex-wrap gap-3 mb-5">
          <input
            placeholder="Certificate title"
            value={certTitle}
            onChange={(e) => setCertTitle(e.target.value)}
            className="flex-1 min-w-[150px] px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
          />
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => setCertFile(e.target.files[0])}
            className="text-sm"
          />
          <Button type="submit" loading={uploading}>Upload</Button>
        </form>

        <div className="space-y-2">
          {profile.certificates?.length > 0 ? (
            profile.certificates.map((cert) => (
              <div
                key={cert._id}
                className="flex items-center justify-between border border-gray-100 rounded-lg px-4 py-2"
              >
                <a
                  href={cert.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 text-sm font-medium hover:underline"
                >
                  {cert.title}
                </a>
                <button
                  onClick={() => handleCertDelete(cert._id)}
                  className="text-red-500 text-sm hover:text-red-600"
                >
                  Remove
                </button>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-400">No certificates uploaded yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
