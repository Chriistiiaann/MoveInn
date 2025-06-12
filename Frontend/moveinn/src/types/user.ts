import { AccommodationData } from "./accommodation";
import { Event } from "./event";
import { Recommendation } from "./recommendation";

export interface SocialMedia {
  id: number
  socialMedia: number
  url: string
}
export interface DecodedToken {
  id: string
  email: string
  name: string
}
export interface UserUpdateFormData {
  name: string
  lastName: string
  email: string
  biography: string
  school: string
  city: string
  degree: string
  nationality: string
  erasmusCountry: string
  erasmusDate: string
  phone: string
  password?: string
  avatarFile?: File | null
  socialMedias: SocialMedia[]
  countryFlag?: string
  erasmusCountryFlag?: string
  languages?: Array<{ language: string; level: number }>
}


export interface User {
  countryFlag: any;
  id: string;
  name: string;
  lastName: string;
  mail: string;
  role: number;
  biography: string;
  avatarUrl: string;
  school: string;
  city: string;
  degree: string;
  nationality: string;
  erasmusDate: number;
  erasmusCountry: string;
  phone: string;
  socialMedias: {
    id: number;
    socialMedia: number;
    url: string;
    userId: string;
    user?: User;
  }[];
  password?: string;

  accommodations?: AccommodationData[];
  createdEvents?: Event[];
  participatingEvents?: Event[];
  recommendations?: Recommendation[];
}


export const SOCIAL_MEDIA_TYPES = {
  1: "Facebook",
  2: "Instagram",
  3: "Twitter",
  4: "LinkedIn",
  5: "GitHub",
}

export const SOCIAL_MEDIA_ICONS = {
  1: "facebook",
  2: "instagram",
  3: "twitter",
  4: "linkedin",
  5: "github",
}
