import { 
  Lightbulb, 
  Briefcase, 
  Palette, 
  Leaf, 
  FlaskConical, 
  Rocket, 
  Sprout, 
  TrendingUp, 
  TreePine,
  Home,
  Plus,
  Search,
  FileText,
  MessageSquare,
  Sparkles,
  History,
  Calendar,
  Tag,
  Edit,
  Trash2,
  X,
  Download,
  Eye,
  Upload,
  Check
} from 'lucide-react';

// Color Palette - More sophisticated and muted
export const colors = {
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  secondary: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  purple: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7c3aed',
    800: '#6b21a8',
    900: '#581c87',
  }
};

// Category Icons - Replace emojis with clean icons
export const categoryIcons = {
  technology: { icon: Lightbulb, color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
  business: { icon: Briefcase, color: 'text-emerald-600', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200' },
  creative: { icon: Palette, color: 'text-purple-600', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' },
  personal: { icon: Leaf, color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
  research: { icon: FlaskConical, color: 'text-orange-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' },
  innovation: { icon: Rocket, color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' },
  default: { icon: Leaf, color: 'text-gray-600', bgColor: 'bg-gray-50', borderColor: 'border-gray-200' }
};

// Status Icons - Clean progression icons
export const statusIcons = {
  seedling: { icon: Sprout, color: 'text-green-600', bgColor: 'bg-green-50' },
  growing: { icon: TrendingUp, color: 'text-blue-600', bgColor: 'bg-blue-50' },
  mature: { icon: TreePine, color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
  default: { icon: Sprout, color: 'text-gray-600', bgColor: 'bg-gray-50' }
};

// Navigation Icons
export const navIcons = {
  home: Home,
  ideas: Lightbulb,
  create: Plus,
  search: Search,
  documents: FileText,
  chat: MessageSquare,
  ai: Sparkles,
  history: History,
  calendar: Calendar,
  tags: Tag,
  edit: Edit,
  delete: Trash2,
  close: X,
  download: Download,
  view: Eye,
  upload: Upload,
  check: Check,
  trendingUp: TrendingUp,
  treePine: TreePine
};

// Typography Scale
export const typography = {
  h1: 'text-4xl font-bold text-gray-900',
  h2: 'text-3xl font-semibold text-gray-900',
  h3: 'text-2xl font-semibold text-gray-900',
  h4: 'text-xl font-medium text-gray-900',
  h5: 'text-lg font-medium text-gray-900',
  h6: 'text-base font-medium text-gray-900',
  body: 'text-base text-gray-700',
  bodySmall: 'text-sm text-gray-600',
  caption: 'text-xs text-gray-500',
  button: 'text-sm font-medium',
  link: 'text-sm font-medium text-blue-600 hover:text-blue-700'
};

// Spacing Scale
export const spacing = {
  xs: 'space-y-1',
  sm: 'space-y-2',
  md: 'space-y-3',
  lg: 'space-y-4',
  xl: 'space-y-6',
  '2xl': 'space-y-8',
  '3xl': 'space-y-12'
};

// Card Styles
export const cardStyles = {
  base: 'bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200',
  elevated: 'bg-white rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-200',
  interactive: 'bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:scale-[1.02] transition-all duration-200 cursor-pointer',
  subtle: 'bg-gray-50 rounded-xl border border-gray-200',
  accent: 'bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200'
};

// Button Styles
export const buttonStyles = {
  primary: 'bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md',
  secondary: 'bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors',
  outline: 'border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors',
  ghost: 'text-gray-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors',
  danger: 'bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors',
  success: 'bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors'
};

// Helper Functions
export const getCategoryTheme = (category?: string) => {
  return categoryIcons[category as keyof typeof categoryIcons] || categoryIcons.default;
};

export const getStatusTheme = (status?: string) => {
  return statusIcons[status as keyof typeof statusIcons] || statusIcons.default;
}; 