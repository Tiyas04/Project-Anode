"use client"

import Navbar from "@/components/NavBar";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";

export default function ContactPage() {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        message: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post("/api/contact", form);
            if (response.data.success) {
                toast.success(response.data.message);
                setForm({
                    name: "",
                    email: "",
                    phone: "",
                    message: ""
                });
            } else {
                toast.error(response.data.error);
            }
        } catch (error: any) {
            console.log(error);
            toast.error(error?.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F4F8FA] font-sans flex flex-col">
            <Navbar />
            
            <main className="grow pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-slate-800 mb-4 tracking-tight">Contact Us</h1>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                        Get in touch with our team for inquiries, orders, or support
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-start">
                    
                    {/* Left Column - Contact Form */}
                    <div className="bg-white rounded-2xl p-8 lg:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                        <h2 className="text-2xl font-bold text-slate-800 mb-8">Send us a Message</h2>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-bold text-slate-700 mb-2">
                                    Name
                                </label>
                                <input 
                                    type="text" 
                                    id="name" 
                                    name="name" 
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Your name"
                                    className="w-full bg-[#FAFAFA] border border-slate-200 rounded-xl px-4 py-3.5 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/50 focus:border-[#14B8A6] transition-all font-medium"
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-2">
                                    Email
                                </label>
                                <input 
                                    type="email" 
                                    id="email" 
                                    name="email" 
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="your@email.com"
                                    className="w-full bg-[#FAFAFA] border border-slate-200 rounded-xl px-4 py-3.5 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/50 focus:border-[#14B8A6] transition-all font-medium"
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="phone" className="block text-sm font-bold text-slate-700 mb-2">
                                    Phone
                                </label>
                                <input 
                                    type="tel" 
                                    id="phone" 
                                    name="phone" 
                                    value={form.phone}
                                    onChange={handleChange}
                                    required
                                    placeholder="+91 XXXXX XXXXX"
                                    className="w-full bg-[#FAFAFA] border border-slate-200 rounded-xl px-4 py-3.5 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/50 focus:border-[#14B8A6] transition-all font-medium"
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="message" className="block text-sm font-bold text-slate-700 mb-2">
                                    Message
                                </label>
                                <textarea 
                                    id="message" 
                                    name="message" 
                                    value={form.message}
                                    onChange={handleChange}
                                    required
                                    rows={5}
                                    placeholder="Tell us about your requirements..."
                                    className="w-full bg-[#FAFAFA] border border-slate-200 rounded-xl px-4 py-3.5 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/50 focus:border-[#14B8A6] transition-all font-medium resize-y"
                                ></textarea>
                            </div>
                            
                            <button 
                                type="submit"
                                disabled={loading}
                                className={`w-full py-4 rounded-xl text-white font-bold shadow-md transition-all mt-2 active:scale-[0.98] text-lg ${loading ? "bg-[#14B8A6]/70 cursor-not-allowed" : "bg-[#14B8A6] hover:bg-[#0D9486] cursor-pointer"}`}
                            >
                                {loading ? "Sending..." : "Send Message"}
                            </button>
                        </form>
                    </div>

                    {/* Right Column - Contact Info Cards */}
                    <div className="space-y-6">
                        
                        {/* Email Card */}
                        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 flex items-start sm:items-center gap-6 group hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all">
                            <div className="bg-[#e6f7f5] p-4 rounded-full text-[#14B8A6] shrink-0 group-hover:bg-[#14B8A6] group-hover:text-white transition-colors duration-300">
                                <Mail className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-slate-800 mb-1">Email</h3>
                                <div className="space-y-1">
                                    <a href="mailto:saipsblaboratory@gmail.com" className="block text-slate-500 hover:text-[#14B8A6] transition-colors">saipsblaboratory@gmail.com</a>
                                </div>
                            </div>
                        </div>

                        {/* Phone Card */}
                        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 flex items-start sm:items-center gap-6 group hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all">
                            <div className="bg-[#e6f7f5] p-4 rounded-full text-[#14B8A6] shrink-0 group-hover:bg-[#14B8A6] group-hover:text-white transition-colors duration-300">
                                <Phone className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-slate-800 mb-1">Phone</h3>
                                <div className="space-y-1">
                                    <a href="tel:7863021698" className="block text-slate-500 hover:text-[#14B8A6] transition-colors">+91 78630 21698</a>
                                    <p className="text-xs font-semibold text-slate-400 mt-2 uppercase tracking-wide">Mon-Sat: 9:00 AM - 6:00 PM</p>
                                </div>
                            </div>
                        </div>

                        {/* Address Card */}
                        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 flex items-start gap-6 group hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all">
                            <div className="bg-[#e6f7f5] p-4 rounded-full text-[#14B8A6] shrink-0 group-hover:bg-[#14B8A6] group-hover:text-white transition-colors duration-300">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-slate-800 mb-2">Address</h3>
                                <address className="not-italic text-slate-500 leading-relaxed font-medium">
                                    Sai PSB Laboratory<br />
                                    7/2 North Nowdapara<br />
                                    Anushreepally<br />
                                    Belghoria, Kolkata - 700057
                                </address>
                            </div>
                        </div>

                        {/* Business Hours Card (Optional additional card for balance) */}
                        <div className="bg-[#14b8a544] rounded-2xl p-6 sm:p-8 border border-slate-200/60 flex items-start sm:items-center gap-6">
                             <div className="bg-white p-3.5 rounded-full text-slate-400 shrink-0 shadow-sm border border-slate-100">
                                <Clock className="w-5 h-5" />
                             </div>
                             <div >
                                 <h3 className="text-sm font-bold text-slate-700 mb-1">Business Hours</h3>
                                 <p className="text-slate-500 text-sm font-medium">Monday - Friday : 9:00 AM to 6:00 PM</p>
                                 <p className="text-slate-500 text-sm font-medium">Saturday : 9:00 AM to 2:00 PM</p>
                                 <p className="text-slate-500 text-sm font-medium">Sunday : Closed</p>
                             </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}