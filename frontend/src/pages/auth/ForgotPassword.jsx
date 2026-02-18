import React, { useState } from 'react';
import { Mail, ArrowLeft, Send, CheckCircle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSent, setIsSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Por favor, ingresa tu correo electrónico');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Error al enviar el correo');

      setIsSent(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        {/* Botón para volver atrás */}
        <Link 
          to="/login" 
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al inicio de sesión
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-300 overflow-hidden">
          <div className="px-8 pt-8 pb-6">
            <h1 className="text-2xl font-semibold text-gray-900 text-center">
              Recuperar Contraseña
            </h1>
            <p className="mt-2 text-sm text-gray-500 text-center">
              {isSent 
                ? "Revisa tu bandeja de entrada" 
                : "Ingresa tu correo para recibir un enlace de recuperación"}
            </p>
          </div>

          <div className="px-8 pb-8">
            {!isSent ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-red-600 text-sm text-center font-medium">{error}</p>
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="correo@institucion.edu.ve"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-xl font-medium text-white transition-all ${
                    isLoading 
                      ? 'bg-blue-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 shadow-sm active:scale-[0.98]'
                  }`}
                >
                  {isLoading ? 'Enviando...' : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Enviar enlace
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="text-center py-4">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-green-100 rounded-full">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                <p className="text-gray-600 mb-6">
                  Hemos enviado las instrucciones a <b>{email}</b>. El enlace expirará en 1 hora.
                </p>
                <button
                  onClick={() => navigate('/login')}
                  className="w-full py-2.5 px-4 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-all"
                >
                  Entendido
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;