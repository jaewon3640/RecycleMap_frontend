interface LogoProps {
  className?: string;
}

export function Logo({ className = "w-12 h-12" }: LogoProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Trash Can Body */}
      <path
        d="M 25 35 L 30 90 C 30 93 32 95 35 95 L 65 95 C 68 95 70 93 70 90 L 75 35 Z"
        fill="#10B981"
      />
      
      {/* Trash Can Lid */}
      <rect x="20" y="28" width="60" height="7" rx="2" fill="#10B981" />
      
      {/* Trash Can Top Handle */}
      <path
        d="M 35 28 L 35 20 C 35 17 37 15 40 15 L 60 15 C 63 15 65 17 65 20 L 65 28"
        stroke="#10B981"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      
      {/* Recycling Symbol on Trash Can */}
      <g transform="translate(50, 62)">
        {/* Arrow 1 */}
        <path
          d="M 0 -18 L 5.5 -10 L 2 -10 L 2 -3 L -2 -3 L -2 -10 L -5.5 -10 Z"
          fill="white"
          transform="rotate(0)"
        />
        
        {/* Arrow 2 */}
        <path
          d="M 0 -18 L 5.5 -10 L 2 -10 L 2 -3 L -2 -3 L -2 -10 L -5.5 -10 Z"
          fill="white"
          transform="rotate(120)"
        />
        
        {/* Arrow 3 */}
        <path
          d="M 0 -18 L 5.5 -10 L 2 -10 L 2 -3 L -2 -3 L -2 -10 L -5.5 -10 Z"
          fill="white"
          transform="rotate(240)"
        />
      </g>
      
      {/* Sketch Lines for Style */}
      <g opacity="0.3">
        <line x1="33" y1="45" x2="38" y2="75" stroke="white" strokeWidth="2" />
        <line x1="50" y1="45" x2="50" y2="78" stroke="white" strokeWidth="2" />
        <line x1="67" y1="45" x2="62" y2="75" stroke="white" strokeWidth="2" />
      </g>
    </svg>
  );
}

export function LogoWithText({ className = "" }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Logo className="w-12 h-12" />
      <div>
        <h1 className="text-gray-900">분리수거 가이드</h1>
        <p className="text-gray-500 text-sm">RecycleMap</p>
      </div>
    </div>
  );
}