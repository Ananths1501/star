const Footer = () => {
  return (
    <footer className="bg-gradient-primary text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Star Electricals</h3>
            <p className="text-gray-200 mb-4">Your one-stop shop for all electrical products and services.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-gray-300 transition-colors">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-white hover:text-gray-300 transition-colors">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-white hover:text-gray-300 transition-colors">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-white hover:text-gray-300 transition-colors">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-200 hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-200 hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-200 hover:text-white transition-colors">
                  Services
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-200 hover:text-white transition-colors">
                  Products
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-200 hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-200 hover:text-white transition-colors">
                  Electrical Installation
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-200 hover:text-white transition-colors">
                  Maintenance
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-200 hover:text-white transition-colors">
                  Repairs
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-200 hover:text-white transition-colors">
                  Consultation
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-200 hover:text-white transition-colors">
                  Emergency Services
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <i className="fas fa-map-marker-alt mt-1 mr-2"></i>
                <span>123 Electric Avenue, Circuit City, 12345</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-phone-alt mr-2"></i>
                <span>+1 (123) 456-7890</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-envelope mr-2"></i>
                <span>info@starelectricals.com</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-clock mr-2"></i>
                <span>Mon-Sat: 9AM - 6PM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-600 mt-8 pt-6 text-center">
          <p>&copy; {new Date().getFullYear()} Star Electricals. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
