export function Logo({ className = "h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center ${className}`}>
      <img src="/selly-socks-logo.png" alt="Selly Socks" className="h-8 w-auto object-contain" />
    </div>
  )
}
