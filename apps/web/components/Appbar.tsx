"use client";

import { useRouter } from "next/navigation";
import { LinkButton } from "./buttons/LinkButton"
import { PrimaryButton } from "./buttons/PrimaryButton";
import { WalletDisconnectButton, WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";


export const Appbar = () => {
    const router = useRouter();
    const { publicKey } = useWallet();
    return <div className="flex border-b justify-between">
        <div className="text-2xl p-2 font-semibold">
            Flowrge
        </div>
        <div className="flex gap-4 p-2">
            <LinkButton onClick={() => {}}>Contact Sales</LinkButton>
            <LinkButton onClick={() => {router.push("/login")}}>Login</LinkButton>
            <PrimaryButton onClick={() => {router.push("/signup")}}>Sign Up</PrimaryButton>
            {/* Wallet Connect */}
          <div className="hidden sm:flex">
            {publicKey ? (
              <WalletDisconnectButton className="!bg-destructive hover:!bg-destructive/90" />
            ) : (
              <WalletMultiButton className="!bg-primary hover:!bg-primary/90" />
            )}
          </div>
        </div>
    </div>
}