import { MapPin, Star } from 'lucide-react';
import { Company } from '../types/company';
import { useNavigate } from 'react-router-dom';

interface CompanyCardProps {
  company: Company;
}

export default function CompanyCard({ company }: CompanyCardProps) {

  const navigate = useNavigate();

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={`full-${i}`} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative w-5 h-5">
          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 absolute" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          </div>
        </div>
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-5 h-5 text-yellow-400" />
      );
    }

    return stars;
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 flex flex-col sm:flex-row gap-6 items-start">
      <div
        className="w-24 h-24 rounded-lg flex items-center justify-center text-white font-bold text-3xl flex-shrink-0"
        style={{ backgroundColor: company.logoColor }}
      >
        <img src={company.logo} alt="logo"  className="w-full h-full object-cover rounded-lg"/>
      </div>

      <div className="flex-1 min-w-0 w-full">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
          <h2 className="text-xl font-bold text-gray-900">{company.name}</h2>
          <span className="text-sm text-gray-500 whitespace-nowrap">
            {company.foundedOn ? `Founded on ${company.foundedOn}` : `Reg. Date ${company.registrationDate}`}
          </span>
        </div>

        <div className="flex items-start gap-2 text-gray-600 mb-3">
          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <p className="text-sm">{company.address} {company.city}</p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-gray-900">{company.rating}</span>
            <div className="flex items-center gap-1">
              {renderStars(company.rating)}
            </div>
            <span className="text-gray-600 ml-2">{company.reviewCount} Reviews</span>
          </div>

          <button className="bg-gray-900 text-white px-6 py-2.5 rounded-lg hover:bg-gray-800 transition-colors font-medium whitespace-nowrap self-start sm:self-auto" onClick={()=>{
            navigate(`/company-review/${company.id}`)
          }}>
            Detail Review
          </button>
        </div>
      </div>
    </div>
  );
}
