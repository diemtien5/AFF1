export interface LoanPackage {
  id: string
  name: string
  slug: string
  description: string
  loan_limit: string
  interest_rate: string
  disbursement_speed: string
  logo: string
  image: string
  register_link: string
  detail_link: string
  referral_code?: string
  show_tooltip?: boolean
  created_at?: string
}

export interface Consultant {
  id: string
  name: string
  avatar: string
  phone: string
  zalo: string
  facebook: string
  email?: string
  credit_cards: string
  loans: string
  ewallets: string
  zalo_link?: string
  created_at?: string
}

export interface NavbarLink {
  id: string
  title: string
  url: string
  created_at?: string
}

export interface AdminUser {
  id: string
  username: string
  password: string
  role: string
  created_at?: string
}

export interface AnalyticsStats {
  id: string
  type: string
  value: number
  created_at?: string
}
