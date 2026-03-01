"use client"

interface ColorPickerProps {
  label: string
  value: string
  onChange: (value: string) => void
  presets: string[]
}

export function ColorPicker({ label, value, onChange, presets }: ColorPickerProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div className="flex items-center gap-2 flex-wrap">
        {presets.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            className="h-8 w-8 rounded-full border-2 transition-all cursor-pointer"
            style={{
              backgroundColor: color,
              borderColor: value === color ? "var(--primary)" : "transparent",
              boxShadow: value === color ? "0 0 0 2px var(--background), 0 0 0 4px var(--primary)" : "none",
            }}
            aria-label={`Cor ${color}`}
          />
        ))}
        <div className="relative h-8 w-8">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 h-8 w-8 cursor-pointer rounded-full opacity-0"
            aria-label="Escolher cor personalizada"
          />
          <div
            className="h-8 w-8 rounded-full border-2 border-border bg-gradient-to-br from-red-500 via-green-500 to-blue-500 pointer-events-none"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  )
}
