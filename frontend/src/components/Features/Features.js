import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

const PharmacyPromoFeatures = () => {
    // Trust features data based on your design
    const features = [
        {
            id: 1,
            title: 'Genuine Sourcing',
            description: 'Search from 10,000+ products or upload prescription',
            icon: (
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            )
        },
        {
            id: 2,
            title: 'Fast Delivery',
            description: 'Get doorstep delivery within 24-48 hours',
            icon: (
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            )
        },
        {
            id: 3,
            title: 'Secure Payment',
            description: '100% secure payment with multiple options',
            icon: (
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            )
        }
    ];

    // Data for the requested "How it Works" section
    const steps = [
        {
            id: 1,
            title: 'Open the app',
            description: 'Choose from over 7000 products across groceries, fresh fruits & veggies, meat, pet care, beauty items & more',
            imageSrc: '/images/step_open_app.png' // Replace with your actual graphic paths
        },
        {
            id: 2,
            title: 'Place an order',
            description: 'Add your favourite items to the cart & avail the best offers',
            imageSrc: '/images/step_place_order.png'
        },
        {
            id: 3,
            title: 'Get free delivery',
            description: 'Experience lighting-fast speed & get all your items delivered in minutes',
            imageSrc: '/images/step_free_delivery.png'
        }
    ];

    return (
        <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-10 py-12 bg-white space-y-24">

            {/* 1. Redesigned Premium Promotional Banner */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative w-full rounded-[2.5rem] overflow-hidden p-8 sm:p-12 lg:p-16 min-h-[300px] sm:min-h-[350px] flex items-center shadow-[0_20px_50px_rgba(12,62,38,0.18)]"
            >
                {/* Glowing Abstract Ambient Lights */}
                <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-400/20 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute left-1/4 bottom-0 w-72 h-72 bg-teal-400/10 rounded-full blur-[90px] pointer-events-none" />

                <div className="grid sm:grid-cols-[1fr_auto] gap-10 items-center w-full relative z-10">

                    {/* Banner Text Content */}
                    <div className="max-w-xl space-y-5 text-left">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                            Our Promise
                        </span>

                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15]">
                            Your Needs, <br />Our Priority
                        </h2>
                        <p className="text-xs sm:text-sm text-emerald-100/80 font-medium leading-relaxed max-w-lg">
                            Discover genuine medicines, wellness products, and healthcare solutions from trusted brands. Our mission is to simplify your healthcare journey with safe, affordable, and reliable online pharmacy services.
                        </p>
                    </div>

                    {/* Banner Graphic 3D Illustration */}
                    <div className="hidden sm:flex items-center justify-center pr-4 lg:pr-12 relative">
                        {/* Glowing shadow base */}
                        <div className="absolute w-36 h-36 bg-emerald-400/20 rounded-full blur-3xl bottom-2 pointer-events-none" />

                        <motion.div
                            animate={{ y: [0, -12, 0] }}
                            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                            className="relative w-44 h-44 lg:w-56 lg:h-56 transform hover:scale-105 transition-transform duration-500"
                        >
                            <Image
                                src="/images/wellness_banner_graphic.png?v=2"
                                alt="Wellness and Medicines Care"
                                fill
                                style={{ objectFit: 'contain' }}
                                priority
                                className="drop-shadow-[0_15px_30px_rgba(0,0,0,0.2)]"
                            />
                        </motion.div>
                    </div>

                </div>
            </motion.div>

            {/* 2. Trust Badges & Core Features Grid */}
            <div className="grid md:grid-cols-3 gap-6 lg:gap-10 border-t border-slate-100 pt-10">
                {features.map((feature) => (
                    <div
                        key={feature.id}
                        className="flex items-start gap-4 p-5 rounded-2xl border border-slate-100 hover:border-slate-200/80 bg-white hover:bg-slate-50/30 shadow-[0_2px_8px_rgba(0,0,0,0.005)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.025)] hover:-translate-y-1 transition-all duration-300"
                    >
                        {/* Soft Icon Wrapper */}
                        <div className="w-12 h-12 flex-shrink-0 rounded-xl bg-[#FAF9F5] border border-[#EBE8DF]/50 flex items-center justify-center shadow-sm">
                            {feature.icon}
                        </div>

                        {/* Description Text */}
                        <div className="space-y-1 text-left">
                            <h4 className="text-base font-bold text-slate-800 tracking-tight">
                                {feature.title}
                            </h4>
                            <p className="text-xs text-slate-500 leading-relaxed font-medium">
                                {feature.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* 3. "How it Works" Requested Section */}
            <div className="space-y-10">
                <div className="text-center space-y-2">
                    <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        How it Works
                    </h3>
                    <div className="w-12 h-1 bg-emerald-600 mx-auto rounded-full" />
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {steps.map((step, idx) => (
                        <motion.div
                            key={step.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className="bg-white rounded-3xl border border-slate-100 p-8 flex flex-col items-center text-center shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] transition-shadow duration-300"
                        >
                            {/* Step Graphic Container
                            <div className="w-32 h-32 relative mb-6 flex items-center justify-center">
                                <Image
                                    src={step.imageSrc}
                                    alt={step.title}
                                    fill
                                    style={{ objectFit: 'contain' }}
                                    className="transform hover:scale-105 transition-transform duration-300"
                                />
                            </div> */}

                            {/* Step Typography */}
                            <div className="space-y-3">
                                <h4 className="text-lg font-bold text-slate-900 tracking-tight">
                                    {step.title}
                                </h4>
                                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium max-w-xs">
                                    {step.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default PharmacyPromoFeatures;