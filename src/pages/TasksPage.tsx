import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTaskManager } from '../hooks/useTaskManager';
import { useToast } from '../hooks/useToast';
import { useForm } from '../hooks/useForm';

interface TaskFormData {
  title: string;
  description: string;
}

export const TasksPage: React.FC = () => {
  const { user, logout } = useAuth();
  const { tasks, loading, createTask, toggleTask, deleteTask, stats } = useTaskManager();
  const { message, type, isVisible, showToast, hideToast } = useToast();
  const { values, handleChange, resetForm } = useForm<TaskFormData>({
    title: '',
    description: ''
  });

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!values.title.trim()) {
      showToast('El título es requerido', 'error');
      return;
    }

    try {
      await createTask({
        title: values.title.trim(),
        description: values.description.trim() || undefined,
      });
      
      resetForm();
      showToast('✅ Tarea creada exitosamente', 'success');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear la tarea';
      showToast(errorMessage, 'error');
    }
  };

  const handleToggleTask = async (taskId: number) => {
    try {
      const updatedTask = await toggleTask(taskId);
      if (updatedTask) {
        showToast(
          updatedTask.done 
            ? '✅ Tarea marcada como completada' 
            : '🔄 Tarea marcada como pendiente',
          'success'
        );
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar la tarea';
      showToast(errorMessage, 'error');
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      return;
    }

    try {
      await deleteTask(taskId);
      showToast('🗑️ Tarea eliminada exitosamente', 'success');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar la tarea';
      showToast(errorMessage, 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-pulse text-blue-600 text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Cargando tareas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast notification */}
      {isVisible && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg animate-bounce ${
          type === 'error' ? 'bg-red-500' : 'bg-green-500'
        } text-white`}>
          <div className="flex items-center space-x-2">
            <span>{message}</span>
            <button 
              onClick={hideToast}
              className="ml-2 text-white hover:text-gray-200"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mis Tareas</h1>
              <p className="text-gray-600">Bienvenido, {user?.name || user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Formulario para crear nueva tarea */}
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">✨ Crear Nueva Tarea</h2>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Título *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={values.title}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="¿Qué necesitas hacer?"
                  required
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Descripción (opcional)
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={values.description}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Descripción adicional..."
                />
              </div>
              <button
                type="submit"
                disabled={loading || !values.title.trim()}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 ${
                  loading 
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                } ${!values.title.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Creando tarea...</span>
                  </div>
                ) : (
                  <span>➕ Crear Tarea</span>
                )}
              </button>
            </form>
          </div>

          {/* Lista de tareas */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                📋 Todas las Tareas ({tasks.length})
              </h2>
            </div>

            {tasks.length === 0 ? (
              <div className="p-6 text-center">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No hay tareas</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Comienza creando tu primera tarea arriba.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {tasks.map((task) => (
                  <li key={task.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleToggleTask(task.id)}
                          className={`flex-shrink-0 h-6 w-6 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-colors ${
                            task.done
                              ? 'bg-green-500 border-green-500 text-white hover:bg-green-600'
                              : 'border-gray-300 hover:border-green-500 text-transparent hover:text-green-500'
                          }`}
                          title={task.done ? 'Marcar como pendiente' : 'Marcar como completada'}
                        >
                          ✓
                        </button>
                        <div className="flex-1">
                          <h3 className={`text-sm font-medium transition-all ${
                            task.done ? 'line-through text-gray-500' : 'text-gray-900'
                          }`}>
                            {task.title}
                          </h3>
                          {task.description && (
                            <p className={`text-sm mt-1 transition-all ${
                              task.done ? 'line-through text-gray-400' : 'text-gray-600'
                            }`}>
                              {task.description}
                            </p>
                          )}
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                            <span>📅 {new Date(task.createdAt).toLocaleDateString()}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              task.done 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {task.done ? '✅ Completada' : '⏳ Pendiente'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="text-red-600 hover:text-red-900 hover:bg-red-50 p-2 rounded-md transition-colors"
                        title="Eliminar tarea"
                      >
                        <span className="text-lg">🗑️</span>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Estadísticas */}
          {tasks.length > 0 && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                <div className="text-sm text-blue-800">Total de tareas</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                <div className="text-sm text-green-800">Completadas</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                <div className="text-sm text-yellow-800">Pendientes</div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};