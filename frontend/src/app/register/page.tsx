"use client";

import { useState, useEffect } from 'react';
import './register.css';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode'; // Use the correct import as needed

// Definir interfaces
interface GeoLocation {
  geonameId: string;
  name: string;
}

interface Country extends GeoLocation {
  countryName: string;
}

interface University {
  name: string;
  country: string;
  "state-province": string | null;
}

interface DecodedToken {
    username: string;
    nombre: string;
    apellidos: string;
    sub: number;
    role: Role;
    exp: number; // Assuming `exp` is the expiration time in your JWT
  }

interface Role {
    id: number;
    nombre: string;
}

interface Colegio {
    Number: number;
    Code: string;
    Name: string;
    Status: string;
    Kind: string;
    Province: string;
    City: string;
    District: string;
  }
  
const RegisterPage = () => {
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [colegio, setColegio] = useState('');
  const [isManualInput, setIsManualInput] = useState(false);
  const [universidad, setUniversidad] = useState('');
  const [distrito, setDistrito] = useState(''); // Guardar el distrito seleccionado
  const [districts, setDistricts] = useState<GeoLocation[]>([]); // Lista de distritos
  const [provincia, setProvincia] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [pais, setPais] = useState('');
  const [role, setRole] = useState('');

  const [roles, setRoles] = useState<Role[]>([]);

  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountryId, setSelectedCountryId] = useState<string | "">("");
  const [provinces, setProvinces] = useState<GeoLocation[]>([]);
  const [selectedProvinceId, setSelectedProvinceId] = useState<string | "">("");
  const [cities, setCities] = useState<GeoLocation[]>([]);
  const [selectedCityId, setSelectedCityId] = useState<string | "">("");
  const [universities, setUniversities] = useState<University[]>([]);
  const [filteredUniversities, setFilteredUniversities] = useState<University[]>([]);
  const [isUniversityDropdownVisible, setUniversityDropdownVisible] = useState(false);

  const [colegios, setColegios] = useState<Colegio[]>([]);
  const [filteredColegios, setFilteredColegios] = useState<Colegio[]>([]);
  const [isSchoolDropdownVisible, setSchoolDropdownVisible] = useState(false);

  const [selectedCountryName, setSelectedCountryName] = useState(''); // Variable global para el filtro de universidades

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login'); // Redirigir si no hay token
      return;
    }

    try {
      const decoded: DecodedToken = jwtDecode(token);
      if (decoded.role.nombre !== 'Administrador') {
        router.push('/login'); // Redirigir si el rol no es "Administrador"
      } else {
        setIsAuthorized(true); // Permitir acceso si es "Administrador"
      }
    } catch (error) {
      localStorage.removeItem('token');
      router.push('/login');
    }
  }, [router]);
  // Si el usuario no está autorizado, muestra un mensaje de carga o similar
  // Si `isAuthorized` es `null`, mostrar un cargando
  if (isAuthorized === null) {
    return <div>Cargando...</div>;
  }

  useEffect(() => {
    fetch(`http://api.geonames.org/countryInfoJSON?username=ltejadavic`)
      .then(res => res.json())
      .then(data => setCountries(data.geonames))
      .catch(err => console.error("Error al cargar países:", err));

    fetch('/universities.json')
      .then(response => response.json())
      .then(data => setUniversities(data))
      .catch(error => console.error("Error al cargar universidades:", error));

    // Cargar el JSON de colegios al montar el componente
    fetch('/colegios.json')
      .then((response) => response.json())
      .then((data) => setColegios(data))
      .catch((error) => console.error('Error cargando el archivo JSON de colegios:', error));
  
    const fetchRoles = async () => {
      const response = await fetch('http://localhost:3000/api/auth/roles');
      const rolesData = await response.json();
      setRoles(rolesData);
      };
      fetchRoles();  
    }, []);

  //Country Handler
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const countryId = e.target.value;
    const countryName = e.target.options[e.target.selectedIndex].text;

    setSelectedCountryName(countryName);
    setSelectedCountryId(countryId); // Guardar el ID para el valor del <select>
    setPais(countryName); // Guardar el nombre del país // Guarda el nombre del país para el filtro de universidades
  
    fetch(`http://api.geonames.org/childrenJSON?geonameId=${countryId}&username=ltejadavic`)
      .then(res => res.json())
      .then(data => setProvinces(data.geonames || []))
      .catch(err => console.error("Error al cargar provincias:", err));
  };

  //Province Handler
  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provinceId = e.target.value;
    const provinceName = e.target.options[e.target.selectedIndex].text;
    setSelectedProvinceId(provinceId);
    setProvincia(provinceName);

    fetch(`http://api.geonames.org/childrenJSON?geonameId=${provinceId}&username=ltejadavic`)
      .then(res => res.json())
      .then(data => setCities(data.geonames || []))
      .catch(err => console.error("Error al cargar ciudades:", err));
  };

  // City selection handler
  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cityId = e.target.value;
    const cityName = e.target.options[e.target.selectedIndex].text;
    setSelectedCityId(cityId);
    setCiudad(cityName);

    fetch(`http://api.geonames.org/childrenJSON?geonameId=${cityId}&username=ltejadavic`)
      .then(res => res.json())
      .then(data => setDistricts(data.geonames || []))  // Actualizar la lista de distritos
      .catch(err => console.error("Error al cargar distritos:", err));
};

   const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setDistrito(e.target.value); // Actualiza el distrito seleccionado
};

