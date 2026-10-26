import React, { useState, useRef } from "react";
import { Check } from "lucide-react";
import { Variant } from "../../types";
import { announce } from "../../lib/pageTransition";
import { getVariantHex, isDarkHex, FALLBACK_HEX } from "../../data/colours";

export interface ColourSwatchProps {
  variants: Variant[];
  selectedVariantId: string;
  onSelect: (variant: Variant) => void;
  onHover?: (variant: Variant | null) => void;
  size?: "sm" | "md" | "lg";
  maxVisible?: number;
  showCheckmark?: boolean;
  ringOffsetClass?: string;
  className?: string;
}

export const ColourSwatch: React.FC<ColourSwatchProps> = ({
  variants,
  selectedVariantId,
  onSelect,
  onHover,
  size = "sm",
  maxVisible,
  showCheckmark = false,
  ringOffsetClass = "ring-offset-white",
  className = "",
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const swatchRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const hasPreloadedRef = useRef(false);

  // Lazy low-priority preload of other variants images on interaction
  const triggerPreload = () => {
    if (hasPreloadedRef.current) return;
    hasPreloadedRef.current = true;
    variants.forEach((v) => {
      if (v.id !== selectedVariantId && v.images?.[0]) {
        const img = new Image();
        img.decoding = "async";
        img.src = v.images[0];
      }
    });
  };

  const shouldLimit = Boolean(maxVisible && !isExpanded && variants.length > maxVisible);
  const visibleVariants = shouldLimit && maxVisible ? variants.slice(0, maxVisible) : variants;
  const remainingCount = shouldLimit && maxVisible ? variants.length - maxVisible : 0;

  const handleSelect = (v: Variant) => {
    onSelect(v);
    announce(`Colour: ${v.colourName}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = visibleVariants.findIndex((v) => v.id === selectedVariantId);

    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (currentIndex >= 0 && visibleVariants[currentIndex]) {
        handleSelect(visibleVariants[currentIndex]);
      }
      return;
    }

    let targetIndex: number;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      targetIndex = currentIndex >= 0 ? (currentIndex + 1) % visibleVariants.length : 0;
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      targetIndex =
        currentIndex >= 0
          ? (currentIndex - 1 + visibleVariants.length) % visibleVariants.length
          : visibleVariants.length - 1;
    } else if (e.key === "Home") {
      e.preventDefault();
      targetIndex = 0;
    } else if (e.key === "End") {
      e.preventDefault();
      targetIndex = visibleVariants.length - 1;
    } else {
      return;
    }

    if (targetIndex >= 0 && visibleVariants[targetIndex]) {
      const nextVariant = visibleVariants[targetIndex];
      handleSelect(nextVariant);
      swatchRefs.current[targetIndex]?.focus();
    }
  };

  // Size dimensions: visual dot with extended 44px hit area
  const sizeClasses = {
    sm: "w-[22px] h-[22px] before:absolute before:-inset-[11px] before:content-['']",
    md: "w-7 h-7 before:absolute before:-inset-[8px] before:content-['']",
    lg: "w-9 h-9 before:absolute before:-inset-[4px] before:content-['']",
  }[size];

  return (
    <div
      role="radiogroup"
      aria-label="Colour"
      onKeyDown={handleKeyDown}
      onMouseEnter={triggerPreload}
      onFocus={triggerPreload}
      onTouchStart={triggerPreload}
      className={`flex items-center flex-wrap gap-2 ${className}`}
    >
      {visibleVariants.map((v, idx) => {
        const isSelected = v.id === selectedVariantId;
        const isFirst = idx === 0;
        const hasSelection = visibleVariants.some((item) => item.id === selectedVariantId);
        const tabIndex = isSelected ? 0 : !hasSelection && isFirst ? 0 : -1;

        const hex = getVariantHex(v);
        const isDark = isDarkHex(hex);
        const isFallback = hex.toUpperCase() === FALLBACK_HEX;

        const backgroundStyle = v.patternImage
          ? {
              backgroundImage: `url(${v.patternImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : isFallback
          ? {
              backgroundColor: FALLBACK_HEX,
              backgroundImage:
                "linear-gradient(135deg, transparent calc(50% - 1.5px), #ffffff calc(50% - 1.5px), #ffffff calc(50% + 1.5px), transparent calc(50% + 1.5px))",
            }
          : {
              backgroundColor: hex,
            };

        return (
          <button
            key={v.id}
            ref={(el) => {
              swatchRefs.current[idx] = el;
            }}
            type="button"
            role="radio"
            aria-checked={isSelected}
            tabIndex={tabIndex}
            title={v.colourName}
            aria-label={`Colour: ${v.colourName}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleSelect(v);
            }}
            onMouseEnter={() => onHover?.(v)}
            onMouseLeave={() => onHover?.(null)}
            className={`relative rounded-full transition-all flex items-center justify-center shrink-0 ${sizeClasses} ${
              isSelected
                ? `ring-2 ring-gold ring-offset-2 ${ringOffsetClass} scale-105 z-10`
                : `hover:ring-2 hover:ring-gold/70 hover:scale-105 ${isDark ? "ring-1 ring-white/20" : ""}`
            } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2`}
            style={{
              boxShadow: "inset 0 0 0 1px rgba(0, 0, 0, 0.28), 0 1px 2px rgba(0, 0, 0, 0.12)",
              ...backgroundStyle,
            }}
          >
            {showCheckmark && isSelected && (
              <Check
                className={`w-4 h-4 ${
                  isDark ? "text-white" : "text-obsidian"
                }`}
                strokeWidth={2.5}
                aria-hidden="true"
              />
            )}
          </button>
        );
      })}

      {remainingCount > 0 && (
        <button
          type="button"
          aria-label={`Show ${remainingCount} more colourways`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsExpanded(true);
          }}
          className="relative inline-flex items-center justify-center text-[10px] font-bold text-ink-600 hover:text-gold transition-colors pl-1 py-0.5 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold before:absolute before:-inset-2 before:content-['']"
        >
          +{remainingCount}
        </button>
      )}
    </div>
  );
};
