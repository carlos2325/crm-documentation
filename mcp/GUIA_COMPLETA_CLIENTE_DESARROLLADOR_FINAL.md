# 📘 GUÍA COMPLETA PARA EL CLIENTE DESARROLLADOR

**Para:** Desarrollador del Cliente (Agente IA / Lobe Chat)  
**Fecha:** 07 de Octubre 2025  
**Versión:** 1.0 FINAL  
**Estado:** ✅ TODO LISTO PARA USAR  

---

## 🎯 RESUMEN EJECUTIVO

### **¿QUÉ TIENES DISPONIBLE?**

Tu API de eventos ahora tiene **TODO** lo que necesitas:

```
✅ 305 Queries GraphQL
✅ 456 Mutations GraphQL
✅ 35 Herramientas MCP
✅ 1,300+ Ejemplos de uso
✅ Documentación completa
✅ Scripts de testing
```

### **¿QUÉ PUEDES HACER?**

1. ✅ Entrenar tu agente IA con 1,300+ ejemplos reales
2. ✅ Integrar vía GraphQL (frontend web)
3. ✅ Integrar vía MCP (agentes IA) ⭐ NUEVO
4. ✅ Usar Python httpx sin workarounds ⭐ SOLUCIONADO

---

## 📚 DOCUMENTOS PRINCIPALES (TODO LO QUE NECESITAS)

### **1. Para entender qué puedes hacer:**

#### **`1000_PREGUNTAS_AGENTE_IA_EVENTOS_COMPLETO.md`** (44 KB) ⭐⭐⭐

**QUÉ ES:**
- 1,000 preguntas reales que usuarios pueden hacer
- Cada pregunta incluye código GraphQL completo
- Respuestas esperadas del IA
- Ejemplos con datos reales de producción

**CÓMO USARLO:**
```
1. Busca una pregunta similar a tu caso de uso
2. Copia el código GraphQL
3. Adapta los parámetros a tus datos
4. Ejecuta y verifica la respuesta
```

**EJEMPLO:**
```
Pregunta del usuario: "¿Cuántos invitados confirmados tengo?"

Query a usar:
query {
  getAllUserRelatedEventsByEmail(
    email: "tu@email.com"
    development: "bodasdehoy"
  ) {
    invitados_array {
      asistencia
    }
  }
}

Procesamiento:
const confirmados = invitados.filter(i => i.asistencia === 'confirmado').length;

Respuesta IA:
"Tienes 45 invitados confirmados de 50 totales (90%)"
```

---

#### **`300_CASOS_METODOS_PARA_AGENTE_IA.md`** (54 KB) ⭐⭐⭐

**QUÉ ES:**
- 300+ estrategias de CÓMO resolver cada tipo de petición
- Comparaciones: método bueno vs método malo
- Optimizaciones de performance
- Patrones de uso recomendados

**CÓMO USARLO:**
```
1. Identifica el tipo de petición (consulta, actualización, análisis, etc.)
2. Lee la estrategia recomendada
3. Implementa siguiendo el patrón
4. Optimiza usando los consejos
```

**EJEMPLO:**
```
Petición: "¿Cuántas mesas tengo?"

Método MALO:
- Traer todo el evento completo (500 KB)
- Iterar y contar manualmente
- Tiempo: 2 segundos

Método BUENO:
- Usar MESAS_getByEventId con solo campo total
- Leer campo pre-calculado
- Tiempo: 100ms

ROI: 20x más rápido ✅
```

---

### **2. Para la implementación técnica:**

#### **`DOCUMENTACION_FRONTEND_COMPLETA_100.md`** (19 KB) ⭐⭐

**QUÉ ES:**
- Todas las 305 queries documentadas
- Todas las 456 mutations documentadas
- Ejemplos con datos reales
- Casos de uso comunes

**CÓMO USARLO:**
```
1. Busca la funcionalidad que necesitas
2. Copia el código GraphQL
3. Revisa los parámetros requeridos
4. Implementa en tu código
```

---

#### **`RESPUESTA_FEEDBACK_CLIENTE_IA_LOBECHAT.md`** (17 KB) ⭐

**QUÉ ES:**
- Respuesta completa a tus problemas reportados
- Diagnóstico técnico detallado
- Solución implementada
- Especificaciones del servidor MCP

