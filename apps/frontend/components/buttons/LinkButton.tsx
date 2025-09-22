"use client";
import { ReactNode } from "react";

export const LinkButton = ({ children, onClick}: {children: ReactNode, onClick: () => void}) => {
    return <div className="bg-gray-200 hover:bg-gray-500 hover:text-white cursor-pointer text-black font-bold py-2 px-4 rounded" onClick={onClick}>
        {children}
    </div>
}