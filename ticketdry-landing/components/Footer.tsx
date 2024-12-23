import Link from "next/link";

export default function Footer() {
    return (
        <footer className="w-full bg-[#202020] text-white py-12">
        <div className="px-4 md:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About Us</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="hover:text-[#3E31FA] transition-colors">Our Story</Link></li>
                <li><Link href="/" className="hover:text-[#3E31FA] transition-colors">Team</Link></li>
                <li><Link href="/" className="hover:text-[#3E31FA] transition-colors">Careers</Link></li>
                <li><Link href="/" className="hover:text-[#3E31FA] transition-colors">Press</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Help</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="hover:text-[#3E31FA] transition-colors">FAQs</Link></li>
                <li><Link href="/" className="hover:text-[#3E31FA] transition-colors">Contact Support</Link></li>
                <li><Link href="/" className="hover:text-[#3E31FA] transition-colors">Ticket Issues</Link></li>
                <li><Link href="/" className="hover:text-[#3E31FA] transition-colors">Refunds</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="hover:text-[#3E31FA] transition-colors">Terms of Service</Link></li>
                <li><Link href="/" className="hover:text-[#3E31FA] transition-colors">Privacy Policy</Link></li>
                <li><Link href="/" className="hover:text-[#3E31FA] transition-colors">Accessibility</Link></li>
                <li><Link href="/" className="hover:text-[#3E31FA] transition-colors">Cookie Settings</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Community</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="hover:text-[#3E31FA] transition-colors">Blog</Link></li>
                <li><Link href="/" className="hover:text-[#3E31FA] transition-colors">Social Media</Link></li>
                <li><Link href="/" className="hover:text-[#3E31FA] transition-colors">Partners</Link></li>
                <li><Link href="/" className="hover:text-[#3E31FA] transition-colors">Affiliates</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-8 text-center">
            <p className="text-sm text-gray-400">© 2024 TicketDRY. All rights reserved.</p>
          </div>
        </div>
      </footer>
    );
  }
  