import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['PT Sans', 'sans-serif'],
        headline: ['Poppins', 'sans-serif'],
        code: ['monospace'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'gradient-shift': {
          '0%, 100%': {
            'background-position': '0% 50%',
          },
          '50%': {
            'background-position': '100% 50%',
          },
        },
         'aura-pulse': {
          '0%, 100%': { 'box-shadow': '0 10px 45px -10px rgba(59, 130, 246, 0.3), 0 4px 20px -4px rgba(59, 130, 246, 0.2)' },
          '5%': { 'box-shadow': '0 10px 45px -10px rgba(239, 68, 68, 0.3), 0 4px 20px -4px rgba(239, 68, 68, 0.2)' },      
          '10%': { 'box-shadow': '0 10px 45px -10px rgba(249, 115, 22, 0.3), 0 4px 20px -4px rgba(249, 115, 22, 0.2)' },    
          '15%': { 'box-shadow': '0 10px 45px -10px rgba(234, 179, 8, 0.3), 0 4px 20px -4px rgba(234, 179, 8, 0.2)' },     
          '20%': { 'box-shadow': '0 10px 45px -10px rgba(132, 204, 22, 0.3), 0 4px 20px -4px rgba(132, 204, 22, 0.2)' },    
          '25%': { 'box-shadow': '0 10px 45px -10px rgba(34, 197, 94, 0.3), 0 4px 20px -4px rgba(34, 197, 94, 0.2)' },     
          '30%': { 'box-shadow': '0 10px 45px -10px rgba(20, 184, 166, 0.3), 0 4px 20px -4px rgba(20, 184, 166, 0.2)' },    
          '35%': { 'box-shadow': '0 10px 45px -10px rgba(6, 182, 212, 0.3), 0 4px 20px -4px rgba(6, 182, 212, 0.2)' },     
          '40%': { 'box-shadow': '0 10px 45px -10px rgba(59, 130, 246, 0.3), 0 4px 20px -4px rgba(59, 130, 246, 0.2)' },    
          '45%': { 'box-shadow': '0 10px 45px -10px rgba(99, 102, 241, 0.3), 0 4px 20px -4px rgba(99, 102, 241, 0.2)' },     
          '50%': { 'box-shadow': '0 10px 45px -10px rgba(139, 92, 246, 0.3), 0 4px 20px -4px rgba(139, 92, 246, 0.2)' },    
          '55%': { 'box-shadow': '0 10px 45px -10px rgba(168, 85, 247, 0.3), 0 4px 20px -4px rgba(168, 85, 247, 0.2)' },    
          '60%': { 'box-shadow': '0 10px 45px -10px rgba(217, 70, 239, 0.3), 0 4px 20px -4px rgba(217, 70, 239, 0.2)' },    
          '65%': { 'box-shadow': '0 10px 45px -10px rgba(236, 72, 153, 0.3), 0 4px 20px -4px rgba(236, 72, 153, 0.2)' },    
          '70%': { 'box-shadow': '0 10px 45px -10px rgba(244, 63, 94, 0.3), 0 4px 20px -4px rgba(244, 63, 94, 0.2)' },     
          '75%': { 'box-shadow': '0 10px 45px -10px rgba(29, 78, 216, 0.3), 0 4px 20px -4px rgba(29, 78, 216, 0.2)' },     
          '80%': { 'box-shadow': '0 10px 45px -10px rgba(107, 33, 168, 0.3), 0 4px 20px -4px rgba(107, 33, 168, 0.2)' },   
          '85%': { 'box-shadow': '0 10px 45px -10px rgba(190, 24, 93, 0.3), 0 4px 20px -4px rgba(190, 24, 93, 0.2)' },     
          '90%': { 'box-shadow': '0 10px 45px -10px rgba(22, 163, 74, 0.3), 0 4px 20px -4px rgba(22, 163, 74, 0.2)' },     
          '95%': { 'box-shadow': '0 10px 45px -10px rgba(251, 146, 60, 0.3), 0 4px 20px -4px rgba(251, 146, 60, 0.2)' },    
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'gradient-shift': 'gradient-shift 4s ease infinite',
        'aura-pulse': 'aura-pulse 20s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
