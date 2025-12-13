"use client";
import React from 'react';

const UserSay = () => {
    return (
        <section className="relative w-full py-16 px-6 sm:px-16 bg-gradient-to-b from-[#050816] to-[#0a0f2e]">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        What Our <span className="text-[#804dee]">Users Say</span>
                    </h2>
                    <p className="text-secondary text-lg max-w-2xl mx-auto">
                        Trusted by thousands of users worldwide
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-20">
                    <div className="p-7 bg-white/10 backdrop-blur-sm shadow-lg rounded-xl border border-white/20 hover:bg-white/20 transition-all transform hover:scale-105">
                        <div className="text-white text-center">
                            <div className="text-5xl font-bold mb-2 text-[#804dee]"> <img src="virtual.png" alt="virtual" /></div>
                            <div className="text-lg opacity-80">&quot;I&apos;ve been using OTP MART for 6 months and never had any issues. Highly recommend!&quot;

                                Michael Chen</div>
                        </div>
                    </div>

                    <div className="p-7 bg-white/10 backdrop-blur-sm shadow-lg rounded-xl border border-white/20 hover:bg-white/20 transition-all transform hover:scale-105">
                        <div className="text-white text-center">
                            <div className="text-5xl font-bold mb-2 text-[#804dee]">100K+</div>
                            <div className="text-lg opacity-80">&quot;OTP arrived in just 3 seconds! This service is absolutely amazing and reliable.&quot;

                                John Smith</div>
                        </div>
                    </div>

                    <div className="p-7 bg-white/10 backdrop-blur-sm shadow-lg rounded-xl border border-white/20 hover:bg-white/20 transition-all transform hover:scale-105">
                        <div className="text-white text-center">
                            <div className="text-5xl font-bold mb-2 text-[#804dee]">99.9%</div>
                            <div className="text-lg opacity-80">&quot;Refund was instant when OTP didn&apos;t come. Great customer service and transparency!&quot;

                                Emma Johnson</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default UserSay;
