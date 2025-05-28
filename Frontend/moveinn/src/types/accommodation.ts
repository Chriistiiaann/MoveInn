export interface AccommodationData {
  id: string
  title: string
  description: string
  address: string
  city: string
  country: string
  pricePerMonth: number
  numberOfRooms: number
  bathrooms: number
  squareMeters: number
  hasWifi: boolean
  availableFrom: string
  availableTo: string
  ownerId: string
  images: string[]
  acommodationType: number
}

export interface AcommodationCard {
    acommodation: AccommodationData
  }
export interface OwnerData {
  id: string
  name: string
  avatarUrl: string
}
export interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  accommodation: AccommodationData
}