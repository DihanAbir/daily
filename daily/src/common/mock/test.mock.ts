import { CreateUserDto, CreateUserProfileDto, UserDto } from '../../users/dto';

export class mockMongodbModel {
  findOne = jest.fn();
  create = jest.fn();
  findById = jest.fn();
  set = jest.fn().mockReturnThis();
  save = jest.fn();
  exec = jest.fn();
}

export const mockCreateUserDto = new CreateUserDto({});
mockCreateUserDto.email = 'test@email.com';
mockCreateUserDto.password = 'test1234#';
mockCreateUserDto.firstName = 'test';
mockCreateUserDto.middleName = 'test';
mockCreateUserDto.lastName = 'test';

export const mockUserProfile = {
  _id: 'userProfileId',
  user: 'ObjectId',
  firstName: mockCreateUserDto.firstName,
  middleName: mockCreateUserDto.middleName,
  lastName: mockCreateUserDto.lastName,
  bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  dob: 946684800000, // Example timestamp for January 1, 2000
  gender: 'Male',
  mobile: {
    // MobileDocument fields
    countryCode: '+1',
    phoneNumber: '1234567890',
  },
  location: {
    // LocationDocument fields
    city: 'New York',
    country: 'USA',
    coordinates: [40.7128, -74.006],
  },
  socials: [
    {
      // SocialDocument fields
      platform: 'Twitter',
      handle: '@johndoe',
    },
    {
      // SocialDocument fields
      platform: 'LinkedIn',
      handle: 'JohnDoeSmith',
    },
  ],
  profilePic: {
    // MediaDocument fields
    url: 'https://example.com/profile-pic.jpg',
    type: 'image/jpeg',
    size: 1024, // Size in bytes
  },
  coverPic: {
    // MediaDocument fields
    url: 'https://example.com/cover-pic.jpg',
    type: 'image/jpeg',
    size: 2048, // Size in bytes
  },
  profilePercentage: 75,
  language: 'English',
  wallet: {
    // WalletDocument fields
    balance: 100.5,
    currency: 'USD',
  },
  isActive: true,
  isDeleted: false,
};

export const mockUser = {
  _id: 'ObjectId',
  email: 'example@example.com',
  isActive: true,
  isVerified: true,
  isRegistered: true,
  isAdmin: false,
  isSuperAdmin: false,
  profile: mockUserProfile._id,
};
