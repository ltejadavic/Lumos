"use client";

import { useState, useEffect } from 'react';

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

interface Role {
    id: number;
    nombre: string;
  }
  
const RegisterPage = () => {
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [colegio, setColegio] = useState('');
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
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const [selectedCountryName, setSelectedCountryName] = useState(''); // Variable global para el filtro de universidades

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`http://api.geonames.org/countryInfoJSON?username=ltejadavic`)
      .then(res => res.json())
      .then(data => setCountries(data.geonames))
      .catch(err => console.error("Error al cargar países:", err));

    fetch('/universities.json')
      .then(response => response.json())
      .then(data => setUniversities(data))
      .catch(error => console.error("Error al cargar universidades:", error));

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
      setDropdownVisible(true);
    } else {
      setDropdownVisible(false);
    }
  };

  const handleSuggestionClick = (universityName: string) => {
    setUniversidad(universityName);
    setDropdownVisible(false);
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
    <form onSubmit={handleRegister}>
      <h2>Registro de Usuario</h2>
      <input type="email" placeholder="Correo Electrónico" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <input type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
      <input type="text" placeholder="Apellidos" value={apellidos} onChange={(e) => setApellidos(e.target.value)} required />
      <input type="tel" placeholder="Teléfono" value={telefono} onChange={(e) => setTelefono(e.target.value)} />

      {/* Country Dropdown */}
      <select value={selectedCountryId} onChange={handleCountryChange} required>
        <option>Seleccione un país</option>
        {countries.map(country => (
          <option key={country.geonameId} value={country.geonameId}>{country.countryName}</option>
        ))}
      </select>

      {/* Province Dropdown */}
      <select value={selectedProvinceId} onChange={handleProvinceChange} disabled={!pais} required>
        <option>Seleccione una provincia</option>
        {provinces.length > 0 
          ? provinces.map(province => (
              <option key={province.geonameId} value={province.geonameId}>{province.name}</option>
            ))
          : <option>No hay provincias disponibles</option>}
      </select>

      {/* City dropdown */}
      <select value={selectedCityId} onChange={handleCityChange} disabled={!provincia} required>
        <option>Seleccione una ciudad</option>
        {cities.length > 0 
        ? cities.map(city => (
            <option key={city.geonameId} value={city.geonameId}>{city.name}</option>
            ))
        : <option>No hay Ciudades disponibles</option>}
      </select>

      {/* District Dropdown */}
      <select value={distrito} onChange={handleDistrictChange} disabled={!ciudad} required>
        <option>Seleccione un distrito</option>
        {districts.length > 0 
            ? districts.map((district) => (
                <option key={district.geonameId} value={district.name}>{district.name}</option>
            ))
            : <option>No hay distritos disponibles</option>}
      </select>

      {/* University List */}
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          placeholder="Escriba el nombre de la universidad"
          value={universidad}
          onChange={handleUniversityChange}
          onFocus={() => setDropdownVisible(true)}
          required
        />
        {isDropdownVisible && filteredUniversities.length > 0 && (
          <ul style={{ border: '1px solid #ccc', maxHeight: '150px', overflowY: 'scroll', position: 'absolute', width: '100%', backgroundColor: 'white', zIndex: 1 }}>
            {filteredUniversities.map((uni, index) => (
              <li key={index} onClick={() => handleSuggestionClick(uni.name)}>{uni.name}</li>
            ))}
          </ul>
        )}
      </div>

      <input type="text" placeholder="Nombre del Colegio" value={colegio} onChange={(e) => setColegio(e.target.value)} />

      <select value={role} onChange={(e) => setRole(e.target.value)} required>
        <option value="">Seleccione un Rol</option>
        {Array.isArray(roles) && roles.map((role) => (
            <option key={role.id} value={role.id}>
            {role.nombre}
            </option>
        ))}
      </select>

      <button type="submit">Registrar</button>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};

export default RegisterPage;