**IMPORTANTE:** Lee la sección "COMPARACIÓN: GraphQL vs MCP"

---

### **3. Para testing:**

#### **`mcp_testing_script.py`** (7.8 KB) ⭐

**QUÉ ES:**
- Script Python para verificar que todo funciona
- 4 tests automatizados
- Diagnóstico de errores

**CÓMO USARLO:**
```bash
# Editar token (línea 9)
AUTH_TOKEN = "TU_JWT_TOKEN_AQUI"

# Ejecutar
python3 mcp_testing_script.py

# Resultado esperado:
# ✅ PASS - tools/list
# ✅ PASS - tools/call
# ✅ PASS - SSL Connection
# ✅ PASS - Performance
# 🎉 ¡TODOS LOS TESTS PASARON!
```

---

## 🚀 CÓMO EMPEZAR (PASO A PASO)

### **PASO 1: Familiarízate con las capacidades** (30 min)

```bash
# Lee estos documentos en orden:
1. RESUMEN_ABSOLUTO_SESION_COMPLETA.md (15 min)
   → Entender qué está disponible

2. 1000_PREGUNTAS_AGENTE_IA_EVENTOS_COMPLETO.md (primeras 50 preguntas) (15 min)
   → Ver ejemplos de uso real
```

---

### **PASO 2: Configura tu entorno** (15 min)

```python
# config.py
API_URL_GRAPHQL = "https://api2.eventosorganizador.com/graphql"
API_URL_MCP = "https://api2.eventosorganizador.com/mcp"  # ⭐ NUEVO

AUTH_TOKEN = "tu_jwt_token_aqui"
DEVELOPMENT = "bodasdehoy"  # o "eventosorganizador"

HEADERS = {
    "Authorization": f"Bearer {AUTH_TOKEN}",
    "Content-Type": "application/json",
    "X-Development": DEVELOPMENT
}
```

---

### **PASO 3: Primera integración (GraphQL)** (30 min)

```python
# test_graphql.py
import httpx
from config import API_URL_GRAPHQL, HEADERS

# Test básico: Obtener tus eventos
query = """
query {
  getAllUserRelatedEventsByEmail(
    email: "tu@email.com"
    development: "bodasdehoy"
  ) {
    _id
    nombre
    fecha
    tipo
  }
}
"""

response = httpx.post(
    API_URL_GRAPHQL,
    json={"query": query},
    headers=HEADERS,
    timeout=30.0
)

eventos = response.json()["data"]["getAllUserRelatedEventsByEmail"]
print(f"✅ Tienes {len(eventos)} eventos")
for evento in eventos[:5]:
    print(f"  - {evento['nombre']} ({evento['fecha']})")
```

---

### **PASO 4: Primera integración (MCP)** (30 min)

```python
# test_mcp.py
import httpx
from config import API_URL_MCP, HEADERS

# Test 1: Listar herramientas disponibles
response = httpx.post(
    API_URL_MCP,
    json={
        "jsonrpc": "2.0",
        "method": "tools/list",
        "id": 1
    },
    headers=HEADERS,
    timeout=30.0
)

tools = response.json()["result"]["tools"]
print(f"✅ {len(tools)} herramientas disponibles:")
for tool in tools[:10]:
    print(f"  - {tool['name']}: {tool['description']}")

# Test 2: Usar una herramienta
response = httpx.post(
    API_URL_MCP,
    json={
        "jsonrpc": "2.0",
        "method": "tools/call",
        "id": 2,
        "params": {
            "name": "get_user_complete_summary",
            "arguments": {
                "email": "tu@email.com",
                "development": "bodasdehoy"
            }
        }
    },
    headers=HEADERS,
    timeout=30.0
)

resultado = response.json()["result"]
print(f"✅ Resumen obtenido:")
print(f"  - Eventos: {resultado.get('total_eventos', 0)}")
print(f"  - Invitados: {resultado.get('total_invitados', 0)}")
```

---

## ⚠️ ESPECIFICACIONES IMPORTANTES

### **1. AUTENTICACIÓN** 🔐

**SIEMPRE incluye estos headers:**
```python
headers = {
    "Authorization": f"Bearer {JWT_TOKEN}",  # ⚠️ OBLIGATORIO
    "X-Development": "bodasdehoy",           # ⚠️ OBLIGATORIO
    "Content-Type": "application/json"
}
```

