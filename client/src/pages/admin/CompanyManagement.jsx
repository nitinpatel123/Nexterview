import { useState, useEffect } from "react";
import { Building2 } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import toast from "react-hot-toast";
import Button from "../../components/common/Button";
import Loader from "../../components/common/Loader";
import * as companyService from "../../services/companyService";

const emptyForm = { name: "", industry: "", website: "", contactEmail: "", description: "" };

const CompanyManagement = () => {
  const [companies, setCompanies] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadCompanies = async () => {
    try {
      const data = await companyService.getCompanies();
      setCompanies(data);
    } catch {
      toast.error("Failed to load companies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await companyService.createCompany(form);
      toast.success("Company added!");
      setForm(emptyForm);
      loadCompanies();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add company");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this company?")) return;
    try {
      await companyService.deleteCompany(id);
      toast.success("Company removed");
      setCompanies((prev) => prev.filter((c) => c._id !== id));
    } catch {
      toast.error("Failed to remove company");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <PageHeader icon={Building2} title="Company Management" />

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 space-y-4 mb-8"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            required
            placeholder="Company Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
          />
          <input
            placeholder="Industry"
            value={form.industry}
            onChange={(e) => setForm({ ...form, industry: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
          />
          <input
            placeholder="Website"
            value={form.website}
            onChange={(e) => setForm({ ...form, website: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
          />
          <input
            placeholder="Contact Email"
            value={form.contactEmail}
            onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
          />
        </div>
        <textarea
          rows={2}
          placeholder="Short description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
        />
        <Button type="submit" loading={saving}>Add Company</Button>
      </form>

      {loading ? (
        <Loader text="Loading companies..." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {companies.map((c) => (
            <div key={c._id} className="bg-white border border-gray-100 rounded-xl shadow-sm p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">{c.name}</p>
                  <p className="text-sm text-gray-500">{c.industry}</p>
                </div>
                <button
                  onClick={() => handleDelete(c._id)}
                  className="text-red-500 text-sm hover:text-red-600"
                >
                  Remove
                </button>
              </div>
              {c.description && <p className="text-sm text-gray-500 mt-2">{c.description}</p>}
              {c.website && (
                <a
                  href={c.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 text-xs mt-2 inline-block hover:underline"
                >
                  {c.website}
                </a>
              )}
            </div>
          ))}
          {companies.length === 0 && (
            <p className="text-gray-400 text-sm col-span-2 text-center py-8">No companies added yet</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CompanyManagement;
