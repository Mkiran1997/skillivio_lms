"use client";
import React, { Suspense } from "react";
import PrivacyContent from "@/components/privacyPolicyPage";
import { TENANTS } from "../mockData";
import { useSearchParams } from "next/navigation";

function PrivacyPage() {
    const searchParams = useSearchParams();
    const currentTenant = searchParams.get('tenant') || "skillivio";
    const tenant = TENANTS[currentTenant];
    const props = {
        p: tenant.primary,
        s: tenant.secondary,
        tenant: tenant,
    };
    return <PrivacyContent {...props} />;
}

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <PrivacyPage />
        </Suspense>
    );
}