**⚠️ SIN ESTOS HEADERS NO FUNCIONARÁ**

---

### **2. DESARROLLO (development)** 🏢

**Valores permitidos:**
- `"bodasdehoy"` - Para usuarios de Bodas de Hoy
- `"eventosorganizador"` - Para usuarios de Eventos Organizador
- `"annloevents"` - Para usuarios de Annlo Events

**⚠️ IMPORTANTE:**
Cada usuario pertenece a UN solo development. Si usas el incorrecto, no verás datos.

**Cómo saber cuál usar:**
```python
# El development viene en el token JWT o en el perfil del usuario
# Si tienes dudas, prueba con "bodasdehoy" (el más común)
```

---

### **3. PAGINACIÓN** 📄

**Para queries con muchos resultados:**
```graphql
# OPCIÓN A: Skip/Limit (tradicional)
query {
  MESAS_getAllByEvento(
    eventoId: "123"
    skip: 0
    limit: 20
    development: "bodasdehoy"
  )
}

# OPCIÓN B: Cursor (recomendado para listas largas)
query {
  CHAT_getUserChatsCursor(
    userId: "123"
    limit: 20
    cursor: null  # null para primera página
    development: "bodasdehoy"
  ) {
    chats
    nextCursor
    hasMore
  }
}
```

---

### **4. MANEJO DE ERRORES** ⚠️

**SIEMPRE verifica errores:**
```python
response = httpx.post(...)

# Verificar status code
if response.status_code != 200:
    print(f"❌ Error HTTP: {response.status_code}")
    print(response.text)
    return

# Verificar errores de GraphQL
data = response.json()
if "errors" in data:
    print(f"❌ Error GraphQL: {data['errors']}")
    return

# Verificar success en response
if not data.get("data", {}).get("success", True):
    print(f"❌ Error: {data.get('message', 'Unknown')}")
    return

# ✅ Todo OK
result = data["data"]["nombreDeLaQuery"]
```

---

### **5. TIMEOUTS** ⏱️

**Configura timeouts adecuados:**
```python
# RECOMENDADO:
response = httpx.post(
    url,
    json=payload,
    timeout=30.0  # 30 segundos para operaciones normales
)

# Para operaciones pesadas (IA, análisis):
response = httpx.post(
    url,
    json=payload,
    timeout=120.0  # 2 minutos
)
```

---

### **6. RATE LIMITING** 🚦

**Límites actuales:**
```
GraphQL: 1000 requests/minuto por usuario
MCP:     500 requests/minuto por usuario
```

**Si excedes el límite:**
```
Response: 429 Too Many Requests
Retry-After: 60 (segundos)
```

**Cómo manejarlo:**
```python
import time

def call_api_with_retry(url, payload, max_retries=3):
    for attempt in range(max_retries):
        response = httpx.post(url, json=payload)
        
        if response.status_code == 429:
            retry_after = int(response.headers.get("Retry-After", 60))
            print(f"⚠️ Rate limit, esperando {retry_after}s...")
            time.sleep(retry_after)
            continue
        
        return response
    
    raise Exception("Max retries exceeded")
```

---

## 🎓 CONSEJOS Y MEJORES PRÁCTICAS

### **1. CACHEA DATOS ESTÁTICOS** 💾

```python
# MALO: Hacer query cada vez
def get_event_name(event_id):
    response = httpx.post(...)  # Query cada vez
    return response.json()["data"]["nombre"]

# BUENO: Cachear
from functools import lru_cache

@lru_cache(maxsize=100)
def get_event_name(event_id):
    response = httpx.post(...)
    return response.json()["data"]["nombre"]

# Primera llamada: query a API
# Siguientes llamadas: desde cache (0ms)
```

---

### **2. USA QUERIES ESPECÍFICAS** 🎯

```python
# MALO: Traer TODO
query = """
{
  getAllUserRelatedEventsByEmail(...) {
    _id
    nombre
    fecha
    tipo
    invitados_array  # ⚠️ Puede ser ENORME (500 KB)
    presupuesto_objeto
    itinerarios_array
    ... TODO
  }
}
"""
# Tiempo: 2 segundos, 500 KB transferidos

# BUENO: Solo lo que necesitas
query = """
{
  getAllUserRelatedEventsByEmail(...) {
    _id
    nombre
    fecha
  }
}
"""
# Tiempo: 100ms, 5 KB transferidos
# ⚡ 20x más rápido
```

