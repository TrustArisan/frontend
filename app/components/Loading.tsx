export default function Loading() {
    return (
        <div className="flex justify-center items-center h-96">
            <div className="relative">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#4f7a97]/20 border-t-[#4f7a97]"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-8 w-8 rounded-full bg-[#eeb446]/20"></div>
                </div>
            </div>
        </div>
    );
}