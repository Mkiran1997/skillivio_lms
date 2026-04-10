
"use client";

import React, { useEffect, useState } from "react";
import PrivacyContent from "@/components/privacyPolicyPage";
import { TENANTS } from "../mockData";
import ContactUsPage from "@/components/contactUsPage";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import { fetchtenants } from "@/store/slices/tenantSlice";

export default function Page() {
    // Matches the logic from your Terms page
    const searchParams = useSearchParams();
    const currentTenant = searchParams.get('tenant') || "skillivio";

    var tenant = TENANTS[currentTenant];

    const props = {
        p: tenant.primary,
        s: tenant.secondary,
        tenant: tenant,
    };


    return <PrivacyContent {...props} />;
}