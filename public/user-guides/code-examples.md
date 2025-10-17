# 💻 Código de Ejemplo - Biblioteca Completa

**Ejemplos prácticos listos para usar en tu proyecto**

---

## 🎯 **Ejemplos por Lenguaje**

### **JavaScript/Node.js**
### **Python**
### **PHP**
### **React/Vue/Angular**
### **Curl/Bash**

---

## 🟢 **JavaScript/Node.js**

### **Configuración Básica**
```javascript
// config.js
const API_CONFIG = {
  baseUrl: 'https://api2.eventosorganizador.com/graphql',
  token: process.env.API_TOKEN,
  headers: {
    'Content-Type': 'application/json',
    'Origin': process.env.ORIGIN_URL || 'https://tu-dominio.com'
  }
};

module.exports = API_CONFIG;
```

### **Cliente API Reutilizable**
```javascript
// api-client.js
const fetch = require('node-fetch');
const API_CONFIG = require('./config');

class EventosAPIClient {
  constructor(token) {
    this.token = token;
    this.baseUrl = API_CONFIG.baseUrl;
  }

  async request(query, variables = {}) {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          ...API_CONFIG.headers,
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify({ query, variables })
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.errors) {
        throw new Error(`GraphQL Error: ${data.errors[0].message}`);
      }

      return data.data;
    } catch (error) {
      console.error('Error en petición API:', error);
      throw error;
    }
  }

  // Métodos específicos
  async obtenerEventos() {
    const query = `
      query {
        getUserEvents {
          success
          events {
            id
            nombre
            fecha
            ubicacion
            estado
          }
          errors
        }
      }
    `;
    return this.request(query);
  }

  async crearEvento(datosEvento) {
    const query = `
      mutation CreateEvent($input: CreateEventInput!) {
        createEvent(input: $input) {
          success
          event {
            id
            nombre
            fecha
            ubicacion
          }
          errors
        }
      }
    `;
    return this.request(query, { input: datosEvento });
  }

  async obtenerContactos() {
    const query = `
      query {
        getContacts {
          success
          contacts {
            id
            nombre
            apellidos
            email
            telefono
            empresa
          }
          errors
        }
      }
    `;
    return this.request(query);
  }

  async crearContacto(datosContacto) {
    const query = `
      mutation CreateContact($input: CreateContactInput!) {
        createContact(input: $input) {
          success
          contact {
            id
            nombre
            apellidos
            email
          }
          errors
        }
      }
    `;
    return this.request(query, { input: datosContacto });
  }

  async enviarMensajeWhatsApp(numero, mensaje) {
    const query = `
      mutation SendWhatsAppMessage($input: SendWhatsAppMessageInput!) {
        sendWhatsAppMessage(input: $input) {
          success
          messageId
          status
          errors
        }
      }
    `;
    return this.request(query, {
      input: { numero, mensaje, tipo: 'texto' }
    });
  }
}

module.exports = EventosAPIClient;
```

### **Ejemplo de Uso Completo**
```javascript
// ejemplo-completo.js
const EventosAPIClient = require('./api-client');

async function ejemploCompleto() {
  // Inicializar cliente
  const cliente = new EventosAPIClient(process.env.API_TOKEN);
  
  try {
    console.log('🚀 Iniciando ejemplo completo...');
    
    // 1. Obtener eventos existentes
    console.log('1️⃣ Obteniendo eventos...');
    const eventos = await cliente.obtenerEventos();
    console.log(`Eventos encontrados: ${eventos.getUserEvents.events.length}`);
    
    // 2. Crear nuevo evento
    console.log('2️⃣ Creando nuevo evento...');
    const nuevoEvento = await cliente.crearEvento({
      nombre: "Boda de María y Carlos",
      fecha: "2025-12-25",
      hora: "18:00",
      ubicacion: "Hotel Maravilloso",
      direccion: "Calle Principal 123, Madrid",
      descripcion: "Una boda inolvidable",
      tipo: "boda",
      presupuesto: 15000
    });
    
    if (nuevoEvento.createEvent.success) {
      console.log(`✅ Evento creado: ${nuevoEvento.createEvent.event.nombre}`);
      
      // 3. Obtener contactos
      console.log('3️⃣ Obteniendo contactos...');
      const contactos = await cliente.obtenerContactos();
      
      // 4. Enviar mensaje a contactos
      console.log('4️⃣ Enviando mensajes...');
      for (const contacto of contactos.getContacts.contacts.slice(0, 3)) {
        if (contacto.telefono) {
          const mensaje = `Hola ${contacto.nombre}, tienes un nuevo evento: ${nuevoEvento.createEvent.event.nombre}`;
          const resultado = await cliente.enviarMensajeWhatsApp(contacto.telefono, mensaje);
          
          if (resultado.sendWhatsAppMessage.success) {
            console.log(`✅ Mensaje enviado a ${contacto.nombre}`);
          } else {
            console.log(`❌ Error enviando mensaje a ${contacto.nombre}`);
          }
        }
      }
    }
    
    console.log('🎉 Ejemplo completado exitosamente');
    
  } catch (error) {
    console.error('❌ Error en ejemplo:', error.message);
  }
}

// Ejecutar ejemplo
if (require.main === module) {
  ejemploCompleto();
}

module.exports = ejemploCompleto;
```

