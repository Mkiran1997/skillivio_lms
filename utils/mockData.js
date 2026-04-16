export const TENANTS = {
    skillivio: { slug: "skillivio", name: "Skillivio", primary: "#2FBF71", secondary: "#2E3044", accent: "#F4A800", logo: "S", tagline: "Learn. Evolve. Succeed.", plan: "ENTERPRISE" },
    acme: { slug: "acme", name: "ACME Training Academy", primary: "#7C3AED", secondary: "#1E1B4B", accent: "#F59E0B", logo: "A", tagline: "Building Skills. Building Futures.", plan: "PROFESSIONAL" },
    techpro: { slug: "techpro", name: "TechPro Institute", primary: "#0EA5E9", secondary: "#0C2340", accent: "#10B981", logo: "T", tagline: "Skills for the Digital Age.", plan: "ENTERPRISE" },
};

// import { fetchtenants } from "@/store/slices/tenantSlice";
// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";

// const { tenants } = useSelector(state => state.tenants)
// const dispatch = useDispatch();

// useEffect(() => {
//     dispatch(fetchtenants())
// }, [dispatch]);


// export const TENANTS = tenants.reduce((acc, tenant) => {
//     acc[tenant.slug] = tenant;
//     return acc;
// }, {});

export const COURSES = [
    { id: "c1", title: "Project Management Fundamentals", cat: "Management", level: "BEGINNER", nqf: 4, credits: 15, price: 0, free: true, enrolled: 247, lessons: 20, progress: 0, status: "PUBLISHED", thumb: "📋" },
    { id: "c2", title: "Advanced JavaScript & Node.js", cat: "Technology", level: "ADVANCED", nqf: 6, credits: 20, price: 1499, free: false, enrolled: 189, lessons: 28, progress: 65, status: "PUBLISHED", thumb: "💻" },
    { id: "c3", title: "Financial Accounting Principles", cat: "Finance", level: "INTERMEDIATE", nqf: 5, credits: 18, price: 999, free: false, enrolled: 312, lessons: 24, progress: 100, status: "PUBLISHED", thumb: "📊" },
    { id: "c4", title: "Leadership & Team Management", cat: "Management", level: "INTERMEDIATE", nqf: 5, credits: 12, price: 799, free: false, enrolled: 156, lessons: 18, progress: 30, status: "PUBLISHED", thumb: "👥" },
    { id: "c5", title: "Digital Marketing Mastery", cat: "Marketing", level: "BEGINNER", nqf: 4, credits: 10, price: 0, free: true, enrolled: 423, lessons: 16, progress: 100, status: "PUBLISHED", thumb: "📱" },
    { id: "c6", title: "Human Resources Management", cat: "HR", level: "INTERMEDIATE", nqf: 5, credits: 15, price: 899, free: false, enrolled: 98, lessons: 22, progress: 0, status: "PUBLISHED", thumb: "🤝" },
    { id: "c7", title: "Data Analytics with Python", cat: "Technology", level: "ADVANCED", nqf: 6, credits: 20, price: 1999, free: false, enrolled: 134, lessons: 30, progress: 0, status: "DRAFT", thumb: "📈" },
    { id: "c8", title: "Supply Chain & Logistics", cat: "Operations", level: "INTERMEDIATE", nqf: 5, credits: 12, price: 699, free: false, enrolled: 67, lessons: 18, progress: 0, status: "DRAFT", thumb: "🚛" },
];

export const LEARNERS = [
    { id: "u1", name: "Thabo Nkosi", email: "thabo@example.co.za", avatar: "TN", cohort: "Cohort A", enrolled: 3, completed: 1, credits: 18 },
    { id: "u2", name: "Priya Sharma", email: "priya@example.co.za", avatar: "PS", cohort: "Cohort A", enrolled: 2, completed: 2, credits: 30 },
    { id: "u3", name: "Nomvula Dlamini", email: "nomvula@example.co.za", avatar: "ND", cohort: "Cohort B", enrolled: 4, completed: 1, credits: 12 },
    { id: "u4", name: "Sipho Mthembu", email: "sipho@example.co.za", avatar: "SM", cohort: "Cohort B", enrolled: 1, completed: 0, credits: 0 },
    { id: "u5", name: "Fatima Hendricks", email: "fatima@example.co.za", avatar: "FH", cohort: "Staff", enrolled: 3, completed: 3, credits: 40 },
    { id: "u6", name: "Lebo Khumalo", email: "lebo@example.co.za", avatar: "LK", cohort: "Cohort C", enrolled: 2, completed: 1, credits: 15 },
    { id: "u7", name: "James van Wyk", email: "james@example.co.za", avatar: "JW", cohort: "Staff", enrolled: 2, completed: 0, credits: 0 },
];

