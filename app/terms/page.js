"use client"
import TermsAndConditions from "@/components/termsConditionPage";
import { TENANTS } from "@/utils/mockData";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function TermsPage() {
    const searchParams = useSearchParams();
    const currentTenant = searchParams.get('tenant') || "skillivio";
    const tenant = TENANTS[currentTenant];
    const props = {
        p: tenant.primary,
        s: tenant.secondary,
        tenant: tenant,
    };
    return <TermsAndConditions {...props} />;
}

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <TermsPage />
        </Suspense>
    );
}