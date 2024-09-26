export enum SocialMedia {
  FACEBOOK = 'facebook',
  TWITTER = 'Twitter',
  INSTAGRAM = 'instagram',
  SNAPCHAT = 'snapchat',
  YOUTUBE = 'Youtube',
}

export enum Continent {
  ASIA = 'Asia',
  AFRICA = 'Africa',
  ANTARCTICA = 'Antarctica',
  EUROPE = 'Europe',
  NORTH_AMERICA = 'North America',
  SOUTH_AMERICA = 'South America',
  OCEANIA = 'Oceania',
}

export enum Currency {
  USD = 'USD',
  CAD = 'CAD',
  TK = 'TK',
  EURO = 'EURO',
  INR = 'INR',
  AUD = 'AUD',
}

export enum DeliveryMethod {
  POSTAGE = 'POSTAGE',
  PICKUP = 'PICKUP',
}

export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHERS = 'Others',
}

export enum Language {
  ENGLISH = 'ENGLISH',
  SPANISH = 'SPANISH',
  FRENCH = 'FRENCH',
  CATALAN = 'CATALAN',
  GERMAN = 'GERMAN',
}

export enum MediaType {
  DOC = 'DOC',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
}

export enum MobilePrefixes {
  Bangladesh = '+88',
  Canada = '+1',
  USA = '+1',
}

export enum RoleType {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum MediaProvider {
  AWS_S3 = 'AWS_S3',
  LOCAL = 'LOCAL',
  DO_SPACE = 'DO_SPACE',
  GOOGLE_CLOUD = 'GOOGLE_CLOUD',
}

export enum AvaibilityStatus {
  AVAILABLE = 'AVAILABLE',
  BOOKED = 'BOOKED',
  UNAVAILABLE = 'UNAVAILABLE'
}

export enum RentStatus {
  APPROVED = 'APPROVED',
  DENIED = 'DENIED',
  REQUESTED = 'REQUESTED'
}

export enum PaymentStatus {
  PAID = 'PAID',
  REFUNDED = 'REFUNDED',
  UNPAID = 'UNPAID'
}


export enum CacheKeys {
  PRODUCT_COUNT = 'PRODUCT_COUNT'
}

export type CACHE_UPDATE_TYPE = 'INCREASE_COUNT_BY_ONE' | 'DECREASE_COUNT_BY_ONE' | 'UPDATE_DATA' | 'DELETE' | 'DELETE_BY_PATTERN';


export enum ActivityName {
  CATEGORY = 'CATEGORY',
  RENT_REQUEST = 'RENT_REQUEST',
  PRODUCT = 'PRODUCT',
  PERMISSION = 'PERMISSION',
  ROLE = 'ROLE',
  USER = 'USER',
  COUNTRY = 'COUNTRY',
  STATE = 'STATE',
  CITY = 'CITY',
  REVIEW = 'REVIEW',
  MESSAGE = 'MESSAGE',
}

export enum ActivityType {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  SOFT_DELETE = 'SOFT_DELETE',
  DELETED = 'DELETED',
  VERIFICATION = 'VERIFICATION',
  PASSWORD_UPDATED = 'PASSWORD_UPDATED',
  INVITED = 'INVITED',
  SUSPENDED = 'SUSPENDED',
  RESTRICTED = 'RESTRICTED',
  INACTIVE = 'INACTIVE',
  ACTIVE = 'ACTIVE',
  REQUESTED = 'REQUESTED',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
  C_ACCEPTED = 'C_ACCEPTED',
  C_DECLINED = 'C_DECLINED',
  RESCHEDULED = 'RESCHEDULED',
  COMPLETED = 'COMPLETED',
  APPROVED = 'APPROVED',
  SENT = 'SENT',
  GAVE = 'GAVE',
  JOB_TAKEN = 'JOB_TAKEN',
  REACH_DESTINATION = 'reached at the destination',
  PENDING = 'PENDING',
  ALLOCATED = 'ALLOCATED',
  TRANSFERRED = 'TRANSFERRED',
  REPLY = 'REPLY',
  SEND = 'SEND',
  JOINED = 'JOINED',
}
