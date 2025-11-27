"use client";
import { ReactNode } from "react";

export const LinkButton = ({ children, onClick}: {children: ReactNode, onClick: () => void}) => {
    return <div className="cursor-pointer text-gray-200 hover:text-white hover:bg-gray-700 hover:transform hover:scale-105 px-3 py-2 font-semibold rounded-full transition-all duration-200" onClick={onClick}>
        {children}
    </div>
}