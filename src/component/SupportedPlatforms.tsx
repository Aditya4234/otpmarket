import React from 'react';
import { FaWhatsapp, FaTelegram, FaFacebook, FaInstagram, FaGoogle, FaEllipsisH } from 'react-icons/fa';
import { SiTinder } from 'react-icons/si';

const SupportedPlatforms = () => {
    const platforms = [
        { name: 'WhatsApp', icon: FaWhatsapp, color: '#25D366' },
        { name: 'Telegram', icon: FaTelegram, color: '#0088cc' },
        { name: 'Facebook', icon: FaFacebook, color: '#1877f2' },
        { name: 'Instagram', icon: FaInstagram, color: '#E4405F' },
        { name: 'Gmail', icon: FaGoogle, color: '#EA4335' },
        { name: 'Tinder', icon: SiTinder, color: '#FF6B6B' },
        { name: 'And More', icon: FaEllipsisH, color: '#804dee' },
    ];

    return (
        <>
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
                        Supported Platforms
                    </h2>
                    <p className="text-secondary text-center mb-16 text-lg">
                        Get OTP verification for all major platforms
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                        {platforms.map((platform) => (
                            <div
                                key={platform.name}
                                className="bg-[var(--white)] shadow-[0px_5px_15px_rgba(0,0,0,0.15)] rounded-2xl p-6 border border-[#804dee]/20 hover:border-[#804dee]/100 transition-all hover:scale-105 flex flex-col items-center justify-center gap-4 cursor-pointer group"
                            >
                                <platform.icon
                                    className="text-5xl transition-all group-hover:scale-110"
                                    style={{ color: platform.color }}
                                />
                                <h3 className="text-gray-800 font-semibold text-center">{platform.name}</h3>
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-8">
                        <p className="text-secondary text-sm">+ Many more platforms supported</p>
                    </div>
                </div>
            </section>

            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
                        Why Choose OTP MART
                    </h2>
                    <p className="text-secondary text-center mb-16 text-lg">
                        We offer premium features to ensure the best service
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Auto Refund */}
                        <div className="bg-gradient-to-br from-[#FFE5E5] to-[#FFF0E5] shadow-[0px_5px_15px_rgba(0,0,0,0.15)] rounded-2xl p-8 border border-[#FF6B6B]/30 hover:border-[#FF6B6B]/60 transition-all hover:scale-105 group">
                            <div className="w-16 h-16 bg-gradient-to-br from-[#FF6B6B] to-[#FF8E53] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg">
                                <svg className="w-8 h-8 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-3">Auto Refund</h3>
                            <p className="text-gray-700 leading-relaxed">
                                Automatic refund if no OTP within 10 minutes
                            </p>
                        </div>

                        {/* Countdown Timer */}
                        <div className="bg-gradient-to-br from-[#E5F4FF] to-[#E5FFFF] shadow-[0px_5px_15px_rgba(0,0,0,0.15)] rounded-2xl p-8 border border-[#4FACFE]/30 hover:border-[#4FACFE]/60 transition-all hover:scale-105 group">
                            <div className="w-16 h-16 bg-gradient-to-br from-[#4FACFE] to-[#00F2FE] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg">
                                <svg className="w-8 h-8 text-white animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-3">Countdown Timer</h3>
                            <p className="text-gray-700 leading-relaxed">
                                Visible timer shown with every active number
                            </p>
                        </div>

                        {/* Auto Refresh */}
                        <div className="bg-gradient-to-br from-[#E5FFF0] to-[#E5FFFA] shadow-[0px_5px_15px_rgba(0,0,0,0.15)] rounded-2xl p-8 border border-[#43E97B]/30 hover:border-[#43E97B]/60 transition-all hover:scale-105 group">
                            <div className="w-16 h-16 bg-gradient-to-br from-[#43E97B] to-[#38F9D7] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-180 transition-all duration-500 shadow-lg">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-3">Auto-Refresh</h3>
                            <p className="text-gray-700 leading-relaxed">
                                Automatically refreshes for received OTP messages
                            </p>
                        </div>

                        {/* Multiple Payment */}
                        <div className="bg-gradient-to-br from-[#FFE5F0] to-[#FFFAE5] shadow-[0px_5px_15px_rgba(0,0,0,0.15)] rounded-2xl p-8 border border-[#FA709A]/30 hover:border-[#FA709A]/60 transition-all hover:scale-105 group">
                            <div className="w-16 h-16 bg-gradient-to-br from-[#FA709A] to-[#FEE140] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg">
                                <svg className="w-8 h-8 text-white animate-bounce-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-3">Multiple Payment</h3>
                            <p className="text-gray-700 leading-relaxed">
                                Razorpay, PayPal, USDT support
                            </p>
                        </div>

                        {/* Secure Hosting */}
                        <div className="bg-gradient-to-br from-[#F0F9FF] to-[#FFE5F5] shadow-[0px_5px_15px_rgba(0,0,0,0.15)] rounded-2xl p-8 border border-[#A8EDEA]/30 hover:border-[#A8EDEA]/60 transition-all hover:scale-105 group">
                            <div className="w-16 h-16 bg-gradient-to-br from-[#A8EDEA] to-[#FED6E3] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg">
                                <svg className="w-8 h-8 text-gray-700 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-3">Secure Hosting</h3>
                            <p className="text-gray-700 leading-relaxed">
                                Hosted securely on VPS with aaPanel
                            </p>
                        </div>

                        {/* Smart Admin System */}
                        <div className="bg-gradient-to-br from-[#EDE5FF] to-[#F5E5FF] shadow-[0px_5px_15px_rgba(0,0,0,0.15)] rounded-2xl p-8 border border-[#667EEA]/30 hover:border-[#667EEA]/60 transition-all hover:scale-105 group">
                            <div className="w-16 h-16 bg-gradient-to-br from-[#667EEA] to-[#764BA2] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-180 transition-all duration-500 shadow-lg">
                                <svg className="w-8 h-8 text-white animate-spin-slow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-3">Smart Admin System</h3>
                            <p className="text-gray-700 leading-relaxed">
                                With auto provider switching capability
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default SupportedPlatforms;