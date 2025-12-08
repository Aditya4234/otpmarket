import React from 'react'

function AskedQuestion() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-20">
            <div className="p-7 bg-white/10 backdrop-blur-sm shadow-lg rounded-xl border border-white/20 hover:bg-white/20 transition-all transform hover:scale-105">
                <div className="text-white text-center">
                    <div className="text-5xl font-bold mb-2 text-[#804dee]">500+</div>
                    <div className="text-lg opacity-80">Services Available</div>
                </div>
            </div>
        </div>
    );
};

export default AskedQuestion;
