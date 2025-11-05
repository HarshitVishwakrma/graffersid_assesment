import { useState, useEffect } from "react";
import { MapPin, Plus, Search } from "lucide-react";
import CompanyCard from "../components/CompanyCard";
import AddCompanyModal from "../components/AddCompanyModal";
import { Company } from "../types/company";
import { Button } from "flowbite-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function CompanyList() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Fetch companies from backend
  const fetchCompanies = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();

      if (searchQuery.trim()) params.append("search", searchQuery.trim());
      if (selectedCity.trim()) params.append("city", selectedCity.trim());
      if (sortBy) params.append("sortBy", sortBy);

      const response = await fetch(
        `${API_BASE_URL}/api/companies?${params.toString()}`
      );
      if (!response.ok) throw new Error("Failed to fetch companies");

      const data = await response.json();

      const transformedCompanies = data.map((company: any) => ({
        id: company._id,
        name: company.name,
        address: company.location,
        city: company.city,
        foundedOn: new Date(company.foundedOn)
          .toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
          .replace(/\//g, "-"),
        rating: company.averageRating || 0,
        reviewCount: company.totalReviews || 0,
        // ✅ Safe logo handling
        logo: company.logo
          ? `${API_BASE_URL}${
              company.logo.startsWith("/") ? company.logo : "/" + company.logo
            }`
          : `https://via.placeholder.com/100?text=${company.name
              .charAt(0)
              .toUpperCase()}`,
        logoColor:
          company.logoColor ||
          `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      }));

      console.log(
        "Company logos:",
        transformedCompanies.map((c: { logo: string }) => c.logo)
      );
      setCompanies(transformedCompanies);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching companies:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    fetchCompanies();
  }, [sortBy]);

  const handleAddCompany = async () => {
    await fetchCompanies();
  };

  const handleFindCompany = () => {
    fetchCompanies();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") fetchCompanies();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* 🔍 Search input */}
            <div className="flex-1 w-full lg:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Companies
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-600" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Search by name, location, or city..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
              </div>
            </div>

            {/* 📍 City filter */}
            <div className="flex-1 w-full lg:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by City
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-600" />
                <input
                  type="text"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter city name..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
              </div>
            </div>

            {/* 🔘 Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto lg:pt-7">
              <Button
                onClick={handleFindCompany}
                disabled={isLoading}
                className="bg-gradient-to-br from-purple-600 to-blue-500 text-white hover:bg-gradient-to-bl focus:ring-blue-300 dark:focus:ring-blue-800 px-6 py-2.5 rounded-lg"
              >
                {isLoading ? "Searching..." : "Find Company"}
              </Button>
              <Button
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-br from-purple-600 to-blue-500 text-white hover:bg-gradient-to-bl focus:ring-blue-300 dark:focus:ring-blue-800 px-6 py-2.5 rounded-lg"
              >
                <Plus className="w-5 h-5" />
                Add Company
              </Button>
            </div>

            {/* 🔽 Sort */}
            <div className="w-full sm:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By:
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full sm:w-48 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent bg-white"
              >
                <option value="name">Name</option>
                <option value="rating">Rating</option>
                <option value="">Newest First</option>
              </select>
            </div>
          </div>
        </div>

        {/* 📊 Result Count */}
        <div className="mb-4">
          <p className="text-gray-600">
            Results Found:{" "}
            <span className="font-semibold">{companies.length}</span>
          </p>
        </div>

        {/* ⚠️ Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            <p className="font-medium">Error loading companies</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* 🌀 Loading or content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {companies.map((company) => (
                <CompanyCard key={company.id} company={company} />
              ))}
            </div>

            {companies.length === 0 && !error && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No companies found</p>
                <p className="text-gray-400 text-sm mt-2">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </>
        )}
      </main>

      <AddCompanyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddCompany}
      />
    </div>
  );
}
