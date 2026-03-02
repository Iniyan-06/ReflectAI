"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
    { href: "/onboarding", label: "Setup" },
    { href: "/reflect", label: "Reflect" },
    { href: "/insights", label: "Insights" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/transparency", label: "How It Works" },
];

export default function Navigation() {
    const pathname = usePathname();

    return (
        <nav className="nav" role="navigation" aria-label="Main navigation">
            <div className="nav-inner">
                <Link href="/" className="nav-logo" aria-label="ReflectAI home">
                    🧠 ReflectAI
                </Link>

                <div className="nav-links" role="list">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            role="listitem"
                            className={`nav-link${pathname === link.href ? " nav-link--active" : ""}`}
                            aria-current={pathname === link.href ? "page" : undefined}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
}
