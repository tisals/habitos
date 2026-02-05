import React from 'react';
import { User, UserStats } from '../types';
import ThemeToggle from '../components/ui/ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';

interface ProfileViewProps {
  user: User;
  stats: UserStats;
  onBack: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, stats, onBack }) => {
  const { theme } = useTheme();

  return (
    <div className="flex flex-col h-screen bg-soft-white dark:bg-gray-900 transition-colors duration-200">
      <header className="bg-deep-blue dark:bg-gray-800 text-white p-4 flex items-center justify-between">
        <button onClick={onBack} className="text-2xl">←</button>
        <h1 className="text-xl font-semibold">Mi Perfil</h1>
        <div className="w-8"></div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-200">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-20 h-20 bg-electric-blue dark:bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
              <p className="text-gray-600 dark:text-gray-400">Nivel {user.level}</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                {user.isPremium ? '⭐ Premium' : '🆓 Free'}
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-200">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">📊 Progreso</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 dark:text-gray-300">Racha actual</span>
              <span className="text-2xl font-bold text-electric-blue dark:text-blue-400">
                {stats.streak} días 🔥
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700 dark:text-gray-300">Rituales hoy</span>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {stats.completionsToday.length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700 dark:text-gray-300">Último ritual</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {stats.lastCompletionDate || 'Ninguno'}
              </span>
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-200">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">⚙️ Preferencias</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Tema de la aplicación</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Modo {theme === 'light' ? 'claro' : 'oscuro'}
                </p>
              </div>
              <ThemeToggle />
            </div>

            <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Notificaciones</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Recordatorios de rituales
                </p>
              </div>
              <button className="relative inline-flex items-center h-8 w-16 rounded-full transition-colors duration-200 bg-gray-300 dark:bg-gray-600">
                <span className="inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-200 translate-x-1"></span>
              </button>
            </div>

            <div className="flex justify-between items-center py-3">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Modo ritual preferido</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Asistido con audio
                </p>
              </div>
              <select className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-electric-blue">
                <option value="assisted">Asistido</option>
                <option value="manual">Manual</option>
              </select>
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-200">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">ℹ️ Información</h3>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <p>Versión: 1.0.0</p>
            <p>Usuario desde: {new Date().toLocaleDateString()}</p>
            <button className="text-electric-blue dark:text-blue-400 hover:underline">
              Términos y condiciones
            </button>
            <br />
            <button className="text-electric-blue dark:text-blue-400 hover:underline">
              Política de privacidad
            </button>
          </div>
        </section>

        <button className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition-colors duration-200">
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};

export default ProfileView;
