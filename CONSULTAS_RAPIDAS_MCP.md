# ⚡ CONSULTAS RÁPIDAS PARA SERVICIO MCP

## 🚀 URLs Externas del Servicio MCP

### URL Base:
```
https://api2.eventosorganizador.com
```

---

## 📋 ENDPOINTS MCP DISPONIBLES

### 1. Health Check MCP
```bash
curl -s https://api2.eventosorganizador.com/mcp/health | jq .
```

### 2. Listar Herramientas MCP (JSON-RPC)
```bash
curl -s -X POST https://api2.eventosorganizador.com/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}' | jq .
```

### 3. Health Check Tool (JSON-RPC)
```bash
curl -s -X POST https://api2.eventosorganizador.com/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc": "2.0", "id": 2, "method": "tools/call", "params": {"name": "health_check", "arguments": {}}}' | jq .
```

### 4. Get Events by Phone (JSON-RPC)
```bash
curl -s -X POST https://api2.eventosorganizador.com/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc": "2.0", "id": 3, "method": "tools/call", "params": {"name": "get_events_by_phone", "arguments": {"phoneNumber": "+573001234567"}}}' | jq .
```

### 5. Get Event Details (JSON-RPC)
```bash
curl -s -X POST https://api2.eventosorganizador.com/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc": "2.0", "id": 4, "method": "tools/call", "params": {"name": "get_event_details", "arguments": {"eventId": "EVENT_ID_AQUI"}}}' | jq .
```

### 6. Get User Events (JSON-RPC)
```bash
curl -s -X POST https://api2.eventosorganizador.com/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc": "2.0", "id": 5, "method": "tools/call", "params": {"name": "get_user_events", "arguments": {"userId": "USER_ID_AQUI"}}}' | jq .
```

### 7. Get Event Summary (JSON-RPC)
```bash
curl -s -X POST https://api2.eventosorganizador.com/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc": "2.0", "id": 6, "method": "tools/call", "params": {"name": "get_event_summary", "arguments": {"eventId": "EVENT_ID_AQUI"}}}' | jq .
```

### 8. MCP Tools Endpoint (HTTP)
```bash
curl -s https://api2.eventosorganizador.com/tools | jq .
```

### 9. MCP SSE (Server-Sent Events)
```bash
curl -s https://api2.eventosorganizador.com/sse | head -n 5
```

### 🆕 10. Get CRM Virtual Contacts (JSON-RPC)
```bash
curl -s -X POST https://api2.eventosorganizador.com/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc": "2.0", "id": 10, "method": "tools/call", "params": {"name": "get_crm_virtual_contacts", "arguments": {"filters": {}, "pagination": {"page": 1, "limit": 10}}}}' | jq .
```

### 🆕 11. Sync Event Guests to Virtual Contacts (JSON-RPC)
```bash
curl -s -X POST https://api2.eventosorganizador.com/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc": "2.0", "id": 11, "method": "tools/call", "params": {"name": "sync_event_guests_to_virtual_contacts", "arguments": {"eventId": "EVENT_ID_AQUI"}}}' | jq .
```

### 🆕 12. Get CRM Extended Contact Lists (JSON-RPC)
```bash
curl -s -X POST https://api2.eventosorganizador.com/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc": "2.0", "id": 12, "method": "tools/call", "params": {"name": "get_crm_extended_contact_lists", "arguments": {"filters": {}, "pagination": {"page": 1, "limit": 10}}}}' | jq .
```

### 🆕 13. Create CRM Extended Contact List (JSON-RPC)
```bash
curl -s -X POST https://api2.eventosorganizador.com/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc": "2.0", "id": 13, "method": "tools/call", "params": {"name": "create_crm_extended_contact_list", "arguments": {"input": {"name": "Lista Mixta", "description": "Lista de contactos CRM + virtuales", "virtualContactIds": ["vc1", "vc2"]}}}' | jq .
```

### 🆕 14. Get CRM Event Messaging Stats (JSON-RPC)
```bash
curl -s -X POST https://api2.eventosorganizador.com/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc": "2.0", "id": 14, "method": "tools/call", "params": {"name": "get_crm_event_messaging_stats", "arguments": {"eventId": "EVENT_ID_AQUI"}}}' | jq .
```

---

