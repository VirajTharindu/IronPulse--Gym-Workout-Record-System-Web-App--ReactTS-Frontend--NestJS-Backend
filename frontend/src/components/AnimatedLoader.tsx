export default function AnimatedLoader({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-3">
      <svg
        width="32"
        height="32"
        viewBox="0 0 64 64"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M12 32c0-11 9-20 20-20s20 9 20 20-9 20-20 20S12 43 12 32Z"
          stroke="rgba(148,163,184,0.8)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray="80 40"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 32 32"
            to="360 32 32"
            dur="1s"
            repeatCount="indefinite"
          />
        </path>
      </svg>
      <span className="text-sm text-slate-400">{label ?? 'Loading…'}</span>
    </div>
  )
}

