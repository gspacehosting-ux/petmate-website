import { WebsiteSettings } from '../types';

export const defaultSettings: WebsiteSettings = {
  websiteName: 'Petmate',
  tagline: "Your Pet's Best Friend",
  phone: '6363426084',
  email: 'info@Petmate.com',
  location: 'Bangalore',
  businessHours: {
    weekdays: 'Mon - Sat: 9:00 AM - 8:30 PM',
    weekends: 'Sun: 10:00 AM - 6:00 PM'
  },
  socialLinks: {
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com',
    youtube: 'https://youtube.com',
    whatsapp: 'https://wa.me/916363426084'
  },
  footerAbout: "Bangalore's trusted pet shop dedicated to bringing you 100% genuine pet food, accessories, grooming essentials, and loving care for your furry family members."
};
