import React from 'react';

interface SanelowLogoProps {
  className?: string;
  size?: number | string;
  color?: string;
}

export const SanelowLogo: React.FC<SanelowLogoProps> = ({
  className = '',
  size = 32,
  color = '#BD1E2D', // Official Sanelow crimson red
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 500 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Sanelow Music Group Logo"
    >
      {/* Outer Red Keyboard Frame with Left Elevated Tab */}
      <path
        d="M45 140C45 131.7 51.7 125 60 125H170C178.3 125 185 131.7 185 140V175H440C448.3 175 455 181.7 455 190V360C455 368.3 448.3 375 440 375H60C51.7 375 45 368.3 45 360V140Z"
        fill={color}
      />

      {/* 7 White Piano Keys Cutouts */}
      {/* Key 1: C */}
      <rect x="63" y="191" width="41" height="165" rx="3" fill="#FFFFFF" />
      {/* Key 2: D */}
      <rect x="119" y="191" width="41" height="165" rx="3" fill="#FFFFFF" />
      {/* Key 3: E */}
      <rect x="175" y="191" width="41" height="165" rx="3" fill="#FFFFFF" />
      {/* Key 4: F */}
      <rect x="231" y="191" width="41" height="165" rx="3" fill="#FFFFFF" />
      {/* Key 5: G */}
      <rect x="287" y="191" width="41" height="165" rx="3" fill="#FFFFFF" />
      {/* Key 6: A */}
      <rect x="343" y="191" width="41" height="165" rx="3" fill="#FFFFFF" />
      {/* Key 7: B */}
      <rect x="399" y="191" width="41" height="165" rx="3" fill="#FFFFFF" />

      {/* Red Accidental Black Key Extensions Hanging Down from Frame */}
      {/* Between C & D */}
      <path
        d="M104 180H119V280C119 285.5 114.5 290 109 290H114C108.5 290 104 285.5 104 280V180Z"
        fill={color}
      />
      {/* Between D & E */}
      <path
        d="M160 180H175V280C175 285.5 170.5 290 165 290H170C164.5 290 160 285.5 160 280V180Z"
        fill={color}
      />
      {/* Gap between E & F */}

      {/* Between F & G */}
      <path
        d="M272 180H287V280C287 285.5 282.5 290 277 290H282C276.5 290 272 285.5 272 280V180Z"
        fill={color}
      />
      {/* Between G & A */}
      <path
        d="M328 180H343V280C343 285.5 338.5 290 333 290H338C332.5 290 328 285.5 328 280V180Z"
        fill={color}
      />
      {/* Between A & B */}
      <path
        d="M384 180H399V280C399 285.5 394.5 290 389 290H394C388.5 290 384 285.5 384 280V180Z"
        fill={color}
      />
    </svg>
  );
};
