import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Sparkles, PlusCircle, LayoutDashboard, CheckCircle2 } from 'lucide-react';

const navItems = [
  { to: '/initiative', label: 'Initiative', icon: Sparkles },
  { to: '/create', label: 'Create', icon: PlusCircle },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/completed', label: 'Completed', icon: CheckCircle2 },
];

export function Navigation() {
  return (
    <nav className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bubble-gradient flex items-center justify-center">
              <span className="text-white font-bold text-sm">D</span>
            </div>
            <span className="text-xl font-bold text-white">Deputy</span>
          </NavLink>

          {/* Nav links */}
          <div className="flex items-center gap-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  )
                }
              >
                <Icon className="w-4 h-4" />
                {label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
