import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Milk, 
  ChevronRight, 
  Star,
  Facebook,
  Instagram,
  Phone,
  Mail
} from 'lucide-react';

function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div 
        className="relative h-[600px] bg-cover bg-center"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1464226184884-fa280b87c399?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80")',
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl font-bold mb-6">
              Frescura y Tradición en Cada Bocado
            </h1>
            <p className="text-xl mb-8">
              Desde el corazón de los Andes, traemos a tu mesa lo mejor en lácteos nariñenses, 
              con sabores auténticos y frescura garantizada.
            </p>
            <Link
              to="/pqrsf"
              className="inline-flex items-center bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Enviar PQRSF
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Nuestros Productos Destacados
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Queso Campesino',
                description: 'Fresco, con un sabor suave y ligeramente salado, ideal para acompañar cualquier comida.',
                image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
              },
              {
                name: 'Queso Doble Crema',
                description: 'Caracterizado por su textura cremosa y alto contenido de grasa. Perfecto para sándwiches y ensaladas.',
                image: 'https://images.unsplash.com/photo-1624806992066-5ffcf7ca186b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
              },
              {
                name: 'Cuajada',
                description: 'Producto lácteo con una textura ligera, ideal para postres y acompañamientos en recetas tradicionales.',
                image: 'https://images.unsplash.com/photo-1559561853-08451507cbe7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
              }
            ].map((product, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <Link
                    to="/pqrsf"
                    className="text-green-600 hover:text-green-700 font-medium inline-flex items-center"
                  >
                    Consultar disponibilidad
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Sobre Nosotros</h2>
              <p className="text-gray-600 mb-6">
                En Lácteos Andinos de Nariño, nos enorgullece combinar las técnicas artesanales 
                con un compromiso inquebrantable con la calidad. Trabajamos directamente con 
                productores locales para garantizar la frescura y autenticidad de cada producto.
              </p>
              <div className="space-y-4">
                {[
                  'Productos 100% naturales',
                  'Apoyo a productores locales',
                  'Técnicas artesanales',
                  'Compromiso con la calidad'
                ].map((item, index) => (
                  <div key={index} className="flex items-center">
                    <Star className="h-5 w-5 text-green-600 mr-2" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative h-[400px]">
              <img
                src="https://images.unsplash.com/photo-1528498033373-3c6c08e93d79?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                alt="Producción de lácteos"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Contáctanos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <a
              href="tel:3174314006"
              className="flex items-center justify-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <Phone className="h-6 w-6 text-green-600 mr-3" />
              <span>317 4314006</span>
            </a>
            <a
              href="mailto:landinos2012@gmail.com"
              className="flex items-center justify-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <Mail className="h-6 w-6 text-green-600 mr-3" />
              <span>landinos2012@gmail.com</span>
            </a>
            <div className="flex items-center justify-center space-x-6 p-6 bg-white rounded-lg shadow-lg">
              <a
                href="https://www.facebook.com/p/Lacteosandinos-100055157653758/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href="https://www.instagram.com/lacteosandinos/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-600 hover:text-pink-700"
              >
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* PQRSF CTA */}
      <section className="py-16 bg-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">¿Tienes algo que decirnos?</h2>
          <p className="text-xl mb-8">
            Tu opinión es importante para nosotros. Envíanos tus preguntas, quejas, reclamos, 
            sugerencias o felicitaciones.
          </p>
          <Link
            to="/pqrsf"
            className="inline-flex items-center bg-white text-green-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Enviar PQRSF
            <ChevronRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;