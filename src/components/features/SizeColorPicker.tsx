import { ProductColor } from '@/types';

interface SizeColorPickerProps {
  sizes: string[];
  colors: ProductColor[];
  selectedSize: string;
  selectedColor: ProductColor;
  onSizeChange: (size: string) => void;
  onColorChange: (color: ProductColor) => void;
}

export default function SizeColorPicker({
  sizes,
  colors,
  selectedSize,
  selectedColor,
  onSizeChange,
  onColorChange,
}: SizeColorPickerProps) {
  return (
    <div className="space-y-5">
      {/* Color picker */}
      <div>
        <div className="flex items-center gap-2 mb-2.5">
          <span className="text-sm font-body font-medium text-foreground">Cor:</span>
          <span className="text-sm font-body text-muted-foreground">{selectedColor.name}</span>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {colors.map((color) => (
            <button
              key={color.name}
              onClick={() => onColorChange(color)}
              className={`size-9 rounded-full border-2 transition-all duration-200 ${
                selectedColor.name === color.name
                  ? 'border-primary ring-2 ring-primary/25 scale-110'
                  : 'border-black/10 hover:scale-105'
              }`}
              style={{ backgroundColor: color.hex }}
              title={color.name}
              aria-label={`Cor ${color.name}`}
            />
          ))}
        </div>
      </div>

      {/* Size picker */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-sm font-body font-medium text-foreground">Tamanho:</span>
            <span className="text-sm font-body text-muted-foreground">{selectedSize}</span>
          </div>
          <button className="text-xs font-body text-primary hover:underline">Guia de tamanhos</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => onSizeChange(size)}
              className={`min-w-[3rem] px-3 py-2 rounded-xl text-sm font-body font-medium transition-all duration-200 ${
                selectedSize === size
                  ? 'bg-primary text-white shadow-md shadow-primary/20'
                  : 'glass-card hover:border-primary/30 text-foreground'
              }`}
              aria-label={`Tamanho ${size}`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