---

## 🐍 **Python**

### **Cliente API en Python**
```python
# api_client.py
import requests
import json
import os
from typing import Dict, List, Optional

class EventosAPIClient:
    def __init__(self, token: str):
        self.token = token
        self.base_url = 'https://api2.eventosorganizador.com/graphql'
        self.headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {token}',
            'Origin': os.getenv('ORIGIN_URL', 'https://tu-dominio.com')
        }

    def request(self, query: str, variables: Dict = None) -> Dict:
        """Realiza una petición GraphQL"""
        try:
            payload = {
                'query': query,
                'variables': variables or {}
            }
            
            response = requests.post(
                self.base_url,
                headers=self.headers,
                json=payload,
                timeout=30
            )
            
            response.raise_for_status()
            data = response.json()
            
            if 'errors' in data:
                raise Exception(f"GraphQL Error: {data['errors'][0]['message']}")
            
            return data.get('data', {})
            
        except requests.exceptions.RequestException as e:
            print(f"Error de red: {e}")
            raise
        except Exception as e:
            print(f"Error en petición API: {e}")
            raise

    def obtener_eventos(self) -> List[Dict]:
        """Obtiene todos los eventos del usuario"""
        query = """
        query {
            getUserEvents {
                success
                events {
                    id
                    nombre
                    fecha
                    ubicacion
                    estado
                }
                errors
            }
        }
        """
        
        result = self.request(query)
        return result.get('getUserEvents', {}).get('events', [])

    def crear_evento(self, datos_evento: Dict) -> Optional[Dict]:
        """Crea un nuevo evento"""
        query = """
        mutation CreateEvent($input: CreateEventInput!) {
            createEvent(input: $input) {
                success
                event {
                    id
                    nombre
                    fecha
                    ubicacion
                }
                errors
            }
        }
        """
        
        result = self.request(query, {'input': datos_evento})
        create_result = result.get('createEvent', {})
        
        if create_result.get('success'):
            return create_result.get('event')
        else:
            print(f"Error creando evento: {create_result.get('errors')}")
            return None

    def obtener_contactos(self) -> List[Dict]:
        """Obtiene todos los contactos"""
        query = """
        query {
            getContacts {
                success
                contacts {
                    id
                    nombre
                    apellidos
                    email
                    telefono
                    empresa
                }
                errors
            }
        }
        """
        
        result = self.request(query)
        return result.get('getContacts', {}).get('contacts', [])

    def crear_contacto(self, datos_contacto: Dict) -> Optional[Dict]:
        """Crea un nuevo contacto"""
        query = """
        mutation CreateContact($input: CreateContactInput!) {
            createContact(input: $input) {
                success
                contact {
                    id
                    nombre
                    apellidos
                    email
                }
                errors
            }
        }
        """
        
        result = self.request(query, {'input': datos_contacto})
        create_result = result.get('createContact', {})
        
        if create_result.get('success'):
            return create_result.get('contact')
        else:
            print(f"Error creando contacto: {create_result.get('errors')}")
            return None

    def enviar_mensaje_whatsapp(self, numero: str, mensaje: str) -> bool:
        """Envía un mensaje por WhatsApp"""
        query = """
        mutation SendWhatsAppMessage($input: SendWhatsAppMessageInput!) {
            sendWhatsAppMessage(input: $input) {
                success
                messageId
                status
                errors
            }
        }
        """
        
        variables = {
            'input': {
                'numero': numero,
                'mensaje': mensaje,
                'tipo': 'texto'
            }
        }
        
        result = self.request(query, variables)
        send_result = result.get('sendWhatsAppMessage', {})
        
        return send_result.get('success', False)
```

