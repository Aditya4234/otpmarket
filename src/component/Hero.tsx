"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const Hero = () => {
    return (
        <section className="relative w-full h-screen mx-auto flex items-center justify-center overflow-hidden">

            {/* BG GRADIENTS */}
            <div className="absolute top-0 left-0 w-full h-full z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full violet-gradient opacity-20 blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full green-pink-gradient opacity-20 blur-[100px]" />
            </div>

            <div className="max-w-7xl mx-auto px-6 sm:px-16 flex flex-col md:flex-row items-center relative z-10 w-full gap-8">

                {/* LEFT SIDE */}
                <motion.div
                    initial="hidden"
                    animate="show"
                    variants={fadeUp}
                    className="flex-1 flex flex-col items-start justify-center"
                >
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
                        Get Instant Virtual<br className="hidden md:block" />
                        Number for OTP-Safe<br />
                        <span className="text-[#804dee]">Fast & Reliable</span>
                    </h1>

                    <p className="mt-4 text-secondary text-[17px] max-w-3xl leading-[30px] mb-8">
                        Buy temporary virtual numbers for WhatsApp, Telegram, Facebook, & more
                    </p>

                    <div className="flex flex-wrap gap-4 mb-6">
                        <motion.div whileHover={{ scale: 1.05 }}>
                            <Link
                                href="/register"
                                className="bg-[#804dee] text-white py-3 px-8 rounded-full font-bold shadow-md hover:bg-[#6b3dc9]"
                            >
                                Get Started
                            </Link>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.05 }}>
                            <Link
                                href="#Feature"
                                className="bg-transparent border border-white text-white py-3 px-8 rounded-full font-bold shadow-md hover:bg-white hover:text-[#050816]"
                            >
                                Explore Pricing
                            </Link>
                        </motion.div>
                    </div>

                    <div className="flex flex-wrap gap-3 mt-4">
                        {["99.9% Uptime", "Fast OTP Delivery", "SSL Secured"].map((item, i) => (
                            <motion.span
                                key={i}
                                whileHover={{ scale: 1.08 }}
                                className="border border-[#804dee] text-white py-2 px-6 rounded-full text-sm font-semibold shadow-md"
                            >
                                {item}
                            </motion.span>
                        ))}
                    </div>
                </motion.div>

                {/* RIGHT SIDE — FULL FRAME COVER SCREEN */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 40 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    whileHover={{ rotate: 2, scale: 1.02 }}
                    className="flex-1 flex items-center justify-center mt-10 md:mt-0"
                >
                    {/* FLOAT ANIMATION */}
                    <motion.div
                        animate={{ y: [0, -15, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="relative flex justify-center items-center"
                    >
                        {/* iPhone Outer Frame */}
                        <div className="w-[330px] h-[680px] bg-black rounded-[45px] border-[6px] border-gray-700 shadow-[0_0_40px_rgba(128,77,238,0.4)] p-3 relative">

                            {/* Notch */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-8 bg-black rounded-b-3xl z-20"></div>

                            {/* SCREEN — NOW FULL WIDTH + FULL HEIGHT */}
                            <div className="w-full h-full bg-[#0d0d0d] rounded-[35px] p-5 flex flex-col gap-4 overflow-y-auto">

                                {/* TITLE */}
                                <motion.div variants={fadeUp} initial="hidden" animate="show" className="text-center">
                                    <h1 className="text-2xl font-bold text-white">
                                        OTP<span className="text-[#804dee]">MART</span>
                                    </h1>
                                    <p className="text-gray-300 text-sm">Services</p>
                                </motion.div>

                                {/* BALANCE CARD — FULL WIDTH */}
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="w-full border p-4 rounded-xl bg-blue-500 text-white shadow-md"
                                >
                                    <div className="flex justify-between text-lg font-semibold">
                                        <span>Balance</span>
                                        <span>₹250</span>
                                    </div>

                                    <div className="flex justify-between items-center mt-3">
                                        <i className="fas fa-plus-circle text-xl"></i>
                                        <button className="bg-[#804dee] px-4 py-1 rounded-full text-white font-semibold hover:bg-[#6b3dc9]">
                                            Add Funds
                                        </button>
                                    </div>
                                </motion.div>

                                {/* SERVICES FULL WIDTH */}
                                <div className="grid grid-cols-2 gap-3 w-full">
                                    {[
                                        { icon: "whatsapp", label: "WhatsApp" },
                                        { icon: "telegram", label: "Telegram" },
                                        { icon: "facebook", label: "Facebook" },
                                        { icon: "instagram", label: "Instagram" },
                                    ].map((item, i) => (
                                        <motion.div
                                            key={i}
                                            whileHover={{ scale: 1.06 }}
                                            className="flex items-center gap-3 p-4 bg-blue-500 text-white rounded-xl hover:bg-white hover:text-[#804dee] border hover:border-[#804dee] transition-all cursor-pointer"
                                        >
                                            <i className={`fab fa-${item.icon} text-3xl`}></i>
                                            <span className="font-medium">{item.label}</span>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* ACTIVE NUMBER FULL WIDTH */}
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="w-full border mt-2 p-4 rounded-xl bg-blue-500 text-white hover:bg-white hover:text-[#804dee] hover:border-[#804dee] transition-all"
                                >
                                    <div className="flex justify-between">
                                        <span className="font-medium">Active Number</span>

                                    </div>
                                </motion.div>

                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
