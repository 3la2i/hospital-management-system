import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const services = [
    { name: 'General Dentistry', path: '/services/general' },
    { name: 'Cosmetic Dentistry', path: '/services/cosmetic' },
    { name: 'Orthodontics', path: '/services/orthodontics' },
    { name: 'Pediatric Dentistry', path: '/services/pediatric' },
    { name: 'Dental Implants', path: '/services/implants' },
  ];

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Our Services', path: '/services' },
    { name: 'Our Dentists', path: '/dentists' },
    { name: 'Book Appointment', path: '/appointments' },
    { name: 'Patient Portal', path: '/portal' },
  ];

  return (
    <footer className="bg-gradient-to-b from-[rgba(52,165,177,0.7)] to-[rgba(52,165,177,0.7)] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4 flex items-center">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 mr-2">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z"/>
              </svg>
              DentalCare Pro
            </h3>
            <p className="mb-4">Providing exceptional dental care with a gentle touch. Your smile is our priority.</p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-300 transition-colors duration-300">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-blue-300 transition-colors duration-300">
                <Twitter size={20} />
              </a>
              <a href="#" className="hover:text-blue-300 transition-colors duration-300">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-blue-300 transition-colors duration-300">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-xl font-semibold mb-4">Our Services</h4>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service.path}>
                  <Link to={service.path} className="hover:text-blue-300 transition-colors duration-300">
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="hover:text-blue-300 transition-colors duration-300">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-xl font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2">
              <li className="flex items-center">
                <MapPin size={18} className="mr-2" />
                123 Dental Street, Medical City, 12345
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-2" />
                (123) 456-7890
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2" />
                info@dentalcarepro.com
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-[#34a5b1] mt-8 pt-8 text-center">
          <p>&copy; {currentYear} DentalCare Pro. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;