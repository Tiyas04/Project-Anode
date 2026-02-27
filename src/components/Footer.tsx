"use client"

import { ShieldCheck, MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white mt-auto border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-12 text-center">
        <div className="flex items-center justify-center gap-2 text-slate-500">
          <ShieldCheck className="w-5 h-5 text-[#14B8A6]" />
          <span className="text-sm font-medium">
            Compliant with chemical safety regulations
          </span>
        </div>

        <div className="mt-8 flex flex-col items-center gap-4 text-slate-600">
          <h3 className="text-lg font-bold text-slate-800">Contact Us</h3>
          <div className="flex flex-col items-center gap-3 text-sm">
            <p className="flex items-center gap-2 font-medium">
              <MapPin className="w-4 h-4 text-[#14B8A6]" />
              7/2 North Nowdapara Anushreepally Belghoria Kolkata 57
            </p>
            <p className="flex items-center gap-2 font-medium">
              <Phone className="w-4 h-4 text-[#14B8A6]" />
              <a href="tel:7863021698" className="hover:text-[#14B8A6] transition-colors">
                7863021698
              </a>
            </p>
            <p className="flex items-center gap-2 font-medium">
              <Mail className="w-4 h-4 text-[#14B8A6]" />
              <a
                href="mailto:saipsblaboratory@gmail.com"
                className="hover:text-[#14B8A6] transition-colors"
              >
                saipsblaboratory@gmail.com
              </a>
            </p>
          </div>
        </div>

        <p className="text-sm font-medium text-slate-400 mt-8">
          © {new Date().getFullYear()} Sai PSB Laboratory. All rights reserved.
        </p>

        <p className="text-xs font-medium text-slate-300 mt-2">
          Chemicals are sold only to verified buyers where required.
        </p>
      </div>
    </footer>
  );
}
