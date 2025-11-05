import { X, Upload } from "lucide-react";
import { useState } from "react";
import { CompanyFormData } from "../types/company";
import { Button } from "flowbite-react";

interface AddCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CompanyFormData) => void;
}

export default function AddCompanyModal({
  isOpen,
  onClose,
  onSubmit,
}: AddCompanyModalProps) {
  const [formData, setFormData] = useState<CompanyFormData>({
    name: "",
    address: "",
    city: "",
    foundedOn: "",
    logo: null,
  });
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create FormData object for file upload
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("location", formData.address); // Backend expects 'location'
      formDataToSend.append("city", formData.city);
      formDataToSend.append("foundedOn", formData.foundedOn);

      // Append logo file if it exists
      if (formData.logo) {
        formDataToSend.append("logo", formData.logo);
      }

      // Send to backend
      const backendURL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${backendURL}/api/companies`, {
        method: "POST",
        body: formDataToSend,
        // Don't set Content-Type header - browser will set it automatically with boundary
      });

      if (!response.ok) {
        console.log(response);
        throw new Error("Failed to create company");
      }

      const savedCompany = await response.json();

      // Call parent onSubmit with the saved company data
      onSubmit(savedCompany);

      // Reset form
      setFormData({
        name: "",
        address: "",
        city: "",
        foundedOn: "",
        logo: null,
      });
      setLogoPreview(null);
      onClose();
    } catch (error) {
      console.error("Error creating company:", error);
      alert("Failed to create company. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setFormData({
        ...formData,
        logo: file,
      });

      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    setFormData({ ...formData, logo: null });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-center">
          <h2 className="text-2xl font-bold text-gray-900">Add Company</h2>
          <button
            onClick={onClose}
            className="absolute right-6 text-gray-500 hover:text-gray-700 transition-colors"
            disabled={isSubmitting}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Logo <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-4">
              {logoPreview ? (
                <div className="relative w-24 h-24 rounded-lg border-2 border-gray-300 overflow-hidden">
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    disabled={isSubmitting}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <label className="w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-600 transition-colors">
                  <Upload className="w-6 h-6 text-gray-400" />
                  <span className="text-xs text-gray-500 mt-1">Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="hidden"
                    required
                    disabled={isSubmitting}
                  />
                </label>
              )}
              <div className="flex-1 text-sm text-gray-600">
                Upload company logo (PNG, JPG, or SVG)
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="Enter company name"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Address <span className="text-red-500">*</span>
            </label>
            <textarea
              id="address"
              name="address"
              required
              value={formData.address}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent resize-none"
              placeholder="Enter full address"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="city"
              name="city"
              required
              value={formData.city}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="Enter city"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label
              htmlFor="foundedOn"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Founded On <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="foundedOn"
              name="foundedOn"
              required
              value={formData.foundedOn}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              disabled={isSubmitting}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="bg-gradient-to-br from-red-600 to-red-500 text-white hover:bg-gradient-to-bl focus:ring-blue-300 dark:focus:ring-blue-800 flex-1 px-4 py-2.5 rounded-lg"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-br from-purple-600 to-blue-500 text-white hover:bg-gradient-to-bl focus:ring-blue-300 dark:focus:ring-blue-800 flex-1 px-4 py-2.5 rounded-lg"
            >
              {isSubmitting ? "Adding..." : "Add Company"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
