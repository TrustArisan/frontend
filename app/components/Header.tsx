import { ConnectButton } from '@rainbow-me/rainbowkit';
import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
    return (
        <>
            <style jsx global>{`
                /* Connect Wallet button - Clean & Sleek */
                button[data-testid="rk-connect-button"] {
                    background: linear-gradient(135deg, #5584a0 0%, #4f7a97 100%) !important;
                    color: white !important;
                    border-radius: 12px !important;
                    padding: 11px 24px !important;
                    font-weight: 600 !important;
                    font-size: 14px !important;
                    border: none !important;
                    box-shadow: 
                        0 2px 8px rgba(79, 122, 151, 0.15),
                        0 1px 3px rgba(79, 122, 151, 0.1) !important;
                    transition: all 0.2s ease !important;
                }

                button[data-testid="rk-connect-button"]:hover {
                    background: linear-gradient(135deg, #4f7a97 0%, #3d6178 100%) !important;
                    box-shadow: 
                        0 4px 12px rgba(79, 122, 151, 0.2),
                        0 2px 6px rgba(79, 122, 151, 0.15) !important;
                    transform: translateY(-1px) !important;
                }

                button[data-testid="rk-connect-button"] span {
                    color: white !important;
                }

                /* Account button - Ultra clean glass */
                button[data-testid="rk-account-button"] {
                    background: rgba(255, 255, 255, 0.95) !important;
                    backdrop-filter: blur(12px) !important;
                    -webkit-backdrop-filter: blur(12px) !important;
                    color: #4f7a97 !important;
                    border-radius: 12px !important;
                    padding: 10px 18px !important;
                    font-weight: 600 !important;
                    font-size: 14px !important;
                    border: 1px solid rgba(79, 122, 151, 0.15) !important;
                    box-shadow: 
                        0 2px 8px rgba(79, 122, 151, 0.06),
                        0 1px 3px rgba(79, 122, 151, 0.04) !important;
                    transition: all 0.2s ease !important;
                }

                button[data-testid="rk-account-button"]:hover {
                    background: rgba(255, 255, 255, 1) !important;
                    border-color: rgba(79, 122, 151, 0.25) !important;
                    box-shadow: 
                        0 4px 12px rgba(79, 122, 151, 0.1),
                        0 2px 6px rgba(79, 122, 151, 0.06) !important;
                    transform: translateY(-1px) !important;
                }

                button[data-testid="rk-account-button"] span,
                button[data-testid="rk-account-button"] div {
                    color: #4f7a97 !important;
                    font-weight: 600 !important;
                }

                /* Avatar - Simple gold ring */
                button[data-testid="rk-account-button"] img {
                    border: 2px solid #eeb446 !important;
                }

                /* Chain button - Clean minimal */
                button[aria-label*="Chain"] {
                    background: rgba(255, 255, 255, 0.95) !important;
                    backdrop-filter: blur(12px) !important;
                    border: 1px solid rgba(79, 122, 151, 0.15) !important;
                    border-radius: 12px !important;
                    box-shadow: 
                        0 2px 8px rgba(79, 122, 151, 0.06),
                        0 1px 3px rgba(79, 122, 151, 0.04) !important;
                    transition: all 0.2s ease !important;
                }

                button[aria-label*="Chain"]:hover {
                    background: rgba(255, 255, 255, 1) !important;
                    border-color: rgba(79, 122, 151, 0.25) !important;
                    transform: translateY(-1px) !important;
                    box-shadow: 
                        0 4px 12px rgba(79, 122, 151, 0.1),
                        0 2px 6px rgba(79, 122, 151, 0.06) !important;
                }
            `}</style>

            <header className="border-b border-[#4f7a97]/20 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="container mx-auto px-6 py-6 flex justify-between items-center">
                    {/* Logo Section */}
                    <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <div className="relative w-12 h-12">
                            <Image 
                                src="/images/trustarisan-logo.png" 
                                alt="TrustArisan Logo" 
                                fill
                                className="object-contain"
                                priority
                            />
                        </div>
                        <h1 className="text-3xl font-bold text-[#4f7a97]">
                            TrustArisan
                        </h1>
                    </Link>

                    {/* Wallet Connect Button */}
                    <div className="flex items-center gap-3">
                        <ConnectButton 
                            showBalance={{
                                smallScreen: false, 
                                largeScreen: true
                            }} 
                            accountStatus={{
                                smallScreen: "avatar",
                                largeScreen: "full"
                            }} 
                            chainStatus={{
                                smallScreen: "icon",
                                largeScreen: "full"
                            }}
                        />
                    </div>
                </div>
            </header>
        </>
    )
}