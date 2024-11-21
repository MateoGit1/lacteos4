import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';

function FormularioPQRSF() {
  const [formData, setFormData] = useState({
    nombre: '',
    celular: '',
    correo: '',
    descripcion: '',
    motivo: ''
  });
  const [acceptedPolicy, setAcceptedPolicy] = useState(false);
  const [showPolicy, setShowPolicy] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({
    nombre: '',
    celular: ''
  });

  const validateName = (value: string) => {
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(value)) {
      return 'Solo se permiten letras';
    }
    if (value.length > 35) {
      return 'Máximo 35 caracteres';
    }
    return '';
  };

  const validatePhone = (value: string) => {
    if (!/^\d*$/.test(value)) {
      return 'Solo se permiten números';
    }
    if (value.length > 0 && value.length < 7) {
      return 'Mínimo 7 números';
    }
    if (value.length > 15) {
      return 'Máximo 15 números';
    }
    return '';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let newValue = value;
    let error = '';

    if (name === 'nombre') {
      if (value.length <= 35) {
        newValue = value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
      } else {
        newValue = value.slice(0, 35);
      }
      error = validateName(newValue);
    }

    if (name === 'celular') {
      newValue = value.replace(/\D/g, '').slice(0, 15);
      error = validatePhone(newValue);
    }

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    setValidationErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!acceptedPolicy) {
      setError('Debe aceptar la política de tratamiento de datos para continuar');
      return;
    }

    const nameError = validateName(formData.nombre);
    const phoneError = validatePhone(formData.celular);

    if (nameError || phoneError) {
      setValidationErrors({
        nombre: nameError,
        celular: phoneError
      });
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/pqrsf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        alert('PQRSF enviado exitosamente');
        setFormData({
          nombre: '',
          celular: '',
          correo: '',
          descripcion: '',
          motivo: ''
        });
        setAcceptedPolicy(false);
      }
    } catch (error) {
      alert('Error al enviar el formulario');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Formulario de PQRSF
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nombre Completo
            </label>
            <input
              type="text"
              name="nombre"
              required
              className={`mt-1 block w-full rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${
                validationErrors.nombre ? 'border-red-300' : 'border-gray-300'
              }`}
              value={formData.nombre}
              onChange={handleInputChange}
              maxLength={35}
            />
            {validationErrors.nombre && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.nombre}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Número de Celular
            </label>
            <input
              type="tel"
              name="celular"
              required
              className={`mt-1 block w-full rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 ${
                validationErrors.celular ? 'border-red-300' : 'border-gray-300'
              }`}
              value={formData.celular}
              onChange={handleInputChange}
              minLength={7}
              maxLength={15}
            />
            {validationErrors.celular && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.celular}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Correo Electrónico
            </label>
            <input
              type="email"
              name="correo"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              value={formData.correo}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Motivo
            </label>
            <select
              name="motivo"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              value={formData.motivo}
              onChange={handleInputChange}
            >
              <option value="">Seleccione un motivo</option>
              <option value="Petición">Petición</option>
              <option value="Queja">Queja</option>
              <option value="Reclamo">Reclamo</option>
              <option value="Sugerencia">Sugerencia</option>
              <option value="Felicitación">Felicitación</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Descripción
            </label>
            <textarea
              name="descripcion"
              required
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
              value={formData.descripcion}
              onChange={handleInputChange}
            ></textarea>
          </div>

          {/* Política de Tratamiento de Datos */}
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="policy"
                  type="checkbox"
                  checked={acceptedPolicy}
                  onChange={(e) => setAcceptedPolicy(e.target.checked)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3">
                <label htmlFor="policy" className="text-sm text-gray-700">
                  He leído y acepto la{' '}
                  <button
                    type="button"
                    onClick={() => setShowPolicy(!showPolicy)}
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    Política de Tratamiento de Datos
                  </button>
                </label>
              </div>
            </div>

            {error && (
              <div className="flex items-center text-red-600 text-sm">
                <AlertCircle className="h-4 w-4 mr-2" />
                {error}
              </div>
            )}

            {showPolicy && (
              <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 space-y-4">
                <h3 className="font-semibold text-gray-900">Política de Tratamiento de Datos Personales</h3>
                
                <p>
                  Lácteos Andinos, en cumplimiento de la Ley 1581 de 2012 y demás normas concordantes, 
                  es responsable del tratamiento de sus datos personales.
                </p>

                <div className="space-y-2">
                  <p className="font-medium">Los datos personales serán utilizados para:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Dar respuesta a sus peticiones, quejas, reclamos, sugerencias o felicitaciones</li>
                    <li>Mantener un registro histórico de las comunicaciones</li>
                    <li>Mejorar nuestros productos y servicios</li>
                    <li>Enviar información relevante sobre nuestros productos y servicios</li>
                  </ul>
                </div>

                <p>
                  Sus derechos como titular de los datos son: conocer, actualizar, rectificar y solicitar 
                  la supresión de sus datos personales. Puede ejercer estos derechos enviando un correo 
                  a landinos2012@gmail.com
                </p>

                <p>
                  Al aceptar esta política, usted autoriza a Lácteos Andinos para recolectar, almacenar, 
                  usar y circular los datos personales proporcionados a través de este formulario.
                </p>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
          >
            Enviar PQRSF
          </button>
        </form>
      </div>
    </div>
  );
}

export default FormularioPQRSF;