// Función para manejar el cambio en el input de colegio
const handleColegioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setColegio(input);
  
    if (!isManualInput && input.length >= 2) {
      const filtered = colegios
        .filter((col) =>
          col.Name.toLowerCase().includes(input.toLowerCase())
        )
        .slice(0, 6);
      setFilteredColegios(filtered);
      setSchoolDropdownVisible(true);
    } else {
      setSchoolDropdownVisible(false);
    }
  };

  // Función para manejar la selección de una sugerencia
const handleColegioSuggestionClick = (colegioName: string) => {
    setColegio(colegioName);
    setSchoolDropdownVisible(false);
    setIsManualInput(false); // Resetea la opción de entrada manual
  };

  const handleUniversityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setUniversidad(input);

    if (input.length >= 2) {
      const filtered = universities
        .filter((uni) => 
          uni.country.toLowerCase() === selectedCountryName.toLowerCase() &&
          uni.name.toLowerCase().includes(input.toLowerCase())
        )
        .slice(0, 6);
      setFilteredUniversities(filtered);
      setUniversityDropdownVisible(true);
    } else {
      setUniversityDropdownVisible(false);
    }
  };

  const handleSuggestionClick = (universityName: string) => {
    setUniversidad(universityName);
    setUniversityDropdownVisible(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          nombre,
          apellidos,
          telefono,
          colegio,
          universidad,
          distrito,
          provincia,
          ciudad,
          pais,
          role: Number(role),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Usuario registrado exitosamente');
      } else {
        setError(data.message || 'Error en el registro');
      }
    } catch (error) {
      console.error("Error en la solicitud de registro:", error);
      setError("Error en la conexión con el servidor");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ minHeight: '100vh' }}>
      <div className="custom-container container p-4 rounded bg-secondary shadow-lg" style={{ maxWidth: '500px', marginTop: '400px'}}>
        <form onSubmit={handleRegister}>
          <h2 className="text-center text-light mb-4">Formulario de Registro</h2>
  
          {/* Email */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label text-light">Correo Electrónico</label>
            <input
              id="email"
              type="email"
              placeholder="Correo Electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-control"/>
          </div>
  
          {/* Password */}
          <div className="mb-3">
            <label htmlFor="password" className="form-label text-light">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-control"/>
          </div>
  
          {/* Nombre */}
          <div className="mb-3">
            <label htmlFor="nombre" className="form-label text-light">Nombre</label>
            <input
              id="nombre"
              type="text"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className="form-control"/>
          </div>
  
          {/* Apellidos */}
          <div className="mb-3">
            <label htmlFor="apellidos" className="form-label text-light">Apellidos</label>
            <input
              id="apellidos"
              type="text"
              placeholder="Apellidos"
              value={apellidos}
              onChange={(e) => setApellidos(e.target.value)}
              required
              className="form-control"/>
          </div>
  
          {/* Teléfono */}
          <div className="mb-3">
            <label htmlFor="telefono" className="form-label text-light">Teléfono</label>
            <input
              id="telefono"
              type="tel"
              placeholder="Teléfono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              className="form-control"/>
          </div>
  
          {/* Country Dropdown */}
          <div className="mb-3">
            <label htmlFor="country" className="form-label text-light">País</label>
            <select
              id="country"
              value={selectedCountryId}
              onChange={handleCountryChange}
              required
              className="form-select">
              <option>Seleccione un país</option>
              {countries.map((country) => (
                <option key={country.geonameId} value={country.geonameId}>
                  {country.countryName}
                </option>
              ))}
            </select>
          </div>
  
          {/* Province Dropdown */}
          <div className="mb-3">
            <label htmlFor="province" className="form-label text-light">Provincia</label>
            <select
              id="province"
              value={selectedProvinceId}
              onChange={handleProvinceChange}
              disabled={!pais}
              required
              className="form-select">
              <option>Seleccione una provincia</option>
              {provinces.length > 0 ? (
                provinces.map((province) => (
                  <option key={province.geonameId} value={province.geonameId}>
                    {province.name}
                  </option>
                ))) : (<option>No hay provincias disponibles</option>)}
            </select>
          </div>
  
          {/* City Dropdown */}
          <div className="mb-3">
            <label htmlFor="city" className="form-label text-light">Ciudad</label>
            <select
              id="city"
              value={selectedCityId}
              onChange={handleCityChange}
              disabled={!provincia}
              required
              className="form-select">
              <option>Seleccione una ciudad</option>
              {cities.length > 0 ? (
                cities.map((city) => (
                  <option key={city.geonameId} value={city.geonameId}>
                    {city.name}
                  </option>
                ))
              ) : (<option>No hay ciudades disponibles</option>)}
            </select>
          </div>
  
          {/* Distrito */}
          <div className="mb-3">
            <label htmlFor="district" className="form-label text-light">Distrito</label>
            <select
              id="district"
              value={distrito}
              onChange={handleDistrictChange}
              disabled={!ciudad}
              required
              className="form-select">
              <option>Seleccione un distrito</option>
              {districts.length > 0 ? (
                districts.map((district) => (
                  <option key={district.geonameId} value={district.name}>
                    {district.name}
                  </option>
                ))
              ) : (<option>No hay distritos disponibles</option>)}
            </select>
          </div>
  
        {/* University List */}
        <div className="mb-3 position-relative">
        <label htmlFor="universidad" className="form-label text-white">Universidad</label>
        <input
            id="universidad"
            type="text"
            placeholder="Escriba el nombre de la universidad"
            value={universidad}
            onChange={handleUniversityChange}
            onFocus={() => setUniversityDropdownVisible(true)}
            required
            className="form-control bg-dark text-white border-secondary"/>
        {isUniversityDropdownVisible && filteredUniversities.length > 0 && (
            <ul className="dropdown-menu show position-absolute w-100">
            {filteredUniversities.map((uni, index) => (
                <li
                key={index}
                onClick={() => handleSuggestionClick(uni.name)}
                className="dropdown-item"
                >
                {uni.name}
                </li>
            ))}
            </ul>
        )}
        </div>

        {/* School List */}
        <div className="mb-3 position-relative">
        <label htmlFor="colegio" className="form-label text-white">Colegio</label>
        <input
            id="colegio"
            type="text"
            placeholder="Escriba el nombre del colegio"
            value={colegio}
            onChange={handleColegioChange}
            onFocus={() => setSchoolDropdownVisible(true)}
            required
            className="form-control bg-dark text-white border-secondary"/>
        {isSchoolDropdownVisible && filteredColegios.length > 0 && (
            <ul className="dropdown-menu show position-absolute w-100">
            {filteredColegios.map((col, index) => (
                <li
                key={index}
                onClick={() => handleColegioSuggestionClick(col.Name)}
                className="dropdown-item"
                >
                {col.Name}
                </li>
            ))}
            <li
                onClick={() => setIsManualInput(true)}
                className="dropdown-item"
            >
                Ingresar manualmente
            </li>
            </ul>
        )}
        </div>

        {/* Rol */}
        <div className="mb-3">
        <label htmlFor="role" className="form-label text-light">Rol</label>
        <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            className="form-select bg-light text-dark border-secondary">
            <option value="">Seleccione un Rol</option>
            {Array.isArray(roles) &&
            roles.map((role) => (
                <option key={role.id} value={role.id}>
                {role.nombre}
                </option>
            ))}
        </select>
        </div>
  
        <button
        type="submit"
        className="btn btn-primary w-100">
        Registrar
        </button>
        {message && <p className="mt-3 text-success">{message}</p>}
        {error && <p className="mt-3 text-danger">{error}</p>}

        {/* Link para navegar a la vista de login */}
        <p className="mt-3 text-center text-white">
        ¿Ya tienes una cuenta?{" "}
        <a href="/login" className="text-decoration-underline link-hover">
            Inicia sesión aquí
        </a>
        </p>
      </form>
    </div>
  </div>
);
};

export default RegisterPage;