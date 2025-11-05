export interface Review {
  id: string;
  company_id: string;
  full_name: string;
  subject: string;
  review_text: string;
  rating: number;
  created_at: string;
}


export interface Company {
  id: string;
  name: string;
  address: string;
  founded_date: string;
  logo_url: string;
  created_at: string;
}