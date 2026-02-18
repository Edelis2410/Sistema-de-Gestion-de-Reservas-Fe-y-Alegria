import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // Obtener datos del usuario de localStorage o usar datos por defecto
  const getUserData = () => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        return JSON.parse(userData);
      }
    } catch (error) {
      console.error('Error al obtener datos del usuario:', error);
    }
    
    // Datos por defecto si no hay usuario en localStorage
    return {
      name: 'Usuario',
      lastName: 'Docente',
      email: 'correo@institucion.edu.ve',
      role: 'docente'
    };
  };

  const user = getUserData();

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggle={toggleSidebar} 
      />
      
      {/* Contenido principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header 
          user={user} 
          isSidebarCollapsed={isSidebarCollapsed} 
        />
        
        {/* Contenido de la página actual */}
        <main 
          className={`flex-1 overflow-y-auto transition-all duration-300 ${
            isSidebarCollapsed ? 'ml-16' : 'ml-64'
          } mt-16`}
        >
          <Outlet /> {/* Aquí se renderizarán las páginas */}
        </main>
      </div>
    </div>
  );
};

export default Layout;