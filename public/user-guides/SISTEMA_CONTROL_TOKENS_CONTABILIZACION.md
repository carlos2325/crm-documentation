# 🎯 SISTEMA DE CONTROL DE TOKENS Y CONTABILIZACIÓN

## 📊 **RESUMEN EJECUTIVO**

Nuestro sistema de control de tokens y contabilización es una solución integral que permite:
- **Tracking en tiempo real** de uso de API
- **Contabilización automática** de servicios (emails, SMS, WhatsApp)
- **Facturación precisa** basada en consumo real
- **Control de límites** y alertas automáticas
- **Reportes detallados** de uso y costos

---

## 🔧 **ARQUITECTURA DEL SISTEMA**

### **📈 Componentes Principales:**

#### **1. Sistema de Tracking (`UsageTracking`)**
```graphql
type UsageTracking {
  id: String!
  clientId: String!
  serviceType: String!  # EMAIL, SMS, WHATSAPP, API_CALL
  quantity: Int!
  cost: Float!
  timestamp: String!
  metadata: JSON
}
```

#### **2. Control de Límites (`UsageLimits`)**
```graphql
type UsageLimits {
  clientId: String!
  monthlyLimit: Int!
  dailyLimit: Int!
  currentUsage: Int!
  resetDate: String!
  alerts: [Alert!]!
}
```

#### **3. Facturación (`Billing`)**
```graphql
type Billing {
  clientId: String!
  period: String!
  totalCost: Float!
  breakdown: [ServiceCost!]!
  status: BillingStatus!
  dueDate: String!
}
```

---

## 📊 **SERVICIOS CONTABILIZADOS**

### **📧 EMAIL MARKETING**
- **Costo por email**: $0.001 USD
- **Tracking**: Envíos, rebotes, aperturas, clics
- **Límites**: 10,000 emails/mes (plan básico)

#### **Ejemplo de Contabilización:**
```json
{
  "serviceType": "EMAIL",
  "quantity": 1000,
  "cost": 1.00,
  "breakdown": {
    "sent": 1000,
    "delivered": 950,
    "bounced": 50,
    "opened": 300,
    "clicked": 150
  }
}
```

### **💬 WHATSAPP BUSINESS**
- **Costo por mensaje**: $0.005 USD
- **Tracking**: Enviados, entregados, leídos
- **Límites**: 5,000 mensajes/mes (plan básico)

#### **Ejemplo de Contabilización:**
```json
{
  "serviceType": "WHATSAPP",
  "quantity": 500,
  "cost": 2.50,
  "breakdown": {
    "sent": 500,
    "delivered": 480,
    "read": 350,
    "failed": 20
  }
}
```

### **📱 SMS**
- **Costo por SMS**: $0.01 USD
- **Tracking**: Enviados, entregados, fallidos
- **Límites**: 2,000 SMS/mes (plan básico)

#### **Ejemplo de Contabilización:**
```json
{
  "serviceType": "SMS",
  "quantity": 200,
  "cost": 2.00,
  "breakdown": {
    "sent": 200,
    "delivered": 195,
    "failed": 5
  }
}
```

### **🔌 API CALLS**
- **Costo por llamada**: $0.0001 USD
- **Tracking**: Requests, responses, errores
- **Límites**: 100,000 calls/mes (plan básico)

---

## 🎯 **FUNCIONALIDADES PRINCIPALES**

### **1. Tracking Automático**
```javascript
// Ejemplo de uso en el código
const tracking = await trackUsage({
  clientId: 'bodasdehoy',
  serviceType: 'EMAIL',
  quantity: 100,
  metadata: {
    campaignId: 'camp_123',
    templateId: 'template_456'
  }
});
```

### **2. Control de Límites**
```javascript
// Verificar límites antes de enviar
const canSend = await checkUsageLimits({
  clientId: 'bodasdehoy',
  serviceType: 'EMAIL',
  requestedQuantity: 1000
});

if (!canSend.allowed) {
  throw new Error(`Límite excedido: ${canSend.message}`);
}
```

### **3. Alertas Automáticas**
- **80% del límite**: Email de advertencia
- **95% del límite**: Email crítico
- **100% del límite**: Bloqueo automático

### **4. Reportes en Tiempo Real**
```graphql
query {
  getUsageTrackingStats(clientId: "bodasdehoy") {
    totalUsage
    monthlyCost
    serviceBreakdown {
      serviceType
      quantity
      cost
    }
    remainingLimits {
      serviceType
      remaining
      percentage
    }
  }
}
```

---

## 📊 **DASHBOARD DE CONTROL**

### **📈 Métricas Principales:**
- **Uso total del mes**: Cantidad y costo
- **Uso por servicio**: Email, SMS, WhatsApp, API
- **Tendencia diaria**: Gráficos de consumo
- **Límites restantes**: Porcentaje disponible
- **Proyección mensual**: Estimación de costos

### **📋 Reportes Disponibles:**
1. **Reporte Diario**: Uso del día actual
2. **Reporte Semanal**: Resumen de 7 días
3. **Reporte Mensual**: Resumen completo del mes
4. **Reporte por Servicio**: Detalle por tipo de servicio
5. **Reporte de Costos**: Análisis de gastos

---

## 💰 **PLANES Y PRECIOS**

### **🟢 PLAN BÁSICO - $29/mes**
- **Emails**: 10,000/mes
- **WhatsApp**: 5,000 mensajes/mes
- **SMS**: 2,000/mes
- **API Calls**: 100,000/mes
- **Soporte**: Email

