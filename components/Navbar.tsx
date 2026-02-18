"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Bu stil bloğu sadece bu komponent için CSS sınıfları oluşturur */}
            <style>{`
        .nav-container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 20px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        /* Desktop Menu Görünümü */
        .desktop-menu {
          display: flex;
          text-align: center;
          font-size: 14px;
          font-weight: 500;
          flex-direction: column;
          align-items: center;
        }

        /* Mobile Hamburger Butonu (Varsayılan gizli) */
        .hamburger-btn {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 5px;
        }

        /* Mobile Dropdown Menü (Varsayılan gizli) */
        .mobile-menu {
          display: none;
          flex-direction: column;
          background: white;
          border-top: 1px solid #e5e5e5;
          width: 100%;
        }

        .mobile-link {
          display: block;
          padding: 15px 20px;
          border-bottom: 1px solid #eee;
          text-decoration: none;
          color: black;
          font-size: 14px;
          font-weight: 500;
        }

        /* Home linki mobilde siyah arka plan olsun (Resim 3 referansı) */
        .mobile-link.active {
          background: black;
          color: white;
        }

        /* RESPONSIVE KURALLARI */
        @media (max-width: 768px) {
          /* Mobilde desktop menüyü ve sağdaki boşluğu gizle */
          .desktop-menu, .desktop-spacer {
            display: none !important;
          }
          
          /* Mobilde hamburgeri göster */
          .hamburger-btn {
            display: block;
          }

          /* Mobilde container paddingini ayarla */
          .nav-container {
            padding: 15px 20px;
          }
        }
      `}</style>

            <nav style={{ width: "100%", borderBottom: "1px solid #e5e5e5", background: "white", position: "relative" }}>
                {/* Üst Bar */}
                <div className="nav-container">
                    {/* 1. SOL: Logo */}
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <Image src="/LISicon.jpg" alt="Logo" width={40} height={40} />
                        <span style={{ marginLeft: "10px", fontSize: "18px", fontWeight: 600, lineHeight: "1.2" }}>
                            Living <br className="mobile-break" style={{ display: "none" }} /> in silico
                        </span>
                    </div>

                    {/* 2. ORTA: Desktop Menü (Mobilde gizlenir) */}
                    <div className="desktop-menu">
                        {/* Row 1 */}
                        <div style={{ marginBottom: "8px" }}>
                            <Link href="https://livinginsilico.ca" style={{ marginRight: "32px" }}>
                                Home
                            </Link>
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
                        <div>
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

                    {/* 3. SAĞ: Desktop için Boşluk (Hizalamayı korumak için) */}
                    <div className="desktop-spacer" style={{ width: "40px" }}></div>

                    {/* 4. SAĞ: Hamburger Icon (Sadece Mobilde görünür) */}
                    <button className="hamburger-btn" onClick={() => setIsOpen(!isOpen)}>
                        {/* Basit bir SVG Hamburger İkonu */}
                        <svg
                            width="30"
                            height="30"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="black"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            {isOpen ? (
                                <path d="M18 6L6 18M6 6l12 12" /> // Çarpı işareti
                            ) : (
                                <path d="M3 12h18M3 6h18M3 18h18" /> // 3 Çizgi
                            )}
                        </svg>
                    </button>
                </div>

                {/* 5. AÇILIR MENÜ (Sadece Mobilde ve Açıkken görünür) */}
                {isOpen && (
                    <div className="mobile-menu" style={{ display: "flex" }}>
                        <Link href="https://livinginsilico.ca" className="mobile-link active" onClick={() => setIsOpen(false)}>
                            Home
                        </Link>
                        <a href="https://livinginsilico.ca/blog-2/" target="_blank" rel="noopener noreferrer" className="mobile-link">
                            Blog
                        </a>
                        <a href="https://livinginsilico.ca/about-2/" target="_blank" rel="noopener noreferrer" className="mobile-link">
                            About
                        </a>
                        <a href="https://livinginsilico.ca/sponsors/" target="_blank" rel="noopener noreferrer" className="mobile-link">
                            Sponsors
                        </a>
                        <a
                            href="https://livinginsilico.ca/newsletter-sign-up-form/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mobile-link"
                        >
                            Newsletter Sign Up Form
                        </a>
                        <a href="https://livinginsilico.ca/contact/" target="_blank" rel="noopener noreferrer" className="mobile-link">
                            Contact
                        </a>
                    </div>
                )}
            </nav>
        </>
    );
}