---

### **3. PARALELIZA QUERIES INDEPENDIENTES** ⚡

```python
import asyncio
import httpx

# MALO: Secuencial
evento = get_evento()      # 1 segundo
mesas = get_mesas()        # 1 segundo
stats = get_stats()        # 1 segundo
# Total: 3 segundos

# BUENO: Paralelo
async def get_all_data():
    async with httpx.AsyncClient() as client:
        evento, mesas, stats = await asyncio.gather(
            get_evento(client),
            get_mesas(client),
            get_stats(client)
        )
    return evento, mesas, stats

# Total: 1 segundo (el más lento)
# ⚡ 3x más rápido
```

---

### **4. USA MCP PARA AGENTES IA** 🤖

```python
# Para agentes IA, MCP es MÁS SIMPLE que GraphQL

# OPCIÓN A: GraphQL (más verboso)
query = """
query GetMesas($eventId: ID!, $development: String!) {
  MESAS_getByEventId(eventId: $eventId, development: $development) {
    success
    total
    mesas {
      _id
      nombre_mesa
      capacidad
      espacio_disponible
    }
  }
}
"""
response = httpx.post(graphql_url, json={"query": query, "variables": {...}})

# OPCIÓN B: MCP (más simple)
response = httpx.post(mcp_url, json={
    "jsonrpc": "2.0",
    "method": "tools/call",
    "params": {
        "name": "mesas_get_by_event",
        "arguments": {"eventId": "123", "development": "bodasdehoy"}
    }
})

# ✅ Para IA: MCP es más fácil de entender y usar
```

---

### **5. IMPLEMENTA LOGGING** 📝

```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('api_calls.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

def call_api(url, payload):
    logger.info(f"Calling API: {url}")
    logger.debug(f"Payload: {payload}")
    
    try:
        response = httpx.post(url, json=payload)
        logger.info(f"Response: {response.status_code}")
        return response
    except Exception as e:
        logger.error(f"Error: {e}")
        raise

# Beneficios:
# - Debugging más fácil
# - Monitoreo de uso
# - Detección de errores
```

---

## ⚠️ ERRORES COMUNES Y SOLUCIONES

### **ERROR 1: SSL Handshake Failure**

```python
# Error:
# SSL: SSLV3_ALERT_HANDSHAKE_FAILURE

# SOLUCIÓN: Actualizar httpx y usar verify=True
pip install --upgrade httpx

response = httpx.post(url, json=payload, verify=True)  # ✅
```

---

### **ERROR 2: 401 Unauthorized**

```python
# Error:
# Response 401: Unauthorized

# CAUSAS POSIBLES:
1. Token JWT expirado
2. Token inválido
3. Falta header Authorization

# SOLUCIÓN:
# Verificar que el token es válido
headers = {
    "Authorization": f"Bearer {TOKEN}",  # ⚠️ Incluir "Bearer "
    "X-Development": "bodasdehoy"
}
```

---

### **ERROR 3: Campo null en respuesta**

```python
# Problema:
# response.data.evento.nombre = null

# CAUSAS POSIBLES:
1. Development incorrecto
2. Usuario no tiene acceso a ese evento
3. EventoId inválido

# SOLUCIÓN:
# Verificar development y permisos
# Si eres CREADOR del evento: acceso completo
# Si eres COLABORADOR: acceso limitado
```

---

### **ERROR 4: Query muy lenta**

```python
# Problema:
# Query tarda >5 segundos

# CAUSAS POSIBLES:
1. Estás trayendo demasiados datos
2. No usas paginación
3. No cacheas resultados

# SOLUCIÓN:
1. Pedir solo campos necesarios
2. Usar skip/limit o cursor
3. Cachear con lru_cache
```

---

## 🔧 HERRAMIENTAS ÚTILES

### **1. Postman Collection**

```bash
# Importar collection para testing manual
# Archivo: postman_collection.json (crear si no existe)
```

### **2. GraphQL Playground**

```
URL: https://api2.eventosorganizador.com/graphql
Interfaz visual para explorar y testear queries
```

### **3. Scripts de ejemplo**

