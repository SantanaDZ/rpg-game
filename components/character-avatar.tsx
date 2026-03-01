"use client"

interface CharacterAvatarProps {
  skinColor: string
  hairColor: string
  hairStyle: string
  eyeColor: string
  armorType?: string
  weaponType?: string
  hatType?: string
  className?: string
}

export function CharacterAvatar({
  skinColor,
  hairColor,
  hairStyle,
  eyeColor,
  armorType = "none",
  weaponType = "none",
  hatType = "none",
  className = "",
}: CharacterAvatarProps) {
  return (
    <svg
      viewBox="0 0 200 280"
      className={className}
      aria-label="Preview do personagem"
    >
      {/* Body */}
      <ellipse cx="100" cy="260" rx="50" ry="20" fill={skinColor} opacity="0.3" />
      <rect x="70" y="190" width="60" height="70" rx="10" fill={skinColor} />

      {/* Armor */}
      {armorType === "couro" && (
        <path d="M70 190 L130 190 L130 240 Q130 250 120 255 L80 255 Q70 250 70 240 Z" fill="#8B4513" stroke="#5D2E0C" strokeWidth="2" />
      )}
      {armorType === "ferro" && (
        <path d="M70 190 L130 190 L130 240 Q130 250 120 255 L80 255 Q70 250 70 240 Z" fill="#B0C4DE" stroke="#708090" strokeWidth="2" />
      )}
      {armorType === "ouro" && (
        <path d="M70 190 L130 190 L130 240 Q130 250 120 255 L80 255 Q70 250 70 240 Z" fill="#FFD700" stroke="#DAA520" strokeWidth="2" />
      )}
      {armorType === "diamante" && (
        <path d="M70 190 L130 190 L130 240 Q130 250 120 255 L80 255 Q70 250 70 240 Z" fill="#00FFFF" stroke="#00CED1" strokeWidth="2" />
      )}

      {/* Weapons */}
      {weaponType === "espada" && (
        <g transform="translate(140, 180) rotate(15)">
          <rect x="-4" y="0" width="8" height="60" rx="2" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="1" />
          <rect x="-10" y="50" width="20" height="5" rx="1" fill="#4B5563" />
          <rect x="-3" y="55" width="6" height="15" rx="1" fill="#1F2937" />
        </g>
      )}
      {weaponType === "machado" && (
        <g transform="translate(140, 180) rotate(15)">
          <rect x="-2" y="0" width="4" height="70" rx="1" fill="#4B5563" />
          <path d="M-15 0 Q-2 15 -15 30 Z" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="1" />
          <path d="M15 0 Q2 15 15 30 Z" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="1" />
        </g>
      )}
      {weaponType === "arco" && (
        <g transform="translate(140, 180) rotate(15)">
          <path d="M0 0 Q-20 35 0 70" fill="none" stroke="#8B4513" strokeWidth="3" strokeLinecap="round" />
          <line x1="0" y1="0" x2="0" y2="70" stroke="#E5E7EB" strokeWidth="1" strokeDasharray="2,2" />
        </g>
      )}
      {weaponType === "cajado" && (
        <g transform="translate(140, 180) rotate(15)">
          <rect x="-2" y="0" width="4" height="80" rx="1" fill="#5D2E0C" />
          <circle cx="0" cy="0" r="8" fill="#60A5FA" filter="blur(1px)" />
        </g>
      )}

      {/* Neck */}
      <rect x="88" y="175" width="24" height="25" rx="4" fill={skinColor} />

      {/* Head */}
      <ellipse cx="100" cy="120" rx="55" ry="65" fill={skinColor} />

      {/* Eyes */}
      <ellipse cx="80" cy="125" rx="10" ry="8" fill="white" />
      <ellipse cx="120" cy="125" rx="10" ry="8" fill="white" />
      <circle cx="80" cy="125" r="5" fill={eyeColor} />
      <circle cx="120" cy="125" r="5" fill={eyeColor} />
      <circle cx="81" cy="123" r="2" fill="white" />
      <circle cx="121" cy="123" r="2" fill="white" />

      {/* Eyebrows */}
      <path d="M68 112 Q80 106 92 112" stroke={hairColor} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M108 112 Q120 106 132 112" stroke={hairColor} strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* Nose */}
      <path d="M97 135 Q100 142 103 135" stroke={skinColor} strokeWidth="2" fill="none" filter="brightness(0.85)" />

      {/* Mouth */}
      <path d="M85 152 Q100 162 115 152" stroke="#c47070" strokeWidth="2.5" fill="none" strokeLinecap="round" />

      {/* Ears */}
      <ellipse cx="45" cy="125" rx="8" ry="14" fill={skinColor} />
      <ellipse cx="155" cy="125" rx="8" ry="14" fill={skinColor} />

      {/* Hair */}
      {hairStyle === "curto" && (
        <g>
          <path d="M45 110 Q45 50 100 45 Q155 50 155 110 Q155 80 100 75 Q45 80 45 110Z" fill={hairColor} />
          <path d="M48 120 Q45 85 65 70" stroke={hairColor} strokeWidth="8" fill="none" strokeLinecap="round" />
          <path d="M152 120 Q155 85 135 70" stroke={hairColor} strokeWidth="8" fill="none" strokeLinecap="round" />
        </g>
      )}
      {hairStyle === "medio" && (
        <g>
          <path d="M42 130 Q40 50 100 42 Q160 50 158 130 Q155 80 100 72 Q45 80 42 130Z" fill={hairColor} />
          <path d="M42 130 Q38 160 45 175" stroke={hairColor} strokeWidth="12" fill="none" strokeLinecap="round" />
          <path d="M158 130 Q162 160 155 175" stroke={hairColor} strokeWidth="12" fill="none" strokeLinecap="round" />
        </g>
      )}
      {hairStyle === "longo" && (
        <g>
          <path d="M40 130 Q38 45 100 38 Q162 45 160 130 Q155 75 100 68 Q45 75 40 130Z" fill={hairColor} />
          <path d="M40 130 Q32 180 40 230" stroke={hairColor} strokeWidth="14" fill="none" strokeLinecap="round" />
          <path d="M160 130 Q168 180 160 230" stroke={hairColor} strokeWidth="14" fill="none" strokeLinecap="round" />
          <path d="M50 175 Q48 200 52 225" stroke={hairColor} strokeWidth="8" fill="none" strokeLinecap="round" opacity="0.7" />
          <path d="M150 175 Q152 200 148 225" stroke={hairColor} strokeWidth="8" fill="none" strokeLinecap="round" opacity="0.7" />
        </g>
      )}
      {hairStyle === "careca" && null}
      {hairStyle === "moicano" && (
        <g>
          <path d="M75 75 Q75 15 100 10 Q125 15 125 75" fill={hairColor} />
          <path d="M48 120 Q45 90 70 78" stroke={hairColor} strokeWidth="6" fill="none" strokeLinecap="round" />
          <path d="M152 120 Q155 90 130 78" stroke={hairColor} strokeWidth="6" fill="none" strokeLinecap="round" />
        </g>
      )}
      {hairStyle === "punk" && (
        <g>
          <path d="M50 100 L60 40 L80 60 L100 20 L120 60 L140 40 L150 100" fill={hairColor} />
          <path d="M100 10 L100 60" stroke={hairColor} strokeWidth="15" fill="none" strokeLinecap="round" />
        </g>
      )}
      {hairStyle === "pompadour" && (
        <g>
          <ellipse cx="100" cy="65" rx="55" ry="40" fill={hairColor} />
          <path d="M45 100 Q45 60 100 50 Q155 60 155 100" fill={hairColor} />
        </g>
      )}
      {hairStyle === "trancas" && (
        <g>
          <path d="M45 100 Q45 40 100 40 Q155 40 155 100" fill={hairColor} />
          <path d="M50 100 L45 230" stroke={hairColor} strokeWidth="8" strokeDasharray="10,5" />
          <path d="M65 100 L60 220" stroke={hairColor} strokeWidth="8" strokeDasharray="10,5" />
          <path d="M135 100 L140 220" stroke={hairColor} strokeWidth="8" strokeDasharray="10,5" />
          <path d="M150 100 L155 230" stroke={hairColor} strokeWidth="8" strokeDasharray="10,5" />
        </g>
      )}

      {/* Hats */}
      {hatType === "capuz" && (
        <path d="M40 140 Q40 30 100 25 Q160 30 160 140 L160 160 Q100 150 40 160 Z" fill="#4B5563" stroke="#1F2937" strokeWidth="2" opacity="0.9" />
      )}
      {hatType === "mago" && (
        <g>
          <path d="M30 105 L100 10 L170 105 Z" fill="#312E81" stroke="#1E1B4B" strokeWidth="2" />
          <ellipse cx="100" cy="105" rx="80" ry="10" fill="#312E81" stroke="#1E1B4B" strokeWidth="2" />
          <path d="M80 70 L120 70" stroke="#FBBF24" strokeWidth="4" />
        </g>
      )}
      {hatType === "coroa" && (
        <path d="M50 80 L50 40 L70 60 L100 30 L130 60 L150 40 L150 80 Z" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
      )}
      {hatType === "elmo" && (
        <g>
          <path d="M45 120 Q45 35 100 35 Q155 35 155 120 L155 145 L45 145 Z" fill="#9CA3AF" stroke="#4B5563" strokeWidth="2" />
          <rect x="70" y="100" width="60" height="8" fill="#4B5563" rx="2" />
          <path d="M100 35 L100 15" stroke="#B91C1C" strokeWidth="8" strokeLinecap="round" />
        </g>
      )}
    </svg>
  )
}