export const QUESTIONS = [
    { id: "q1", text: "Which PMBOK process group covers project initiation?", type: "MCQ", options: ["Initiating", "Planning", "Executing", "Closing"], correct: 0, points: 20 },
    { id: "q2", text: "A project charter is created during the Planning phase.", type: "TRUE_FALSE", correct: "false", points: 15 },
    { id: "q3", text: "Name the process of identifying stakeholders.", type: "SHORT_ANSWER", correct: "stakeholder identification", points: 25 },
    { id: "q4", text: "Which document defines the project scope?", type: "MCQ", options: ["Project Charter", "Scope Statement", "WBS", "Risk Register"], correct: 1, points: 20 },
    { id: "q5", text: "Risk management is only done at the start of a project.", type: "TRUE_FALSE", correct: "false", points: 20 },
];

export const USER_ACCOUNTS = [
    { id: "u1", name: "Thabo Nkosi", email: "thabo@example.co.za", password: "Learner@123", role: "LEARNER", avatar: "TN", tenant: "skillivio" },
    { id: "u2", name: "Priya Sharma", email: "priya@example.co.za", password: "Learner@456", role: "LEARNER", avatar: "PS", tenant: "skillivio" },
    { id: "a1", name: "Admin User", email: "admin@skillivio.co.za", password: "Admin@2026!", role: "TENANT_ADMIN", avatar: "AD", tenant: "skillivio" },
    { id: "a2", name: "ACME Admin", email: "admin@acme.co.za", password: "Acme@2026!", role: "TENANT_ADMIN", avatar: "AA", tenant: "acme" },
    { id: "s1", name: "Super Admin", email: "super@skillivio.com", password: "Super@Admin1", role: "SUPER_ADMIN", avatar: "SA", tenant: "skillivio" },
];

export const ENROLMENT_STORE = {};  // keyed by learnerId+courseId, global

