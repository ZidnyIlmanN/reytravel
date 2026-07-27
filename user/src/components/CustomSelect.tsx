'use client';
import { useState, useRef, useEffect } from 'react';

type Option = {
  value: string;
  label: string;
};

type CustomSelectProps = {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export default function CustomSelect({ options, value, onChange, placeholder = "Pilih salah satu" }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(o => o.value === value);

  return (
    <div className="relative" ref={containerRef}>
      <div 
        className={`w-full px-6 py-4 rounded-[14px] border ${isOpen ? 'border-primary ring-2 ring-primary/20' : 'border-outline-variant/50 hover:border-primary/50'} cursor-pointer transition-all bg-white flex items-center justify-between select-none`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`truncate mr-4 ${selectedOption && selectedOption.value !== "" ? 'text-on-surface font-semibold' : 'text-outline-variant'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className={`material-symbols-outlined text-outline transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180 text-primary' : ''}`}>
          keyboard_arrow_down
        </span>
      </div>

      {isOpen && (
        <div className="absolute z-[100] w-full mt-2 bg-white rounded-2xl shadow-xl border border-outline-variant/20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 top-full">
          <ul className="max-h-60 overflow-y-auto w-full py-2 scrollbar-hide">
            {options.map((opt) => {
              const isSelected = value === opt.value;
              return (
                <li 
                  key={opt.value}
                  onClick={() => { onChange(opt.value); setIsOpen(false); }}
                  className={`w-full px-6 py-3 cursor-pointer transition-colors flex items-center justify-between ${
                    isSelected ? 'bg-primary/5 text-primary font-bold' : 'text-on-surface hover:bg-surface-container'
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected && <span className="material-symbols-outlined text-[18px]">check</span>}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
