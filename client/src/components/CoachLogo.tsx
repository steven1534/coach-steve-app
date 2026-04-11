export function CoachLogo({ size = 36 }: { size?: number }) {
  return (
    <svg
      aria-label="Coach Steve Baseball"
      viewBox="0 0 40 40"
      width={size}
      height={size}
      fill="none"
    >
      <circle cx="20" cy="20" r="18" fill="#C8102E" />
      <path
        d="M10 20 Q15 13 20 20 Q25 27 30 20"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M13 14 Q17 10 20 14"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />
      <path
        d="M20 26 Q23 30 27 26"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />
    </svg>
  );
}
