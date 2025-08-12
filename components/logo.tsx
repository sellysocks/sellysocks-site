export function Logo({ className = "h-8 w-auto" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 40 40" className="h-8 w-8" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Sock shape */}
        <path
          d="M12 8C12 6.89543 12.8954 6 14 6H26C27.1046 6 28 6.89543 28 8V20C28 22.2091 26.2091 24 24 24H22L20 28C19.4477 28 18.5523 28 18 28L16 24H14C11.7909 24 10 22.2091 10 20V12"
          fill="currentColor"
          className="text-primary"
        />
        {/* Heart steam */}
        <path
          d="M20 12C18.5 10.5 16 11 16 13C16 15 20 18 20 18S24 15 24 13C24 11 21.5 10.5 20 12Z"
          fill="currentColor"
          className="text-rose-400"
        />
        {/* Steam lines */}
        <path
          d="M18 4L18 2M22 4L22 2M20 3L20 1"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="text-rose-300"
        />
      </svg>
      <span className="font-serif text-xl font-bold text-primary">Selly Socks</span>
    </div>
  )
}
