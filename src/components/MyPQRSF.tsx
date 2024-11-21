import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

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

function MyPQRSF() {
  const [pqrsfs, setPqrsfs] = useState<PQRSF[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyPQRSFs = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3001/api/pqrsf/my', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setPqrsfs(data);
        } else {
          throw new Error('Error al cargar los datos');
        }
      } catch (error) {
        setError('Error al cargar tus PQRSF');
      } finally {
        setLoading(false);
      }
    };

    fetchMyPQRSFs();
  }, []);

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
          Mis PQRSF
        </h2>

        {pqrsfs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No has enviado ningún PQRSF todavía
          </div>
        ) : (
          <div className="space-y-6">
            {pqrsfs.map((pqrsf) => (
              <div key={pqrsf.id} className="bg-gray-50 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {pqrsf.motivo}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(pqrsf.fecha_creacion).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      pqrsf.estado === 'resuelto'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {pqrsf.estado}
                    </span>
                  </div>
                </div>
                
                <div className="prose max-w-none">
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Descripción:</h4>
                  <p className="text-gray-600 mb-4">{pqrsf.descripcion}</p>
                  
                  {pqrsf.respuesta && (
                    <>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Respuesta:</h4>
                      <p className="text-gray-600 bg-white p-4 rounded-md border border-gray-200">
                        {pqrsf.respuesta}
                      </p>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyPQRSF;