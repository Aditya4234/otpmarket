import React from 'react';

function UserSay() {
    return (
        <div>
            <div className="grid grid-cols-1 gap-4 relative z-20">
                <div className="p-7 bg-white/10 backdrop-blur-sm shadow-lg rounded-xl border border-white/20 hover:bg-white/20 transition-all z-10 ">
                    <div className="text-white text-center">
                        <div className="text-3xl font-bold mb-2 text-center text-[#804dee]">500+</div>
                        <div className="text-sm opacity-80">Services</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserSay;
