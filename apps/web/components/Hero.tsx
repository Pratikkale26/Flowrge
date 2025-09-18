"use client"
import { useRouter } from "next/navigation"
import { PrimaryButton } from "./buttons/PrimaryButton"
import { SecondaryButton } from "./buttons/SecondaryButton"

export const Hero = () => {
    const router = useRouter();

    return <div className="">
        <div className="flex justify-center p-4 text-4xl font-bold text-black">
            Flowrge - Forge the Flow
        </div>
        <div className="flex justify-center p-4 text-black text-2xl px-24">
            Flowrge is a platform that allows you to create and manage your own flows. Lets you index Solana blockchain, perform actions and much more 
        </div>

        <div>
            <div className="flex justify-center p-4 gap-8">
                <PrimaryButton onClick={() => {
                    router.push('/signup')
                }}>Get Started</PrimaryButton>
                <SecondaryButton onClick={() => {}}>Learn More</SecondaryButton>
            </div>
        </div>
    </div>
}