### **Ejemplo de Uso en Python**
```python
# ejemplo_completo.py
from api_client import EventosAPIClient
import os

async def ejemplo_completo():
    """Ejemplo completo de uso de la API"""
    
    # Inicializar cliente
    token = os.getenv('API_TOKEN')
    if not token:
        print("❌ Error: API_TOKEN no configurado")
        return
    
    cliente = EventosAPIClient(token)
    
    try:
        print('🚀 Iniciando ejemplo completo...')
        
        # 1. Obtener eventos existentes
        print('1️⃣ Obteniendo eventos...')
        eventos = cliente.obtener_eventos()
        print(f"Eventos encontrados: {len(eventos)}")
        
        # 2. Crear nuevo evento
        print('2️⃣ Creando nuevo evento...')
        nuevo_evento = cliente.crear_evento({
            'nombre': 'Boda de María y Carlos',
            'fecha': '2025-12-25',
            'hora': '18:00',
            'ubicacion': 'Hotel Maravilloso',
            'direccion': 'Calle Principal 123, Madrid',
            'descripcion': 'Una boda inolvidable',
            'tipo': 'boda',
            'presupuesto': 15000
        })
        
        if nuevo_evento:
            print(f"✅ Evento creado: {nuevo_evento['nombre']}")
            
            # 3. Obtener contactos
            print('3️⃣ Obteniendo contactos...')
            contactos = cliente.obtener_contactos()
            
            # 4. Enviar mensajes
            print('4️⃣ Enviando mensajes...')
            for contacto in contactos[:3]:  # Solo primeros 3
                if contacto.get('telefono'):
                    mensaje = f"Hola {contacto['nombre']}, tienes un nuevo evento: {nuevo_evento['nombre']}"
                    exito = cliente.enviar_mensaje_whatsapp(contacto['telefono'], mensaje)
                    
                    if exito:
                        print(f"✅ Mensaje enviado a {contacto['nombre']}")
                    else:
                        print(f"❌ Error enviando mensaje a {contacto['nombre']}")
        
        print('🎉 Ejemplo completado exitosamente')
        
    except Exception as error:
        print(f'❌ Error en ejemplo: {error}')

if __name__ == '__main__':
    ejemplo_completo()
```

---

## 🐘 **PHP**

