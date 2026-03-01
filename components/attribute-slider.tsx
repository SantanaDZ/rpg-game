"use client"

interface AttributeSliderProps {
  label: string
  value: number
  onChange: (value: number) => void
  icon: React.ReactNode
  max?: number
}

export function AttributeSlider({ label, value, onChange, icon, max = 10 }: AttributeSliderProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          {icon}
          <span>{label}</span>
        </div>
        <span className="text-sm font-bold text-primary tabular-nums w-12 text-right">
          {value} <span className="text-[10px] text-muted-foreground font-normal">/ {max}</span>
        </span>
      </div>
      <div className="relative flex items-center gap-3">
        <input
          type="range"
          min={1}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer bg-secondary accent-primary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer"
        />
      </div>
      <div className="flex justify-between text-[10px] text-muted-foreground px-0.5">
        <span>1</span>
        <span>{Math.floor(max / 2)}</span>
        <span>{max}</span>
      </div>
    </div>
  )
}
