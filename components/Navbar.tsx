"use client";

import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
    return (
        <nav style={{ width: "100%", borderBottom: "1px solid #e5e5e5", background: "white" }}>
            <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "20px 24px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", alignItems: "center" }}>
                    {/* Left: Logo */}
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <Image src="/LISicon.jpg" alt="Logo" width={40} height={40} />
                        <span style={{ marginLeft: "10px", fontSize: "18px", fontWeight: 600 }}>Living in silico</span>
                    </div>

                    {/* Center: Menu */}
                    <div style={{ textAlign: "center", fontSize: "14px", fontWeight: 500 }}>
                        {/* Row 1 */}
                        <div>
                            {/* Home = YOUR PROJECT */}
                            <Link href="https://livinginsilico.ca" style={{ marginRight: "32px" }}>
                                Home
                            </Link>

                            {/* External links = open real website in new tab */}
                            <a
                                href="https://livinginsilico.ca/blog-2/"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ marginRight: "32px" }}
                            >
                                Blog
                            </a>
                            <a
                                href="https://livinginsilico.ca/about-2/"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ marginRight: "32px" }}
                            >
                                About
                            </a>
                            <a href="https://livinginsilico.ca/sponsors/" target="_blank" rel="noopener noreferrer">
                                Sponsors
                            </a>
                        </div>

                        {/* Row 2 */}
                        <div style={{ marginTop: "8px" }}>
                            <a
                                href="https://livinginsilico.ca/newsletter-sign-up-form/"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ marginRight: "32px" }}
                            >
                                Newsletter Sign Up Form
                            </a>
                            <a href="https://livinginsilico.ca/contact/" target="_blank" rel="noopener noreferrer">
                                Contact
                            </a>
                        </div>
                    </div>

                    {/* Right: Empty Placeholder to maintain alignment */}
                    <div style={{ width: "6 rem" }}>{/* Buton kaldırıldı ancak hizalama bozulmasın diye bu div tutuldu */}</div>
                </div>
            </div>
        </nav>
    );
}
