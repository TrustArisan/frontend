import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function Header() {
    return (
        <header className="border-b border-b-[hsl(var(--foreground))]/10">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold bg-linear-to-r from-cyan-500 to-blue-500/80 bg-clip-text text-transparent">
                TrustArisan
                </h1>
                <div className="flex items-center gap-3 space-x-4">
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
    )
}