export const TIER_DATA = {
    foundation: {
        id: "foundation", name: "Foundation", emoji: "🌱", tagline: "Starter SDP",
        setup: "R 3,500", monthly: "R 1,490", annual: "R 16,092/yr", color: "#10B981",
        ideal: "Emerging SDPs, sole facilitators, small community training providers.",
        features: {
            "Platform & Branding": [
                { f: "White Label (Your Brand)", v: true }, { f: "Custom Domain", v: false },
                { f: "Remove All Platform Branding", v: false }, { f: "Custom Website Pages", v: "1 page" }, { f: "Free SSL Certificate", v: false }],
            "QCTO Course Delivery": [
                { f: "Unlimited Courses & Learners", v: true }, { f: "Video, Audio & Text Lessons", v: true },
                { f: "Prerequisite Lesson Sequencing", v: true }, { f: "SCORM Imports", v: "1" },
                { f: "Digital Downloads / PoE Resources", v: true }, { f: "Content Drip", v: false }],
            "Assessment & Certification": [
                { f: "Quiz Builder (11 Question Types)", v: true }, { f: "Auto-Graded Assessments", v: false },
                { f: "Fixed & Randomised Exams", v: false }, { f: "Manually Graded PoE", v: false },
                { f: "Verifiable Certificates", v: false }, { f: "LinkedIn Badges", v: false }],
            "AI Tools": [
                { f: "AI Course Creator", v: true }, { f: "AI Student Assistant", v: true },
                { f: "AI Quiz Generator", v: true }, { f: "AI Thumbnail Generator", v: true }],
            "Admin & Reporting": [
                { f: "Admin Accounts", v: "1 account" }, { f: "Engagement Analytics", v: true },
                { f: "Discussion Rooms", v: "1 room" }, { f: "Bulk Email", v: false },
                { f: "Priority Support (4hr SLA)", v: false }, { f: "Dedicated Account Manager", v: false },
                { f: "Annual QCTO Audit Pack", v: false }],
        }
    },
    professional: {
        id: "professional", name: "Professional", emoji: "⭐", tagline: "Growing SDP — Most Popular",
        setup: "R 6,500", monthly: "R 2,990", annual: "R 32,292/yr", color: "#7C3AED",
        ideal: "Accredited Training Providers, TVET colleges, established corporate L&D functions.",
        features: {
            "Platform & Branding": [
                { f: "White Label (Your Brand)", v: true }, { f: "Custom Domain", v: true },
                { f: "Remove All Platform Branding", v: true }, { f: "Custom Website Pages", v: "10 pages" }, { f: "Free SSL Certificate", v: true }],
            "QCTO Course Delivery": [
                { f: "Unlimited Courses & Learners", v: true }, { f: "Video, Audio & Text Lessons", v: true },
                { f: "Prerequisite Lesson Sequencing", v: true }, { f: "SCORM Imports", v: "5" },
                { f: "Digital Downloads / PoE Resources", v: true }, { f: "Content Drip", v: true }],
            "Assessment & Certification": [
                { f: "Quiz Builder (11 Question Types)", v: true }, { f: "Auto-Graded Assessments", v: true },
                { f: "Fixed & Randomised Exams", v: true }, { f: "Manually Graded PoE", v: false },
                { f: "Verifiable Certificates", v: true }, { f: "LinkedIn Badges", v: true }],
            "AI Tools": [
                { f: "AI Course Creator", v: true }, { f: "AI Student Assistant", v: true },
                { f: "AI Quiz Generator", v: true }, { f: "AI Thumbnail Generator", v: true }],
            "Admin & Reporting": [
                { f: "Admin Accounts", v: "Unlimited" }, { f: "Engagement Analytics", v: true },
                { f: "Discussion Rooms", v: "3 rooms" }, { f: "Bulk Email", v: true },
                { f: "Priority Support (4hr SLA)", v: true }, { f: "Dedicated Account Manager", v: false },
                { f: "Annual QCTO Audit Pack", v: false }],
        }
    },
    enterprise: {
        id: "enterprise", name: "Enterprise", emoji: "🏛", tagline: "Established SDP",
        setup: "R 12,000", monthly: "R 5,490", annual: "R 59,292/yr", color: "#0EA5E9",
        ideal: "Large training providers, national corporates, SETA-accredited institutions.",
        features: {
            "Platform & Branding": [
                { f: "White Label (Your Brand)", v: true }, { f: "Custom Domain", v: true },
                { f: "Remove All Platform Branding", v: true }, { f: "Custom Website Pages", v: "Unlimited" }, { f: "Free SSL Certificate", v: true }],
            "QCTO Course Delivery": [
                { f: "Unlimited Courses & Learners", v: true }, { f: "Video, Audio & Text Lessons", v: true },
                { f: "Prerequisite Lesson Sequencing", v: true }, { f: "SCORM Imports", v: "Unlimited" },
                { f: "Digital Downloads / PoE Resources", v: true }, { f: "Content Drip", v: true }],
            "Assessment & Certification": [
                { f: "Quiz Builder (11 Question Types)", v: true }, { f: "Auto-Graded Assessments", v: true },
                { f: "Fixed & Randomised Exams", v: true }, { f: "Manually Graded PoE", v: true },
                { f: "Verifiable Certificates", v: true }, { f: "LinkedIn Badges", v: true }],
            "AI Tools": [
                { f: "AI Course Creator", v: true }, { f: "AI Student Assistant", v: true },
                { f: "AI Quiz Generator", v: true }, { f: "AI Thumbnail Generator", v: true }],
            "Admin & Reporting": [
                { f: "Admin Accounts", v: "Unlimited" }, { f: "Engagement Analytics", v: true },
                { f: "Discussion Rooms", v: "Unlimited" }, { f: "Bulk Email", v: true },
                { f: "Priority Support (4hr SLA)", v: true }, { f: "Dedicated Account Manager", v: true },
                { f: "Annual QCTO Audit Pack", v: true }],
        }
    },
};

export const SA_TENANTS = {
    t1: { id: "t1", slug: "acme", name: "ACME Training Academy", tier: "professional", status: "Active", domain: "learn.acme-training.co.za", contact: "Thandi Mokoena", email: "admin@acme.co.za", learners: 247, mrr: 2990, color: "#7C3AED" },
    t2: { id: "t2", slug: "techpro", name: "TechPro Institute", tier: "enterprise", status: "Active", domain: "lms.techpro.co.za", contact: "Sipho Ndlovu", email: "admin@techpro.co.za", learners: 189, mrr: 5490, color: "#0EA5E9" },
    t3: { id: "t3", slug: "ndc", name: "National Dev College", tier: "foundation", status: "Active", domain: "ndc.skillivio.com", contact: "Priya Pillay", email: "admin@ndc.edu.za", learners: 89, mrr: 1490, color: "#10B981" },
    t4: { id: "t4", slug: "seta-sk", name: "SETA Skills Academy", tier: "enterprise", status: "Pending", domain: "skills.seta-academy.co.za", contact: "James van Wyk", email: "james@seta.co.za", learners: 0, mrr: 5490, color: "#F59E0B" },
};


