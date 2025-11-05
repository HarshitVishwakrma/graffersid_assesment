import { Star, User } from 'lucide-react';
import { Review } from '../types/review';

interface ReviewsListProps {
  reviews: Review[];
}

export function ReviewList({ reviews }: ReviewsListProps) {
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-5 h-5 ${
            i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
          }`}
        />
      );
    }
    return stars;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}-${month}-${year}, ${hours}:${minutes}`;
  };

  if (reviews.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <p className="text-gray-500 text-center">No reviews yet. Be the first to add one!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 px-6 py-3 rounded-lg">
        <p className="text-gray-700 font-medium">Result Found: {reviews.length}</p>
      </div>

      {reviews.map((review) => (
        <div key={review.id} className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 text-gray-600" />
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 text-lg mb-1">
                  {review.full_name}
                </h3>
                <p className="text-sm text-gray-500">
                  {formatDate(review.created_at)}
                </p>
              </div>
            </div>

            <div className="flex gap-1">
              {renderStars(review.rating)}
            </div>
          </div>

          <div className="ml-16">
            {review.subject && (
              <h4 className="font-medium text-gray-900 mb-2">{review.subject}</h4>
            )}
            <p className="text-gray-700 leading-relaxed">{review.review_text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