### **Cliente API en PHP**
```php
<?php
// api_client.php

class EventosAPIClient {
    private $token;
    private $baseUrl;
    private $headers;

    public function __construct($token) {
        $this->token = $token;
        $this->baseUrl = 'https://api2.eventosorganizador.com/graphql';
        $this->headers = [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $token,
            'Origin: ' . ($_ENV['ORIGIN_URL'] ?? 'https://tu-dominio.com')
        ];
    }

    private function request($query, $variables = []) {
        $payload = [
            'query' => $query,
            'variables' => $variables
        ];

        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => $this->baseUrl,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode($payload),
            CURLOPT_HTTPHEADER => $this->headers,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_SSL_VERIFYPEER => true
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);

        if ($error) {
            throw new Exception("Error de red: $error");
        }

        if ($httpCode !== 200) {
            throw new Exception("HTTP Error: $httpCode");
        }

        $data = json_decode($response, true);
        
        if (isset($data['errors'])) {
            throw new Exception("GraphQL Error: " . $data['errors'][0]['message']);
        }

        return $data['data'] ?? [];
    }

    public function obtenerEventos() {
        $query = '
        query {
            getUserEvents {
                success
                events {
                    id
                    nombre
                    fecha
                    ubicacion
                    estado
                }
                errors
            }
        }';

        $result = $this->request($query);
        return $result['getUserEvents']['events'] ?? [];
    }

    public function crearEvento($datosEvento) {
        $query = '
        mutation CreateEvent($input: CreateEventInput!) {
            createEvent(input: $input) {
                success
                event {
                    id
                    nombre
                    fecha
                    ubicacion
                }
                errors
            }
        }';

        $result = $this->request($query, ['input' => $datosEvento]);
        $createResult = $result['createEvent'];

        if ($createResult['success']) {
            return $createResult['event'];
        } else {
            echo "Error creando evento: " . implode(', ', $createResult['errors']);
            return null;
        }
    }

    public function obtenerContactos() {
        $query = '
        query {
            getContacts {
                success
                contacts {
                    id
                    nombre
                    apellidos
                    email
                    telefono
                    empresa
                }
                errors
            }
        }';

        $result = $this->request($query);
        return $result['getContacts']['contacts'] ?? [];
    }

    public function crearContacto($datosContacto) {
        $query = '
        mutation CreateContact($input: CreateContactInput!) {
            createContact(input: $input) {
                success
                contact {
                    id
                    nombre
                    apellidos
                    email
                }
                errors
            }
        }';

        $result = $this->request($query, ['input' => $datosContacto]);
        $createResult = $result['createContact'];

        if ($createResult['success']) {
            return $createResult['contact'];
        } else {
            echo "Error creando contacto: " . implode(', ', $createResult['errors']);
            return null;
        }
    }

    public function enviarMensajeWhatsApp($numero, $mensaje) {
        $query = '
        mutation SendWhatsAppMessage($input: SendWhatsAppMessageInput!) {
            sendWhatsAppMessage(input: $input) {
                success
                messageId
                status
                errors
            }
        }';

        $variables = [
            'input' => [
                'numero' => $numero,
                'mensaje' => $mensaje,
                'tipo' => 'texto'
            ]
        ];

        $result = $this->request($query, $variables);
        return $result['sendWhatsAppMessage']['success'] ?? false;
    }
}
?>
```

### **Ejemplo de Uso en PHP**
```php
<?php
// ejemplo_completo.php

require_once 'api_client.php';

function ejemploCompleto() {
    // Inicializar cliente
    $token = $_ENV['API_TOKEN'] ?? null;
    if (!$token) {
        echo "❌ Error: API_TOKEN no configurado\n";
        return;
    }

    $cliente = new EventosAPIClient($token);

    try {
        echo "🚀 Iniciando ejemplo completo...\n";

        // 1. Obtener eventos existentes
        echo "1️⃣ Obteniendo eventos...\n";
        $eventos = $cliente->obtenerEventos();
        echo "Eventos encontrados: " . count($eventos) . "\n";

        // 2. Crear nuevo evento
        echo "2️⃣ Creando nuevo evento...\n";
        $nuevoEvento = $cliente->crearEvento([
            'nombre' => 'Boda de María y Carlos',
            'fecha' => '2025-12-25',
            'hora' => '18:00',
            'ubicacion' => 'Hotel Maravilloso',
            'direccion' => 'Calle Principal 123, Madrid',
            'descripcion' => 'Una boda inolvidable',
            'tipo' => 'boda',
            'presupuesto' => 15000
        ]);

        if ($nuevoEvento) {
            echo "✅ Evento creado: " . $nuevoEvento['nombre'] . "\n";

            // 3. Obtener contactos
            echo "3️⃣ Obteniendo contactos...\n";
            $contactos = $cliente->obtenerContactos();

            // 4. Enviar mensajes
            echo "4️⃣ Enviando mensajes...\n";
            $contactosLimitados = array_slice($contactos, 0, 3);
            
            foreach ($contactosLimitados as $contacto) {
                if (!empty($contacto['telefono'])) {
                    $mensaje = "Hola " . $contacto['nombre'] . ", tienes un nuevo evento: " . $nuevoEvento['nombre'];
                    $exito = $cliente->enviarMensajeWhatsApp($contacto['telefono'], $mensaje);

                    if ($exito) {
                        echo "✅ Mensaje enviado a " . $contacto['nombre'] . "\n";
                    } else {
                        echo "❌ Error enviando mensaje a " . $contacto['nombre'] . "\n";
                    }
                }
            }
        }

        echo "🎉 Ejemplo completado exitosamente\n";

    } catch (Exception $error) {
        echo "❌ Error en ejemplo: " . $error->getMessage() . "\n";
    }
}

// Ejecutar ejemplo
if (php_sapi_name() === 'cli') {
    ejemploCompleto();
}
?>
```