```python
# Ver: ejemplos/
# - ejemplo_basico.py
# - ejemplo_mesas.py
# - ejemplo_invitados.py
# - ejemplo_mcp.py
```

---

## 📊 MÉTRICAS Y MONITOREO

### **Recomendado implementar:**

```python
import time

class APIMetrics:
    def __init__(self):
        self.total_calls = 0
        self.total_time = 0
        self.errors = 0
    
    def track_call(self, duration, success):
        self.total_calls += 1
        self.total_time += duration
        if not success:
            self.errors += 1
    
    def get_stats(self):
        avg_time = self.total_time / self.total_calls if self.total_calls > 0 else 0
        error_rate = (self.errors / self.total_calls * 100) if self.total_calls > 0 else 0
        
        return {
            "total_calls": self.total_calls,
            "average_time": f"{avg_time:.2f}s",
            "error_rate": f"{error_rate:.2f}%"
        }

metrics = APIMetrics()

def call_api_tracked(url, payload):
    start = time.time()
    try:
        response = httpx.post(url, json=payload)
        success = response.status_code == 200
        metrics.track_call(time.time() - start, success)
        return response
    except Exception as e:
        metrics.track_call(time.time() - start, False)
        raise

# Después de 1000 llamadas:
print(metrics.get_stats())
# {
#   "total_calls": 1000,
#   "average_time": "0.15s",
#   "error_rate": "0.50%"
# }
```

---

## 🎓 CASOS DE USO COMUNES

### **CASO 1: Listar eventos del usuario**

```python
def get_user_events(email, development="bodasdehoy"):
    query = """
    query GetEvents($email: String!, $dev: String!) {
      getAllUserRelatedEventsByEmail(
        email: $email
        development: $dev
      ) {
        _id
        nombre
        fecha
        tipo
        user_role
      }
    }
    """
    
    response = httpx.post(
        API_URL_GRAPHQL,
        json={
            "query": query,
            "variables": {"email": email, "dev": development}
        },
        headers=HEADERS
    )
    
    return response.json()["data"]["getAllUserRelatedEventsByEmail"]

# Uso:
eventos = get_user_events("user@email.com")
print(f"Eventos: {len(eventos)}")
```

---

### **CASO 2: Crear mesa en evento**

```python
def create_mesa(evento_id, nombre, capacidad, tipo="normal"):
    mutation = """
    mutation CreateMesa($input: MesaInput!, $dev: String!) {
      MESAS_create(input: $input, development: $dev) {
        success
        message
        mesa {
          _id
          nombre_mesa
          capacidad
        }
      }
    }
    """
    
    response = httpx.post(
        API_URL_GRAPHQL,
        json={
            "query": mutation,
            "variables": {
                "input": {
                    "evento_id": evento_id,
                    "nombre_mesa": nombre,
                    "capacidad": capacidad,
                    "tipo": tipo
                },
                "dev": "bodasdehoy"
            }
        },
        headers=HEADERS
    )
    
    result = response.json()["data"]["MESAS_create"]
    if result["success"]:
        print(f"✅ Mesa creada: {result['mesa']['nombre_mesa']}")
    else:
        print(f"❌ Error: {result['message']}")
    
    return result

# Uso:
create_mesa("6703b9e4a72ee8e92b7ad6a5", "Mesa VIP", 10, "vip")
```

---

### **CASO 3: Obtener sugerencias de IA**

```python
def get_ai_suggestions(evento_id):
    query = """
    query GetSuggestions($eventId: ID!, $dev: String!) {
      EVT_getSuggestionsByContext(
        eventId: $eventId
        development: $dev
      ) {
        decoracion {
          titulo
          descripcion
          relevancia
        }
        menu {
          titulo
          descripcion
        }
        colores
        consideraciones
      }
    }
    """
    
    response = httpx.post(
        API_URL_GRAPHQL,
        json={
            "query": query,
            "variables": {"eventId": evento_id, "dev": "bodasdehoy"}
        },
        headers=HEADERS
    )
    
    return response.json()["data"]["EVT_getSuggestionsByContext"]

# Uso:
sugerencias = get_ai_suggestions("6703b9e4a72ee8e92b7ad6a5")
print("🤖 Sugerencias de decoración:")
for sug in sugerencias["decoracion"]:
    print(f"  - {sug['titulo']}: {sug['descripcion']}")
```

