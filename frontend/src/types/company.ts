export interface Company {
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

export interface CompanyFormData {
  name: string;
  address: string;
  city: string;
  foundedOn: string;
  logo : any
}
