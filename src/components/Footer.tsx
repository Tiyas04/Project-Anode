"use client"

import { ShieldCheck, MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="glass mt-auto border-t rounded-t-4xl border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-10 text-center">
        <div className="flex items-center justify-center gap-2 text-slate-400">
          <ShieldCheck className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium">
            Compliant with chemical safety regulations
          </span>
        </div>

        <div className="mt-8 flex flex-col items-center gap-4 text-slate-400">
          <h3 className="text-lg font-semibold text-white">Contact Us</h3>
          <div className="flex flex-col items-center gap-2 text-sm">
            <p className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              7/2 North Nowdapara Anushreepally Belghoria Kolkata 57
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary" />
              <a href="tel:7863021698" className="hover:text-primary transition-colors">
                7863021698
              </a>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" />
              <a
                href="mailto:saipsblaboratory@gmail.com"
                className="hover:text-primary transition-colors"
              >
                saipsblaboratory@gmail.com
              </a>
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-500 mt-6">
          © {new Date().getFullYear()} Sai PSB Laboratory. All rights reserved.
        </p>

        <p className="text-xs text-slate-600 mt-2">
          Chemicals are sold only to verified buyers where required.
        </p>
      </div>
    </footer>
  );
}