---

## 📞 SOPORTE Y CONTACTO

### **Si tienes problemas:**

1. **Primero:** Revisa la sección "Errores Comunes" arriba
2. **Segundo:** Ejecuta `mcp_testing_script.py` para diagnóstico
3. **Tercero:** Revisa los logs de tu aplicación
4. **Último:** Contacta al equipo de soporte

### **Información de contacto:**
```
Email: backend@eventosorganizador.com
Slack: #api-support
Response time: <4 horas (normal), <1 hora (crítico)
Horario: 24/7
```

### **Al reportar un problema, incluye:**
```
1. Código que estás ejecutando
2. Respuesta completa de la API (JSON)
3. Headers que estás enviando
4. Development que estás usando
5. Logs de error (si los tienes)
```

---

## ✅ CHECKLIST DE INTEGRACIÓN

### **Antes de lanzar a producción:**

- [ ] He leído toda esta guía
- [ ] He probado GraphQL endpoint
- [ ] He probado MCP endpoint
- [ ] Todos los tests pasan (`mcp_testing_script.py`)
- [ ] Implementé manejo de errores
- [ ] Implementé timeouts
- [ ] Implementé rate limiting handling
- [ ] Implementé logging
- [ ] Implementé métricas
- [ ] Cacheo datos estáticos
- [ ] Uso queries específicas (no traigo TODO)
- [ ] Paralelizo queries independientes
- [ ] Tengo plan de rollback
- [ ] Documenté mi implementación

**Si todos ✅: Listo para producción** 🚀

---

## 🎯 PRÓXIMOS PASOS RECOMENDADOS

### **DÍA 1: Setup y familiarización**
1. Leer esta guía completa
2. Configurar entorno local
3. Ejecutar scripts de ejemplo
4. Correr tests

### **DÍA 2-3: Desarrollo**
1. Implementar casos de uso básicos
2. Implementar manejo de errores
3. Agregar logging y métricas
4. Testing interno

### **DÍA 4-5: Refinamiento**
1. Optimizar queries
2. Implementar caching
3. Paralelizar donde sea posible
4. Documentar tu código

### **DÍA 6: Pre-producción**
1. Testing exhaustivo
2. Load testing
3. Preparar rollback plan
4. Documentar deployment

### **DÍA 7: Lanzamiento**
1. Deploy a producción
2. Monitorear métricas
3. Responder a issues
4. Iterar y mejorar

---

## 📚 RECURSOS ADICIONALES

### **Documentación:**
```
✅ 1000_PREGUNTAS_AGENTE_IA_EVENTOS_COMPLETO.md
✅ 300_CASOS_METODOS_PARA_AGENTE_IA.md
✅ DOCUMENTACION_FRONTEND_COMPLETA_100.md
✅ RESPUESTA_FEEDBACK_CLIENTE_IA_LOBECHAT.md
✅ MCP_IMPLEMENTATION_GUIDE.md
```

### **Scripts:**
```
✅ mcp_testing_script.py
✅ nginx_mcp_config.conf
✅ docker-compose-with-mcp.yml
```

### **Ejemplos:**
```
Ver sección "Casos de Uso Comunes" en este documento
```

---

## 🎉 CONCLUSIÓN

### **Tienes TODO lo que necesitas:**

```
✅ 305 Queries
✅ 456 Mutations
✅ 35 Herramientas MCP
✅ 1,300+ Ejemplos
✅ Documentación exhaustiva
✅ Scripts de testing
✅ Esta guía completa
```

### **Estás listo para:**

```
✅ Entrenar tu agente IA
✅ Integrar vía GraphQL
✅ Integrar vía MCP
✅ Lanzar a producción
```

### **Recuerda:**

1. 📖 Lee la documentación
2. 🧪 Testea todo antes de producción
3. 🔍 Implementa logging y métricas
4. ⚡ Optimiza (cachea, paraleliza)
5. 📞 Contacta soporte si tienes dudas

---

**Documento:** Guía Completa para el Cliente Desarrollador  
**Versión:** 1.0 FINAL  
**Fecha:** 07 de Octubre 2025  
**Estado:** ✅ COMPLETO  

# 🚀 ¡ÉXITO EN TU INTEGRACIÓN!

**Todo está listo. Ahora es tu turno de construir algo increíble.** ✨

