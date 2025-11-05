import { useState, useEffect } from "react";
import { Star, MapPin } from "lucide-react";
import { AddReviewModal } from "../components/AddReviewModal";
import { useParams } from "react-router-dom";
import { Button } from "flowbite-react";

interface Company {
  id: string;
  name: string;
  address: string;
  city: string;
  foundedOn: string;
  registrationDate?: string;
  rating: number;
  reviewCount: number;
  logo: string;
  logoColor: string;
}

interface Review {
  id: string;
  name: string;
  date: string;
  time: string;
  rating: number;
  text: string;
  avatar: string;
}

function ReviewsList() {
  const { companyId } = useParams<{ companyId: string }>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [company, setCompany] = useState<Company | null>(null);
  const [sortBy, setSortBy] = useState("newest");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const backendURL = import.meta.env.VITE_API_URL;

  // Fetch company details
  const fetchCompany = async () => {
    try {
      const response = await fetch(`${backendURL}/api/companies/${companyId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch company details");
      }

      const data = await response.json();

      console.log(data);

      const transformedCompany: Company = {
        id: data._id,
        name: data.name,
        address: data.location,
        city: data.city,
        foundedOn: new Date(data.foundedOn)
          .toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
          .replace(/\//g, "-"),
        rating: data.averageRating || 0,
        reviewCount: data.totalReviews || 0,
        logo: data.logo
          ? `${backendURL}${data.logo}`
          : data.name.charAt(0).toUpperCase(),
        logoColor: data.logoColor || "bg-slate-900",
      };

      setCompany(transformedCompany);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching company:", err);
    }
  };

  // Fetch reviews
  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (sortBy) {
        params.append("sortBy", sortBy === "newest" ? "" : sortBy);
      }

      const response = await fetch(
        `${backendURL}/api/reviews/company/${companyId}?${params.toString()}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }

      const data = await response.json();

      const transformedReviews: Review[] = data.map((review: any) => ({
        id: review._id,
        name: review.fullName,
        date: new Date(review.createdAt)
          .toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
          .replace(/\//g, "-"),
        time: new Date(review.createdAt).toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        rating: review.rating,
        text: review.reviewText,
        avatar:
          "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400",
      }));

      setReviews(transformedReviews);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching reviews:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    if (companyId) {
      fetchCompany();
      fetchReviews();
    }
  }, [companyId]);

  // Refetch reviews when sort changes
  useEffect(() => {
    if (companyId) {
      fetchReviews();
    }
  }, [sortBy]);

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative w-5 h-5">
            <Star className="w-5 h-5 text-yellow-400 absolute" />
            <div className="overflow-hidden absolute w-1/2">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            </div>
          </div>
        );
      } else {
        stars.push(<Star key={i} className="w-5 h-5 text-yellow-400" />);
      }
    }
    return stars;
  };

  const handleAddReview = async (reviewData: {
    full_name: string;
    subject: string;
    review_text: string;
    rating: number;
  }) => {
    try {
      const response = await fetch(`${backendURL}/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyId: companyId,
          fullName: reviewData.full_name,
          subject: reviewData.subject,
          reviewText: reviewData.review_text,
          rating: reviewData.rating,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit review");
      }

      // Refresh reviews and company details after successful submission
      await fetchReviews();
      await fetchCompany();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error submitting review:", err);
      alert("Failed to submit review. Please try again.");
    }
  };

  if (isLoading && !company) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error && !company) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          <p className="font-medium">Error loading data</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Company not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg p-8 mb-6">
          {/* ⬅ Responsive fix starts here */}
          <div className="flex flex-col sm:flex-row gap-6 mb-6 sm:items-start">
            {/* Logo */}
            {typeof company.logo === "string" &&
            company.logo.startsWith("http") ? (
              <img
                src={company.logo}
                alt={company.name}
                className="w-20 h-20 rounded-lg object-cover flex-shrink-0 mx-auto sm:mx-0"
              />
            ) : (
              <div
                className={`w-20 h-20 ${company.logoColor} rounded-lg flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0`}
              >
                <span className="text-3xl font-bold text-white">
                  {company.logo}
                </span>
              </div>
            )}

            {/* Company details */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {company.name}
              </h1>
              <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-600 mb-3">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{company.address}</span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-2 sm:mb-0">
                  <span className="text-2xl font-bold text-gray-900">
                    {company.rating.toFixed(1)}
                  </span>
                  <div className="flex gap-1">
                    {renderStars(company.rating)}
                  </div>
                </div>
                <span className="text-gray-600 font-medium text-sm sm:text-base">
                  {company.reviewCount} Reviews
                </span>
              </div>
            </div>

            {/* Founded & Button Section */}
            <div className="flex flex-col items-center sm:items-end text-center sm:text-right mt-4 sm:mt-0">
              <p className="text-sm text-gray-600 mb-2 sm:mb-4">
                Founded on {company.foundedOn}
              </p>
              <Button
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-br from-purple-600 to-blue-500 text-white hover:bg-gradient-to-bl focus:ring-blue-300 dark:focus:ring-blue-800 px-5 py-2.5 rounded-lg text-sm sm:text-base"
              >
                + Add Review
              </Button>
            </div>
          </div>
          {/* ⬅ Responsive fix ends here */}
        </div>

        <div className="bg-gray-50 px-6 py-3 rounded-lg mb-4 flex items-center justify-between">
          <p className="text-gray-700 font-medium">
            Result Found: {reviews.length}
          </p>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-600 bg-white text-sm"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="rating">Highest Rating</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white rounded-lg p-6">
                  <div className="flex gap-4 mb-4">
                    <img
                      src={review.avatar}
                      alt={review.name}
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                    />

                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {review.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {review.date}, {review.time}
                      </p>
                    </div>

                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-gray-700 leading-relaxed">{review.text}</p>
                </div>
              ))}
            </div>

            {reviews.length === 0 && !error && (
              <div className="text-center py-12 bg-white rounded-lg">
                <p className="text-gray-500 text-lg">No reviews yet</p>
                <p className="text-gray-400 text-sm mt-2">
                  Be the first to review this company!
                </p>
              </div>
            )}
          </>
        )}

        <AddReviewModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddReview}
        />
      </div>
    </div>
  );
}

export default ReviewsList;
