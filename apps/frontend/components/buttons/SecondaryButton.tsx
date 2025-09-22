"use client";
import { ReactNode } from 'react';

export const SecondaryButton = ({ children, onClick, size = "small"}: {children: ReactNode, onClick: () => void, size?: "big" | "small"}) => {
    return <button className={`bg-slate-500 hover:bg-slate-700 text-white font-bold py-${size === "big" ? "4" : "2"} px-${size === "big" ? "6" : "4"} rounded-full`} onClick={onClick}>
        {children}
    </button>
}