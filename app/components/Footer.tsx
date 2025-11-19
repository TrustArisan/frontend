import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="border-t border-[#4f7a97]/10 mt-20">
            <div className="container mx-auto px-6 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[#648196] text-sm">
                        © {new Date().getFullYear()} TrustArisan. Building trust through technology.
                    </p>
                    
                    <Link 
                        href="https://github.com/TrustArisan" 
                        target="_blank"
                        className="text-[#4f7a97] hover:text-[#eeb446] font-medium text-sm transition-colors flex items-center gap-2"
                    >
                        <span>View on GitHub</span>
                        <span>→</span>
                    </Link>
                </div>
            </div>
        </footer>
    );
}