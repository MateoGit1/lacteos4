import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Send, CheckCircle, XCircle } from 'lucide-react';

interface PQRSF {
  id: number;
  nombre: string;
  celular: string;
  correo: string;
  descripcion: string;
  motivo: string;
  estado: 'pendiente' | 'resuelto';
  respuesta?: string;
  fecha_creacion: string;
}

function Dashboard() {
  const navigate = useNavigate();
  const [pqrsfs, setPqrsfs] = useState<PQRSF[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [respuestas, setRespuestas] = useState<{ [key: number]: string }>({});
  const [sending, setSending] = useState<{ [key: number]: boolean }>({});
  const [notifications, setNotifications] = useState<{ [key: number]: { type: 'success' | 'error'; message: string } }>({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchPQRSFs();
  }, [navigate]);

  const fetchPQRSFs = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch('http://localhost:3001/api/pqrsf', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('token');
          localStorage.removeItem('userRole');
          localStorage.removeItem('isAuthenticated');
          navigate('/login');
          return;
        }
        throw new Error('Error al cargar los datos');
      }
      
      const data = await response.json();
      setPqrsfs(data);
      const initialRespuestas: { [key: number]: string } = {};
      data.forEach((pqrsf: PQRSF) => {
        initialRespuestas[pqrsf.id] = pqrsf.respuesta || '';
      });
      setRespuestas(initialRespuestas);
    } catch (error) {
      setError('Error al cargar los PQRSF');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: number, newStatus: 'pendiente' | 'resuelto') => {
    try {
      setSending(prev => ({ ...prev, [id]: true }));
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`http://localhost:3001/api/pqrsf/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          estado: newStatus,
          respuesta: respuestas[id]
        }),
      });
      
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('token');
          localStorage.removeItem('userRole');
          localStorage.removeItem('isAuthenticated');
          navigate('/login');
          return;
        }
        throw new Error('Error al actualizar');
      }

      setNotifications(prev => ({
        ...prev,
        [id]: { type: 'success', message: 'Estado actualizado y respuesta enviada' }
      }));
      await fetchPQRSFs();
    } catch (error) {
      setNotifications(prev => ({
        ...prev,
        [id]: { type: 'error', message: 'Error al actualizar el estado' }
      }));
    } finally {
      setSending(prev => ({ ...prev, [id]: false }));
      setTimeout(() => {
        setNotifications(prev => {
          const newNotifications = { ...prev };
          delete newNotifications[id];
          return newNotifications;
        });
      }, 5000);
    }
  };

  const handleSendResponse = async (id: number) => {
    try {
      setSending(prev => ({ ...prev, [id]: true }));
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`http://localhost:3001/api/pqrsf/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          estado: 'resuelto',
          respuesta: respuestas[id]
        }),
      });
      
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('token');
          localStorage.removeItem('userRole');
          localStorage.removeItem('isAuthenticated');
          navigate('/login');
          return;
        }
        throw new Error('Error al enviar la respuesta');
      }

      setNotifications(prev => ({
        ...prev,
        [id]: { type: 'success', message: 'Respuesta enviada exitosamente' }
      }));
      await fetchPQRSFs();
    } catch (error) {
      setNotifications(prev => ({
        ...prev,
        [id]: { type: 'error', message: 'Error al enviar la respuesta' }
      }));
    } finally {
      setSending(prev => ({ ...prev, [id]: false }));
      setTimeout(() => {
        setNotifications(prev => {
          const newNotifications = { ...prev };
          delete newNotifications[id];
          return newNotifications;
        });
      }, 5000);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-xl p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Listado de PQRSF
        </h2>

        {pqrsfs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No hay PQRSF registrados
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contacto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Motivo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Respuesta
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pqrsfs.map((pqrsf) => (
                  <tr key={pqrsf.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(pqrsf.fecha_creacion).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {pqrsf.nombre}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {pqrsf.celular}<br/>
                      {pqrsf.correo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {pqrsf.motivo}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                      <div className="truncate">
                        {pqrsf.descripcion}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        pqrsf.estado === 'resuelto'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {pqrsf.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="relative">
                        <textarea
                          rows={3}
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                          value={respuestas[pqrsf.id]}
                          onChange={(e) => setRespuestas({
                            ...respuestas,
                            [pqrsf.id]: e.target.value
                          })}
                          placeholder="Escriba una respuesta..."
                        />
                        {notifications[pqrsf.id] && (
                          <div className={`absolute -bottom-6 left-0 right-0 text-sm ${
                            notifications[pqrsf.id].type === 'success' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {notifications[pqrsf.id].type === 'success' ? (
                              <CheckCircle className="inline-block w-4 h-4 mr-1" />
                            ) : (
                              <XCircle className="inline-block w-4 h-4 mr-1" />
                            )}
                            {notifications[pqrsf.id].message}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex flex-col space-y-2">
                        <select
                          value={pqrsf.estado}
                          onChange={(e) => handleStatusChange(pqrsf.id, e.target.value as 'pendiente' | 'resuelto')}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                          disabled={sending[pqrsf.id]}
                        >
                          <option value="pendiente">Pendiente</option>
                          <option value="resuelto">Resuelto</option>
                        </select>
                        
                        <button
                          onClick={() => handleSendResponse(pqrsf.id)}
                          disabled={!respuestas[pqrsf.id] || sending[pqrsf.id]}
                          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {sending[pqrsf.id] ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          ) : (
                            <Send className="w-4 h-4 mr-2" />
                          )}
                          Enviar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;