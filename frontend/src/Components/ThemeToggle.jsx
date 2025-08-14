import { useTheme } from './ThemeProvider'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button onClick={toggleTheme} className="p-2 rounded text-sm bg-gray-200 dark:bg-gray-800 dark:text-white">
      {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}
