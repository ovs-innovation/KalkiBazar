import React from 'react';
import { motion } from 'framer-motion';

const PharmacyPromoFeatures = () => {
    // Trust features data based on your design
    const features = [
        {
            id: 1,
            title: 'Genuine Sourcing',
            description: 'Search from 10,000+ products or upload prescription',
            icon: (
                <svg className="w-9 h-9 text-store-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            )
        },
        {
            id: 2,
            title: 'Fast Delivery',
            description: 'Get doorstep delivery within 24-48 hours',
            icon: (
                <svg className="w-9 h-9 text-store-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            )
        },
        {
            id: 3,
            title: 'Secure Payment',
            description: '100% secure payment with multiple options',
            icon: (
                <svg className="w-9 h-9 text-store-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            )
        }
    ];

    return (
        <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 py-12 bg-white space-y-16">

            {/* 1. Monsoon Seasonal Promotional Banner */}
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative w-full rounded-3xl bg-gradient-to-br from-emerald-500/60 via-teal-50/30 to-slate-50/50 border border-slate-300 overflow-hidden p-6 sm:p-10 lg:p-12 min-h-[280px] sm:min-h-[320px] flex items-center"
            >
                {/* Dynamic Abstract Background Graphics */}
                <div className="absolute right-0 bottom-0 top-0 w-full sm:w-1/2 bg-emerald-700/20 rounded-full blur-3xl transform translate-x-1/4 translate-y-1/4 pointer-events-none" />
                <div className="absolute -left-12 -top-12 w-48 h-48 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />

                <div className="grid sm:grid-cols-[1fr_auto] gap-8 items-center w-full relative z-10">

                    {/* Banner Text Content */}
                    <div className="max-w-xl space-y-4">

                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                            Your Health, Our Priority <br className="hidden lg:inline" />
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                            Discover genuine medicines, wellness products, and healthcare solutions from trusted brands. Our mission is to simplify your healthcare journey with safe, affordable, and reliable online pharmacy services.
                        </p>

                    </div>

                    {/* Banner Graphic Illustration Placeholder Container */}
                    <div className="hidden sm:flex items-center justify-center pr-4 lg:pr-12">
                        <div className="relative w-40 h-40 lg:w-48 lg:h-48 rounded-full bg-emerald-100/40 border border-emerald-200/30 flex items-center justify-center p-4 shadow-inner">
                            {/* Note: Replace this vector SVG with your actual transparent character/product photo */}
                            <svg className="w-20 h-20 text-emerald-600/70 animate-pulse" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m9-9H3" />
                            </svg>
                        </div>
                    </div>

                </div>
            </motion.div>

            {/* 2. Trust Badges & Core Features Grid */}
            <div className="grid md:grid-cols-3 gap-6 lg:gap-10 border-t border-slate-100 pt-10">
                {features.map((feature) => (
                    <div
                        key={feature.id}
                        className="flex items-start gap-4 p-4 rounded-2xl transition-all duration-200 hover:bg-slate-50/50"
                    >
                        {/* Soft Icon Wrapper */}
                        <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
                            {feature.icon}
                        </div>

                        {/* Description Text */}
                        <div className="space-y-0.5">
                            <h4 className="text-lg font-bold text-slate-800 tracking-tight">
                                {feature.title}
                            </h4>
                            <p className="text-xs text-slate-500 leading-normal font-medium">
                                {feature.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default PharmacyPromoFeatures;