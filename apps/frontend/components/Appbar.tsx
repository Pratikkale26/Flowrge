"use client";

import { useRouter } from "next/navigation";
import { LinkButton } from "./buttons/LinkButton"
import { PrimaryButton } from "./buttons/PrimaryButton";

export const Appbar = () => {
    const router = useRouter();

    return <div className="flex border-b justify-between">
        <div className="text-2xl p-2 font-semibold">
            Flowrge
        </div>
        <div className="flex gap-4 p-2">
            <LinkButton onClick={() => {}}>Contact Sales</LinkButton>
            <LinkButton onClick={() => {router.push("/login")}}>Login</LinkButton>
            <PrimaryButton onClick={() => {router.push("/signup")}}>Sign Up</PrimaryButton>
        </div>
    </div>
}