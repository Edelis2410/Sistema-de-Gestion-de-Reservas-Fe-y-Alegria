import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Download, Search, ChevronDown
} from 'lucide-react';
import { Button } from '../../../components/common/UI/Button';

// Librerías para el PDF
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Reportes = () => {
  const [filtros, setFiltros] = useState({
    periodo: 'mensual',
    categoria: 'reservas',
    buscar: '',
  });
  
  const [isCategoriaOpen, setIsCategoriaOpen] = useState(false);
  const [isPeriodoOpen, setIsPeriodoOpen] = useState(false);
  const categoriaRef = useRef(null);
  const periodoRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoriaRef.current && !categoriaRef.current.contains(event.target)) {
        setIsCategoriaOpen(false);
      }
      if (periodoRef.current && !periodoRef.current.contains(event.target)) {
        setIsPeriodoOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [cargando, setCargando] = useState(false);
  const [datosBackend, setDatosBackend] = useState({
    usuarios: [],
    reservas: [],
    espacios: [],
    sistema: { totalUsuarios: 0, totalEspacios: 0, totalReservas: 0, tasaConfirmadas: "0%" }
  });

  const [datosFiltrados, setDatosFiltrados] = useState([]);

  const cargarDatos = useCallback(async () => {
    setCargando(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/reportes/estadisticas?periodo=${filtros.periodo}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        }
      });
      const result = await response.json();
      if (result.success) setDatosBackend(result.data);
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setCargando(false);
    }
  }, [filtros.periodo]);

  useEffect(() => { cargarDatos(); }, [cargarDatos]);

  // Filtrado lógico con tratamiento especial para espacios
  useEffect(() => {
    let fuente = [];
    
    if (filtros.categoria === 'sistema') {
      fuente = [
        { indicador: "Total de Usuarios", valor: datosBackend.sistema?.totalUsuarios || 0 },
        { indicador: "Total de Reservas", valor: datosBackend.sistema?.totalReservas || 0 },
        { indicador: "Total de Espacios", valor: datosBackend.sistema?.totalEspacios || 0 },
        { indicador: "Tasa de Confirmación", valor: datosBackend.sistema?.tasaConfirmadas || "0%" }
      ];
    } else if (filtros.categoria === 'espacios') {
      // Transformamos los datos de espacios para que tengan el orden y formato deseado
      fuente = (datosBackend.espacios || []).map(esp => ({
        id: esp.id,
        nombre: esp.espacio,               // ← OJO: en backend viene como "espacio"
        horas_totales: esp.horasTotales || 0,
        porcentaje_ocupacion: esp.porcentajeOcupacion || '0%',
        num_reservas: esp.numeroReservas || 0,
        disponibilidad: esp.disponibilidad || 'No disponible',
        estado: esp.estado || 'Inactivo'    // ← ya viene "Activo"/"Inactivo" del backend
      }));
    } else {
      fuente = [...(datosBackend[filtros.categoria] || [])];
      fuente.sort((a, b) => (a.id || 0) - (b.id || 0));
    }

    // Búsqueda normalizada
    if (filtros.buscar) {
      const normalizar = (texto) => 
        texto.toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

      const queryNormalizada = normalizar(filtros.buscar);

      fuente = fuente.filter(item => 
        Object.values(item).some(val => {
          if (!val) return false;
          const textoCelda = val.toString();
          return normalizar(textoCelda).includes(queryNormalizada);
        })
      );
    }
    setDatosFiltrados(fuente);
  }, [filtros.categoria, filtros.buscar, datosBackend]);

  const manejarFiltro = (campo, valor) => setFiltros(prev => ({ ...prev, [campo]: valor }));

  const exportarPDF = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'letter'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const ahora = new Date().toLocaleString();

    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text(`Emitido: ${ahora}`, pageWidth - 15, 10, { align: 'right' });

    const tamanoEncabezado = 11;
    doc.setFontSize(tamanoEncabezado);
    doc.setTextColor(0, 0, 0);
    
    doc.setFont('helvetica', 'bold');
    doc.text('U.E COLEGIO FE Y ALEGRIA PUERTO ORDAZ', pageWidth / 2, 20, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.text('URB MENDOZA CARRERA BARRANCAS, PUERTO ORDAZ', pageWidth / 2, 26, { align: 'center' });
    doc.text('PUERTO ORDAZ ESTADO BOLIVAR- RIF J-00133027-5', pageWidth / 2, 32, { align: 'center' });

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`REPORTE DE ${filtros.categoria.toUpperCase()}`, pageWidth / 2, 45, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text(`Periodo: ${filtros.periodo.toUpperCase()}`, pageWidth / 2, 51, { align: 'center' });

    // Definir columnas según categoría
    const columnas = {
      usuarios: ["ID", "Nombre", "Correo", "Registro", "Reservas", "Estado", "Rol"],
      reservas: ["ID", "Usuario", "Espacio", "Fecha", "Hora", "Duración", "Estado"],
      espacios: ["ID", "Espacio", "Horas Totales", "% Ocup.", "N° Reservas", "Disponibilidad", "Estado"],
      sistema: ["Indicador de Gestión", "Valor Actual"]
    }[filtros.categoria];

    // Construir filas según categoría
    let filas = [];
    if (filtros.categoria === 'sistema') {
      filas = datosFiltrados.map(item => [item.indicador, item.valor]);
    } else if (filtros.categoria === 'espacios') {
      filas = datosFiltrados.map(item => [
        item.id,
        item.nombre,
        item.horas_totales,
        item.porcentaje_ocupacion,
        item.num_reservas,
        item.disponibilidad,
        item.estado
      ]);
    } else {
      filas = datosFiltrados.map(item => Object.values(item).map(val => 
        (typeof val === 'object' && val !== null) ? (val.nombre || val.id || 'N/A') : val?.toString()
      ));
    }

    autoTable(doc, {
      startY: 60,
      head: [columnas],
      body: filas,
      theme: 'grid',
      headStyles: { fillColor: [15, 23, 42], halign: 'center', fontSize: 10, textColor: [255, 255, 255] },
      styles: { fontSize: 9, halign: 'center', textColor: [0, 0, 0], lineColor: [150, 150, 150] },
      margin: { left: 15, right: 15, bottom: 20 }
    });

    const totalPaginas = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPaginas; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100); 
      doc.text(`Página ${i}`, pageWidth - 15, pageHeight - 10, { align: 'right' });
    }

    doc.save(`Reporte_${filtros.categoria.toUpperCase()}.pdf`);
  };

  const categorias = [
    { valor: 'reservas', etiqueta: 'Reservas' },
    { valor: 'usuarios', etiqueta: 'Usuarios' },
    { valor: 'espacios', etiqueta: 'Espacios' },
    { valor: 'sistema', etiqueta: 'Métricas del Sistema' }
  ];

  const periodos = [
    { valor: 'hoy', etiqueta: 'Hoy' },
    { valor: 'semanal', etiqueta: 'Semanal' },
    { valor: 'mensual', etiqueta: 'Mensual' },
    { valor: 'anual', etiqueta: 'Anual' }
  ];

  const categoriaActual = categorias.find(c => c.valor === filtros.categoria)?.etiqueta || 'Reservas';
  const periodoActual = periodos.find(p => p.valor === filtros.periodo)?.etiqueta || 'Mensual';

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mx-auto max-w-7xl">
        
        {/* Encabezado */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Gestión de Reportes</h1>
            <p className="text-slate-500 text-sm">Administra y exporta la información de la institución.</p>
          </div>
          <Button 
            variant="primary" 
            icon={Download} 
            onClick={exportarPDF}
            className="bg-blue-600 hover:bg-blue-700 shadow-md transition-all active:scale-95"
          >
            Exportar a PDF
          </Button>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* Dropdown Categoría */}
            <div>
              <label className="block text-xs font-bold text-black-400 uppercase mb-2 tracking-wider">
                Categoría
              </label>
              <div className="relative" ref={categoriaRef}>
                <button
                  type="button"
                  onClick={() => setIsCategoriaOpen(!isCategoriaOpen)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm 
                             focus:ring-2 focus:ring-blue-500 outline-none bg-white
                             flex items-center justify-between"
                >
                  <span className="truncate">{categoriaActual}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isCategoriaOpen ? 'rotate-180' : ''}`} />
                </button>

                {isCategoriaOpen && (
                  <div className="absolute left-0 right-0 mt-1 w-full bg-white border rounded-lg shadow-lg z-50 py-1 max-h-60 overflow-y-auto">
                    {categorias.map((cat) => (
                      <button
                        key={cat.valor}
                        type="button"
                        onClick={() => {
                          manejarFiltro('categoria', cat.valor);
                          setIsCategoriaOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors
                                   ${filtros.categoria === cat.valor ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'}`}
                      >
                        {cat.etiqueta}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Dropdown Periodo */}
            <div>
              <label className="block text-xs font-bold text-black-400 uppercase mb-2 tracking-wider">
                Periodo
              </label>
              <div className="relative" ref={periodoRef}>
                <button
                  type="button"
                  onClick={() => setIsPeriodoOpen(!isPeriodoOpen)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm 
                             focus:ring-2 focus:ring-blue-500 outline-none bg-white
                             flex items-center justify-between"
                >
                  <span className="truncate">{periodoActual}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isPeriodoOpen ? 'rotate-180' : ''}`} />
                </button>

                {isPeriodoOpen && (
                  <div className="absolute left-0 right-0 mt-1 w-full bg-white border rounded-lg shadow-lg z-50 py-1 max-h-60 overflow-y-auto">
                    {periodos.map((per) => (
                      <button
                        key={per.valor}
                        type="button"
                        onClick={() => {
                          manejarFiltro('periodo', per.valor);
                          setIsPeriodoOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors
                                   ${filtros.periodo === per.valor ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'}`}
                      >
                        {per.etiqueta}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Buscador */}
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-black-400 uppercase mb-2 tracking-wider">
                Buscador
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Buscar..." 
                  value={filtros.buscar} 
                  onChange={(e) => manejarFiltro('buscar', e.target.value)} 
                  className="w-full border border-slate-200 rounded-lg pl-10 pr-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tabla con renderizado condicional para espacios */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  { {
                    usuarios: ["ID", "Nombre", "Correo", "Registro", "Reservas", "Estado", "Rol"],
                    reservas: ["ID", "Usuario", "Espacio", "Fecha", "Hora", "Duración", "Estado"],
                    espacios: ["ID", "Espacio", "Horas Totales", "% Ocup.", "N° Reservas", "Disponibilidad", "Estado"],
                    sistema: ["Indicador", "Valor"]
                  }[filtros.categoria].map((h, i) => (
                    <th key={i} className="px-6 py-4 text-xs font-semibold text-slate-900 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {datosFiltrados.length > 0 ? (
                  datosFiltrados.map((item, idx) => {
                    // Renderizado específico por categoría
                    if (filtros.categoria === 'sistema') {
                      return (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 text-sm text-slate-700 font-medium">{item.indicador}</td>
                          <td className="px-6 py-4 text-sm text-slate-700 font-medium">{item.valor}</td>
                        </tr>
                      );
                    } else if (filtros.categoria === 'espacios') {
                      return (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 text-sm text-slate-700 font-medium">{item.id}</td>
                          <td className="px-6 py-4 text-sm text-slate-700 font-medium">{item.nombre}</td>
                          <td className="px-6 py-4 text-sm text-slate-700 font-medium">{item.horas_totales}</td>
                          <td className="px-6 py-4 text-sm text-slate-700 font-medium">{item.porcentaje_ocupacion}</td>
                          <td className="px-6 py-4 text-sm text-slate-700 font-medium">{item.num_reservas}</td>
                          <td className="px-6 py-4 text-sm text-slate-700 font-medium">{item.disponibilidad}</td>
                          <td className="px-6 py-4 text-sm text-slate-700 font-medium">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              item.estado === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {item.estado}
                            </span>
                          </td>
                        </tr>
                      );
                    } else {
                      // Usuarios o reservas (genérico)
                      return (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                          {Object.values(item).map((val, i) => (
                            <td key={i} className="px-6 py-4 text-sm text-slate-700 font-medium">
                              {(typeof val === 'object' && val !== null) ? (val.nombre || val.id || 'N/A') : (val?.toString() || '---')}
                            </td>
                          ))}
                        </tr>
                      );
                    }
                  })
                ) : (
                  <tr>
                    <td colSpan="10" className="px-6 py-12 text-slate-400 italic">No se encontraron registros.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reportes;