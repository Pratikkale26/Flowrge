"use client";

import { useState } from "react";
import { Input } from "../Input";
import { PrimaryButton } from "../buttons/PrimaryButton";

interface EmailSelectorProps {
    setMetadata: (params: { email: string; subject: string; body: string }) => void;
}

export function EmailSelector({ setMetadata }: EmailSelectorProps) {
    const [email, setEmail] = useState("");
    const [body, setBody] = useState("");
    const [subject, setSubject] = useState("");

    return (
        <div className="space-y-4">
            <Input label="To" type="email" placeholder="recipient@example.com" onChange={(e) => setEmail(e.target.value)} />
            <Input label="Subject" type="text" placeholder="Your subject here" onChange={(e) => setSubject(e.target.value)} />
            <Input label="Body" type="text" placeholder="Your message here" onChange={(e) => setBody(e.target.value)} />
            <div className="pt-2">
                <PrimaryButton onClick={() => setMetadata({ email, subject, body })}>
                    Confirm Action
                </PrimaryButton>
            </div>
        </div>
    );
}