### **🟡 PLAN PROFESIONAL - $79/mes**
- **Emails**: 50,000/mes
- **WhatsApp**: 25,000 mensajes/mes
- **SMS**: 10,000/mes
- **API Calls**: 500,000/mes
- **Soporte**: Email + Chat

### **🔴 PLAN EMPRESARIAL - $199/mes**
- **Emails**: 200,000/mes
- **WhatsApp**: 100,000 mensajes/mes
- **SMS**: 50,000/mes
- **API Calls**: 2,000,000/mes
- **Soporte**: 24/7 + Teléfono

### **⚡ PLAN PERSONALIZADO**
- **Límites flexibles** según necesidades
- **Precios negociables** por volumen
- **Soporte dedicado**
- **Integración personalizada**

---

## 🔧 **INTEGRACIÓN TÉCNICA**

### **1. API Endpoints**
```bash
# Tracking de uso
POST /api/usage/track
{
  "clientId": "bodasdehoy",
  "serviceType": "EMAIL",
  "quantity": 100
}

# Consultar límites
GET /api/usage/limits/bodasdehoy

# Obtener reportes
GET /api/usage/reports/bodasdehoy?period=monthly
```

### **2. Webhooks**
```javascript
// Webhook para alertas de límites
app.post('/webhook/usage-alert', (req, res) => {
  const { clientId, serviceType, percentage } = req.body;
  
  if (percentage >= 95) {
    // Enviar alerta crítica
    sendCriticalAlert(clientId, serviceType);
  }
});
```

### **3. SDKs Disponibles**
- **JavaScript/Node.js**
- **Python**
- **PHP**
- **Java**
- **C#**

---

## 📊 **EJEMPLOS DE USO REAL**

### **📧 Campaña de Email Marketing**
```javascript
// Enviar campaña de 1,000 emails
const campaign = await sendEmailCampaign({
  to: 1000,
  template: 'welcome_template',
  clientId: 'bodasdehoy'
});

// El sistema automáticamente:
// 1. Registra 1,000 emails enviados
// 2. Calcula costo: $1.00
// 3. Actualiza contador mensual
// 4. Verifica límites restantes
```

### **💬 Campaña de WhatsApp**
```javascript
// Enviar 500 mensajes de WhatsApp
const whatsapp = await sendWhatsAppBulk({
  messages: 500,
  template: 'event_reminder',
  clientId: 'bodasdehoy'
});

// El sistema automáticamente:
// 1. Registra 500 mensajes enviados
// 2. Calcula costo: $2.50
// 3. Actualiza métricas de entrega
// 4. Genera reporte de rendimiento
```

---

## 🚨 **ALERTAS Y NOTIFICACIONES**

### **📧 Tipos de Alertas:**
1. **Límite 80%**: "Has usado el 80% de tu límite mensual de emails"
2. **Límite 95%**: "¡ATENCIÓN! Has usado el 95% de tu límite mensual"
3. **Límite 100%**: "Límite excedido. Servicio temporalmente suspendido"
4. **Costo alto**: "Tu gasto mensual ha superado $X"
5. **Uso inusual**: "Detectado patrón de uso inusual"

### **📱 Canales de Notificación:**
- **Email**: Notificaciones detalladas
- **Dashboard**: Alertas en tiempo real
- **Webhook**: Integración con sistemas externos
- **SMS**: Alertas críticas (opcional)

---

## 📈 **BENEFICIOS DEL SISTEMA**

### **✅ Para el Cliente:**
- **Control total** del gasto mensual
- **Transparencia** en costos por servicio
- **Alertas proactivas** para evitar sobrecostos
- **Reportes detallados** para análisis
- **Escalabilidad** según necesidades

### **✅ Para el Proveedor:**
- **Facturación automática** y precisa
- **Control de abuso** y límites
- **Métricas de uso** para optimización
- **Alertas de problemas** proactivas
- **Reportes de rendimiento** del sistema

---

## 🔒 **SEGURIDAD Y PRIVACIDAD**

### **🛡️ Medidas de Seguridad:**
- **Encriptación** de datos de uso
- **Autenticación** por tokens JWT
- **Rate limiting** para prevenir abuso
- **Auditoría** completa de accesos
- **Backup** automático de datos

### **🔐 Privacidad:**
- **Datos anónimos** en reportes agregados
- **Cumplimiento GDPR** y normativas
- **Retención limitada** de datos
- **Eliminación segura** de información

---

## 📞 **SOPORTE Y CONTACTO**

### **🆘 Canales de Soporte:**
- **Email**: soporte@eventosorganizador.com
- **Chat**: Disponible 24/7 en el dashboard
- **Teléfono**: +34 900 123 456 (Plan Empresarial)
- **Documentación**: https://docs.eventosorganizador.com

### **📚 Recursos Adicionales:**
- **Guías de integración** paso a paso
- **Ejemplos de código** en múltiples lenguajes
- **Videos tutoriales** de configuración
- **FAQ** con preguntas comunes
- **Comunidad** de desarrolladores

---

## 🎯 **PRÓXIMOS PASOS**

### **🚀 Para Implementar:**
1. **Configurar** límites de uso
2. **Integrar** SDK en aplicación
3. **Configurar** alertas y notificaciones
4. **Probar** sistema con datos de prueba
5. **Monitorear** métricas en tiempo real

### **📊 Para Optimizar:**
1. **Analizar** patrones de uso
2. **Ajustar** límites según necesidades
3. **Optimizar** costos por servicio
4. **Implementar** mejores prácticas
5. **Escalar** según crecimiento

---

**¿Necesitas más información sobre algún aspecto específico del sistema de control de tokens y contabilización?**
