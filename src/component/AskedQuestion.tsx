"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AskedQuestion = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const faqs = [
        {
            question: "What is OTP is delayed?",
            answer: "If OTP is not received in 10 minutes, refund is automatic, and the number is deleted. Our system handles this process automatically so you don't have to worry about lost funds"
        },
        {
            question: "Is this service secure?",
            answer: "Yes – your account is protected with session tokens, firewalls, and HTTPS. We take security seriously and implement industry-standard practices to keep your data safe"
        },
        {
            question: "What payment do you support?",
            answer: "We support Razorpay, PayPal, and USDT (ERC20 / TRC20). This gives you flexibility to choose your preferred payment method for adding funds to your account."
        },
        {
            question: "How long can I use the virtual number?",
            answer: "Virtual numbers are temporary and typically available for receiving the OTP only. Once the OTP is received or the 10-minute window passes, the number is released back to our system."
        },
        {
            question: "Can I get numbers for multiple countries?",
            answer: "Yes, we provide virtual numbers from multiple countries. You can select your preferred country when purchasing a number for OTP verification."
        },

    ];

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="relative w-full py-20 px-6 sm:px-16 bg-gradient-to-b from-[#0a0f2e] to-[#050816]">
            <div className="max-w-6xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-5xl font-bold text-white mb-4"
                    >
                        Frequently Asked <span className="text-[#804dee]">Questions</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-secondary text-lg max-w-2xl mx-auto"
                    >
                        Find answers to common questions about our service
                    </motion.p>
                </div>

                {/* FAQ Items */}
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden hover:border-[#804dee]/50 transition-all"
                        >
                            <button
                                onClick={() => toggleFAQ(index)}
                                className="w-full p-6 text-left flex justify-between items-center gap-4 hover:bg-white/5 transition-all"
                            >
                                <h3 className="text-lg md:text-xl font-semibold text-white pr-4">
                                    {faq.question}
                                </h3>
                                <motion.div
                                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex-shrink-0"
                                >
                                    <svg
                                        className="w-6 h-6 text-[#804dee]"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </motion.div>
                            </button>

                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-6 pb-6 text-secondary leading-relaxed">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>

                {/* Contact CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mt-12 text-center"
                >

                </motion.div>
            </div>
        </section>
    );
};

export default AskedQuestion;
