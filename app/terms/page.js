"use client"
import TermsAndConditions from "@/components/termsConditionPage";
import { TENANTS } from "../mockData";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function Page() {

    const searchParams = useSearchParams();
    const currentTenant = searchParams.get('tenant') || "skillivio";

    
    var tenant = TENANTS[currentTenant];
        const props = {
        p: tenant.primary,
        s: tenant.secondary,
        tenant:tenant,
    };
    



    return <TermsAndConditions {...props} />;
}