---

## ⚛️ **React/Vue/Angular**

### **Hook de React**
```javascript
// hooks/useEventosAPI.js
import { useState, useEffect, useCallback } from 'react';

export const useEventosAPI = (token) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiRequest = useCallback(async (query, variables = {}) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://api2.eventosorganizador.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Origin': window.location.origin
        },
        body: JSON.stringify({ query, variables })
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.errors) {
        throw new Error(data.errors[0].message);
      }

      return data.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  const obtenerEventos = useCallback(async () => {
    const query = `
      query {
        getUserEvents {
          success
          events {
            id
            nombre
            fecha
            ubicacion
            estado
          }
          errors
        }
      }
    `;
    
    return apiRequest(query);
  }, [apiRequest]);

  const crearEvento = useCallback(async (datosEvento) => {
    const query = `
      mutation CreateEvent($input: CreateEventInput!) {
        createEvent(input: $input) {
          success
          event {
            id
            nombre
            fecha
            ubicacion
          }
          errors
        }
      }
    `;
    
    return apiRequest(query, { input: datosEvento });
  }, [apiRequest]);

  return {
    loading,
    error,
    obtenerEventos,
    crearEvento,
    apiRequest
  };
};
```

### **Componente React**
```jsx
// components/ListaEventos.jsx
import React, { useState, useEffect } from 'react';
import { useEventosAPI } from '../hooks/useEventosAPI';

const ListaEventos = ({ token }) => {
  const { loading, error, obtenerEventos, crearEvento } = useEventosAPI(token);
  const [eventos, setEventos] = useState([]);
  const [nuevoEvento, setNuevoEvento] = useState({
    nombre: '',
    fecha: '',
    ubicacion: '',
    tipo: 'boda'
  });

  useEffect(() => {
    cargarEventos();
  }, []);

  const cargarEventos = async () => {
    try {
      const data = await obtenerEventos();
      setEventos(data.getUserEvents.events);
    } catch (err) {
      console.error('Error cargando eventos:', err);
    }
  };

  const handleCrearEvento = async (e) => {
    e.preventDefault();
    try {
      const data = await crearEvento(nuevoEvento);
      if (data.createEvent.success) {
        setEventos([...eventos, data.createEvent.event]);
        setNuevoEvento({ nombre: '', fecha: '', ubicacion: '', tipo: 'boda' });
      }
    } catch (err) {
      console.error('Error creando evento:', err);
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Mis Eventos</h2>
      
      {/* Formulario para crear evento */}
      <form onSubmit={handleCrearEvento}>
        <input
          type="text"
          placeholder="Nombre del evento"
          value={nuevoEvento.nombre}
          onChange={(e) => setNuevoEvento({...nuevoEvento, nombre: e.target.value})}
          required
        />
        <input
          type="date"
          value={nuevoEvento.fecha}
          onChange={(e) => setNuevoEvento({...nuevoEvento, fecha: e.target.value})}
          required
        />
        <input
          type="text"
          placeholder="Ubicación"
          value={nuevoEvento.ubicacion}
          onChange={(e) => setNuevoEvento({...nuevoEvento, ubicacion: e.target.value})}
          required
        />
        <button type="submit">Crear Evento</button>
      </form>

      {/* Lista de eventos */}
      <ul>
        {eventos.map(evento => (
          <li key={evento.id}>
            <h3>{evento.nombre}</h3>
            <p>Fecha: {evento.fecha}</p>
            <p>Ubicación: {evento.ubicacion}</p>
            <p>Estado: {evento.estado}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListaEventos;
```

---

## 🔧 **Curl/Bash**

