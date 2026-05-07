// Line-art icon set. Ported from the design + adds the missing 'heart' icon.
export default function Icon({ name, size = 22, stroke = 1.6, color = 'currentColor' }) {
  const props = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: stroke, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'arrow-right': return <svg {...props}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
    case 'arrow-up-right': return <svg {...props}><path d="M7 17 17 7M9 7h8v8" /></svg>;
    case 'menu': return <svg {...props}><path d="M3 6h18M3 12h18M3 18h18" /></svg>;
    case 'x': return <svg {...props}><path d="M6 6l12 12M18 6l-12 12" /></svg>;
    case 'check': return <svg {...props}><path d="M4 12l5 5L20 6" /></svg>;
    case 'plus': return <svg {...props}><path d="M12 5v14M5 12h14" /></svg>;
    case 'minus': return <svg {...props}><path d="M5 12h14" /></svg>;
    case 'star': return <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.8L5.8 21l1.6-7L2 9.2l7.1-.6L12 2z" /></svg>;
    case 'globe': return <svg {...props}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" /></svg>;
    case 'code': return <svg {...props}><path d="M16 18l6-6-6-6M8 6l-6 6 6 6M14 4l-4 16" /></svg>;
    case 'search': return <svg {...props}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" /></svg>;
    case 'rocket': return <svg {...props}><path d="M14 4l6 6-9 9-5 1 1-5 7-7 6 6" /><circle cx="15.5" cy="8.5" r="1.5" /></svg>;
    case 'megaphone': return <svg {...props}><path d="M3 11v2a2 2 0 002 2h2l8 4V5L7 9H5a2 2 0 00-2 2zM18 8a4 4 0 010 8" /></svg>;
    case 'wrench': return <svg {...props}><path d="M14 7a4 4 0 105 5l5 5-2 2-5-5a4 4 0 01-5-5l-3-3-2 2 3 3z" /></svg>;
    case 'lightning': return <svg {...props}><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" /></svg>;
    case 'shield': return <svg {...props}><path d="M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6l8-3z" /></svg>;
    case 'mail': return <svg {...props}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>;
    case 'phone': return <svg {...props}><path d="M5 4h4l2 5-3 2a11 11 0 005 5l2-3 5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" /></svg>;
    case 'whatsapp': return <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.93.51 3.71 1.4 5.27L2 22l4.96-1.5a9.93 9.93 0 005.08 1.39c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.84 14.13c-.25.7-1.42 1.32-2 1.4-.51.07-1.16.1-1.86-.12-.43-.13-.97-.31-1.67-.61-2.94-1.27-4.86-4.23-5-4.43-.15-.2-1.2-1.59-1.2-3.04 0-1.45.76-2.16 1.03-2.46.27-.3.59-.37.79-.37.2 0 .4 0 .57.01.18.01.42-.07.66.5.25.62.84 2.07.91 2.22.07.15.12.32.02.52-.1.2-.15.32-.3.5-.15.17-.31.39-.45.52-.15.15-.31.31-.13.61.17.3.78 1.29 1.68 2.09 1.16 1.03 2.13 1.36 2.43 1.51.3.15.48.13.66-.07.18-.2.76-.89.96-1.19.2-.3.4-.25.66-.15.27.1 1.7.8 1.99.95.3.15.49.22.56.35.07.13.07.74-.18 1.45z" /></svg>;
    case 'map': return <svg {...props}><path d="M9 4l-6 2v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14" /></svg>;
    case 'instagram': return <svg {...props}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.7" fill={color} /></svg>;
    case 'facebook': return <svg {...props}><path d="M14 22V12h3l1-4h-4V6c0-1 .5-2 2-2h2V0h-3a5 5 0 00-5 5v3H7v4h3v10z" /></svg>;
    case 'linkedin': return <svg {...props}><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M8 10v8M8 7v.01M12 18v-5a2 2 0 014 0v5M16 18v-5a2 2 0 014 0v5" /></svg>;
    case 'github': return <svg {...props}><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-4a4 4 0 00-1-3c3-.3 6-1.5 6-7a5.5 5.5 0 00-1.5-4 5 5 0 00-.1-3.7s-1.2-.4-4 1.5a13 13 0 00-7 0c-2.8-2-4-1.5-4-1.5A5 5 0 005 5.6 5.5 5.5 0 003.5 9.6c0 5.5 3 6.7 6 7a4 4 0 00-1 3v4" /></svg>;
    case 'twitter': return <svg {...props}><path d="M22 4.01s-2 .5-3 1c-1-1-3-1-4-.5C13 5 12 7 12 9v1c-4 0-7-2-9-4 0 0-3 6 3 9-1 1-3 1-5 1 0 2 4 3 7 3 5 0 9-4 10-9 0-1 0-2 .5-2 1-1 1.5-2 2-3z" /></svg>;
    case 'database': return <svg {...props}><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5v6c0 2 4 3 9 3s9-1 9-3V5M3 11v6c0 2 4 3 9 3s9-1 9-3v-6" /></svg>;
    case 'cart': return <svg {...props}><circle cx="9" cy="20" r="1.5" /><circle cx="18" cy="20" r="1.5" /><path d="M2 4h2l3 12h12l3-9H6" /></svg>;
    case 'chart': return <svg {...props}><path d="M3 3v18h18M7 16l3-4 3 2 4-7" /></svg>;
    case 'briefcase': return <svg {...props}><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2M3 13h18" /></svg>;
    case 'heart': return <svg {...props}><path d="M12 21s-7-4.5-9.5-9A5 5 0 0112 6a5 5 0 019.5 6c-2.5 4.5-9.5 9-9.5 9z" /></svg>;
    case 'dot': return <svg width={size} height={size} viewBox="0 0 8 8"><circle cx="4" cy="4" r="3" fill={color} /></svg>;
    default: return null;
  }
}