## 🧪 CONSULTA DE VERIFICACIÓN COMPLETA MCP

### Test de Todos los Endpoints MCP
```bash
echo "🧪 PROBANDO TODOS LOS ENDPOINTS MCP"
echo "==================================="
echo ""

echo "1️⃣ MCP Health Check:"
curl -s https://api2.eventosorganizador.com/mcp/health | jq '.status'

echo "2️⃣ MCP Tools List:"
curl -s -X POST https://api2.eventosorganizador.com/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}' | jq '.result.tools | length'

echo "3️⃣ MCP Tools HTTP:"
curl -s https://api2.eventosorganizador.com/tools | jq '.total'

echo "4️⃣ MCP SSE Connection:"
curl -s https://api2.eventosorganizador.com/sse | head -n 1 | grep -o '"type":"connected"'

echo ""
echo "🎯 RESULTADOS ESPERADOS:"
echo "========================"
echo "✅ MCP Health Check: \"ok\""
echo "✅ MCP Tools List: 5+ herramientas (incluyendo nuevas CRM v2.1.0)"
echo "✅ MCP Tools HTTP: 44+ herramientas"
echo "✅ MCP SSE Connection: \"connected\""
echo ""
echo "🆕 NUEVAS HERRAMIENTAS CRM v2.1.0:"
echo "=================================="
echo "✅ get_crm_virtual_contacts - Contactos virtuales"
echo "✅ sync_event_guests_to_virtual_contacts - Sincronización"
echo "✅ get_crm_extended_contact_lists - Listas extendidas"
echo "✅ create_crm_extended_contact_list - Crear listas"
echo "✅ get_crm_event_messaging_stats - Estadísticas"
echo ""
echo "🚀 ¡Servicio MCP 100% operativo con CRM Avanzado!"
```

---

## 📊 HERRAMIENTAS MCP DISPONIBLES

### Herramientas Básicas (5):
- `health_check` - Verifica el estado del servidor
- `get_events_by_phone` - Buscar eventos por teléfono
- `get_event_details` - Obtener detalles de evento
- `get_user_events` - Listar eventos de usuario
- `get_event_summary` - Resumen de evento

### 🆕 Herramientas CRM Avanzadas v2.1.0 (5+ nuevas):
- `get_crm_virtual_contacts` - Obtener contactos virtuales
- `sync_event_guests_to_virtual_contacts` - Sincronizar invitados
- `get_crm_extended_contact_lists` - Obtener listas extendidas
- `create_crm_extended_contact_list` - Crear lista extendida
- `get_crm_event_messaging_stats` - Estadísticas de mensajería por evento

### Herramientas Completas (44+):
- **Eventos**: get_event, get_events_by_phone, get_events_by_email, etc.
- **Negocios**: get_businesses, get_business_details, search_businesses, etc.
- **Posts**: get_posts, count_posts, search_posts, etc.
- **Chats**: get_user_chats, get_chat_messages, create_chat, send_message, etc.
- **WhatsApp**: get_whitelabel_whatsapp_numbers, configure_whatsapp_n8n, etc.
- **Usuarios**: get_user_info, search_users, get_user_events, etc.
- **🆕 CRM Avanzado**: contactos virtuales, listas extendidas, integración eventos-CRM

---

## 🎯 CONFIGURACIÓN DEL SERVICIO

### Puerto Interno:
- **MCP Server**: Puerto 4001
- **GraphQL API**: Puerto 4000

### URLs de Acceso:
- **Producción**: `https://api2.eventosorganizador.com`
- **Test**: `https://testapi2.eventosorganizador.com`

### Endpoints Principales:
- **MCP JSON-RPC**: `/mcp`
- **MCP Health**: `/mcp/health`
- **MCP Tools**: `/tools`
- **MCP SSE**: `/sse`
- **GraphQL**: `/graphql`

---

## 🚀 INSTRUCCIONES DE USO

1. **Para consultas JSON-RPC**: Usar endpoint `/mcp` con método POST
2. **Para listar herramientas**: Usar endpoint `/tools` con método GET
3. **Para conexiones en tiempo real**: Usar endpoint `/sse`
4. **Para verificar estado**: Usar endpoint `/mcp/health`

**¡El servicio MCP está listo para integrar con sistemas externos!** 🚀