### **Scripts de Bash**
```bash
#!/bin/bash
# scripts/api-test.sh

API_URL="https://api2.eventosorganizador.com/graphql"
TOKEN="${API_TOKEN}"
ORIGIN="${ORIGIN_URL:-https://tu-dominio.com}"

if [ -z "$TOKEN" ]; then
    echo "❌ Error: API_TOKEN no configurado"
    exit 1
fi

# Función para hacer peticiones GraphQL
graphql_request() {
    local query="$1"
    local variables="$2"
    
    curl -X POST "$API_URL" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $TOKEN" \
        -H "Origin: $ORIGIN" \
        -d "{\"query\": \"$query\", \"variables\": $variables}" \
        -s | jq '.'
}

# Obtener eventos
obtener_eventos() {
    echo "📅 Obteniendo eventos..."
    
    local query='
    query {
        getUserEvents {
            success
            events {
                id
                nombre
                fecha
                ubicacion
                estado
            }
            errors
        }
    }'
    
    graphql_request "$query" "{}"
}

# Crear evento
crear_evento() {
    local nombre="$1"
    local fecha="$2"
    local ubicacion="$3"
    
    echo "➕ Creando evento: $nombre"
    
    local query='
    mutation CreateEvent($input: CreateEventInput!) {
        createEvent(input: $input) {
            success
            event {
                id
                nombre
                fecha
                ubicacion
            }
            errors
        }
    }'
    
    local variables="{
        \"input\": {
            \"nombre\": \"$nombre\",
            \"fecha\": \"$fecha\",
            \"ubicacion\": \"$ubicacion\",
            \"tipo\": \"boda\",
            \"presupuesto\": 15000
        }
    }"
    
    graphql_request "$query" "$variables"
}

# Obtener contactos
obtener_contactos() {
    echo "👥 Obteniendo contactos..."
    
    local query='
    query {
        getContacts {
            success
            contacts {
                id
                nombre
                apellidos
                email
                telefono
            }
            errors
        }
    }'
    
    graphql_request "$query" "{}"
}

# Enviar mensaje WhatsApp
enviar_whatsapp() {
    local numero="$1"
    local mensaje="$2"
    
    echo "📱 Enviando mensaje a $numero..."
    
    local query='
    mutation SendWhatsAppMessage($input: SendWhatsAppMessageInput!) {
        sendWhatsAppMessage(input: $input) {
            success
            messageId
            status
            errors
        }
    }'
    
    local variables="{
        \"input\": {
            \"numero\": \"$numero\",
            \"mensaje\": \"$mensaje\",
            \"tipo\": \"texto\"
        }
    }"
    
    graphql_request "$query" "$variables"
}

# Función principal
main() {
    echo "🚀 Iniciando test de API..."
    
    # 1. Obtener eventos
    obtener_eventos
    
    echo ""
    
    # 2. Crear evento
    crear_evento "Boda Test" "2025-12-25" "Hotel Test"
    
    echo ""
    
    # 3. Obtener contactos
    obtener_contactos
    
    echo ""
    
    # 4. Enviar mensaje de prueba
    enviar_whatsapp "+34600123456" "Mensaje de prueba desde API"
    
    echo ""
    echo "🎉 Test completado"
}

# Ejecutar función principal
main "$@"
```

### **Ejemplo de Uso del Script**
```bash
#!/bin/bash
# ejemplo-uso.sh

# Configurar variables de entorno
export API_TOKEN="tu-token-aqui"
export ORIGIN_URL="https://tu-dominio.com"

# Ejecutar script
./scripts/api-test.sh

# O ejecutar funciones individuales
source scripts/api-test.sh
obtener_eventos
crear_evento "Mi Boda" "2025-12-25" "Hotel Maravilloso"
```

---

## 🎯 **Próximos Pasos**

### **¿Ya tienes el código que necesitas?**
👉 **[Ir a Personalización](./customization.md)**

### **¿Quieres documentación completa?**
👉 **[Ver Documentación Completa](./complete-reference.md)**

### **¿Necesitas ayuda específica?**
👉 **[Contactar Soporte](mailto:soporte@eventosorganizador.com)**

---

## 💡 **Consejos de Código**

1. **Maneja errores:** Siempre incluye try-catch o manejo de errores
2. **Valida datos:** Verifica que los datos de entrada sean válidos
3. **Usa variables de entorno:** No hardcodees tokens o URLs
4. **Documenta tu código:** Comenta funciones complejas
5. **Testa tu código:** Prueba todas las funciones antes de usar en producción

---

**¿Necesitas ayuda con el código?** 📧 soporte@eventosorganizador.com
