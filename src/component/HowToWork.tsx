import React from 'react';

const HowToWork = () => {
    return (
        <section className="py-20 px-6 bg-tertiary">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16">
                    How It <span className="text-[#804dee]">Works</span>
                    <p className="text-secondary text-lg max-w-2xl mx-auto">Get your virtual number in 3 simple steps</p>

                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 transition-all duration-300 ease-in-out hover:scale-105 ">
                    {/* Step 1 */}
                    <div className="bg-primary rounded-2xl p-8 border border-[#804dee]/20 hover:border-[#804dee]/50 transition-all">
                        <div className="w-16 h-16 bg-[#804dee] rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6">
                            1
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">Sign Up & Recharge</h3>
                        <p className="text-secondary leading-relaxed">
                            Create an account and add funds using your preferred payment method.
                        </p>
                    </div>

                    {/* Step 2 */}
                    <div className="bg-primary rounded-2xl p-8 border border-[#804dee]/20 hover:border-[#804dee]/50 transition-all">
                        <div className="w-16 h-16 bg-[#804dee] rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6">
                            2
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">Choose platform & Country</h3>
                        <p className="text-secondary leading-relaxed">
                            Select your desired service and country for verification
                        </p>
                    </div>

                    {/* Step 3 */}
                    <div className="bg-primary rounded-2xl p-8 border border-[#804dee]/20 hover:border-[#804dee]/50 transition-all">
                        <div className="w-16 h-16 bg-[#804dee] rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6">
                            3
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4 transition-all ">Recive OTP</h3>
                        <p className="text-secondary leading-relaxed transition-all ">
                            Get your OTP instantly or receive automatic refund in 10 minutes
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowToWork;
