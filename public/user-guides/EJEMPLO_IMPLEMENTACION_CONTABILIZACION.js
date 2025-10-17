// 🎯 EJEMPLO DE IMPLEMENTACIÓN DEL SISTEMA DE CONTABILIZACIÓN
// =============================================================

const axios = require('axios');
const jwt = require('jsonwebtoken');

// Configuración del cliente
const CONFIG = {
  apiUrl: 'https://api2.eventosorganizador.com/graphql',
  clientId: 'bodasdehoy',
  apiKey: 'tu-api-key-aqui',
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' // Token JWT válido
};

// Precios por servicio
const PRICING = {
  EMAIL: 0.001,      // $0.001 por email
  WHATSAPP: 0.005,   // $0.005 por mensaje WhatsApp
  SMS: 0.01,         // $0.01 por SMS
  API_CALL: 0.0001   // $0.0001 por llamada API
};

// =============================================================
// 1. SISTEMA DE TRACKING DE USO
// =============================================================

class UsageTracker {
  constructor(config) {
    this.config = config;
    this.axios = axios.create({
      baseURL: config.apiUrl,
      headers: {
        'Authorization': `Bearer ${config.token}`,
        'Content-Type': 'application/json',
        'Origin': 'https://bodasdehoy.com'
      }
    });
  }

  // Trackear uso de un servicio
  async trackUsage(serviceType, quantity, metadata = {}) {
    try {
      const cost = quantity * PRICING[serviceType];
      
      const mutation = `
        mutation {
          createUsageTracking(input: {
            clientId: "${this.config.clientId}"
            serviceType: "${serviceType}"
            quantity: ${quantity}
            cost: ${cost}
            metadata: ${JSON.stringify(metadata)}
          }) {
            success
            id
            message
          }
        }
      `;

      const response = await this.axios.post('', { query: mutation });
      
      if (response.data.data.createUsageTracking.success) {
        console.log(`✅ Uso registrado: ${quantity} ${serviceType} - Costo: $${cost.toFixed(4)}`);
        return response.data.data.createUsageTracking;
      } else {
        throw new Error(response.data.data.createUsageTracking.message);
      }
    } catch (error) {
      console.error('❌ Error tracking uso:', error.message);
      throw error;
    }
  }

  // Verificar límites antes de usar un servicio
  async checkLimits(serviceType, requestedQuantity) {
    try {
      const query = `
        query {
          getUsageTrackingStats(clientId: "${this.config.clientId}") {
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
      `;

      const response = await this.axios.post('', { query });
      const stats = response.data.data.getUsageTrackingStats;
      
      const serviceStats = stats.serviceBreakdown.find(s => s.serviceType === serviceType);
      const remaining = stats.remainingLimits.find(s => s.serviceType === serviceType);
      
      if (!serviceStats || !remaining) {
        throw new Error(`Servicio ${serviceType} no encontrado en límites`);
      }

      const canUse = remaining.remaining >= requestedQuantity;
      
      return {
        allowed: canUse,
        remaining: remaining.remaining,
        percentage: remaining.percentage,
        message: canUse ? 
          `✅ Puedes usar ${requestedQuantity} ${serviceType}` : 
          `❌ Límite excedido. Disponible: ${remaining.remaining}`
      };
    } catch (error) {
      console.error('❌ Error verificando límites:', error.message);
      throw error;
    }
  }
}

// =============================================================
// 2. SISTEMA DE ENVÍO DE EMAILS CON CONTABILIZACIÓN
// =============================================================

class EmailService {
  constructor(tracker) {
    this.tracker = tracker;
  }

  async sendEmailCampaign(recipients, template, subject) {
    try {
      const quantity = recipients.length;
      
      // Verificar límites antes de enviar
      const limits = await this.tracker.checkLimits('EMAIL', quantity);
      if (!limits.allowed) {
        throw new Error(limits.message);
      }

      console.log(`📧 Enviando campaña de email a ${quantity} destinatarios...`);
      
      // Simular envío de emails
      const results = await this.simulateEmailSend(recipients, template, subject);
      
      // Trackear uso exitoso
      await this.tracker.trackUsage('EMAIL', results.sent, {
        campaign: 'email_campaign',
        template: template,
        subject: subject,
        delivered: results.delivered,
        bounced: results.bounced
      });

      return results;
    } catch (error) {
      console.error('❌ Error enviando emails:', error.message);
      throw error;
    }
  }

  async simulateEmailSend(recipients, template, subject) {
    // Simular envío real de emails
    const sent = recipients.length;
    const delivered = Math.floor(sent * 0.95); // 95% entrega
    const bounced = sent - delivered;
    
    return {
      sent,
      delivered,
      bounced,
      template,
      subject
    };
  }
}

// =============================================================
// 3. SISTEMA DE WHATSAPP CON CONTABILIZACIÓN
// =============================================================

class WhatsAppService {
  constructor(tracker) {
    this.tracker = tracker;
  }

  async sendWhatsAppBulk(recipients, template, message) {
    try {
      const quantity = recipients.length;
      
      // Verificar límites
      const limits = await this.tracker.checkLimits('WHATSAPP', quantity);
      if (!limits.allowed) {
        throw new Error(limits.message);
      }

      console.log(`💬 Enviando ${quantity} mensajes de WhatsApp...`);
      
      // Simular envío de WhatsApp
      const results = await this.simulateWhatsAppSend(recipients, template, message);
      
      // Trackear uso
      await this.tracker.trackUsage('WHATSAPP', results.sent, {
        campaign: 'whatsapp_campaign',
        template: template,
        delivered: results.delivered,
        read: results.read,
        failed: results.failed
      });

      return results;
    } catch (error) {
      console.error('❌ Error enviando WhatsApp:', error.message);
      throw error;
    }
  }

  async simulateWhatsAppSend(recipients, template, message) {
    const sent = recipients.length;
    const delivered = Math.floor(sent * 0.96); // 96% entrega
    const read = Math.floor(delivered * 0.70); // 70% lectura
    const failed = sent - delivered;
    
    return {
      sent,
      delivered,
      read,
      failed,
      template,
      message
    };
  }
}

// =============================================================
// 4. SISTEMA DE REPORTES Y MÉTRICAS
// =============================================================

class ReportingService {
  constructor(tracker) {
    this.tracker = tracker;
  }

  async getMonthlyReport() {
    try {
      const query = `
        query {
          getUsageTrackingStats(clientId: "${this.tracker.config.clientId}") {
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
      `;

      const response = await this.tracker.axios.post('', { query });
      return response.data.data.getUsageTrackingStats;
    } catch (error) {
      console.error('❌ Error obteniendo reporte:', error.message);
      throw error;
    }
  }

  async printReport() {
    const report = await this.getMonthlyReport();
    
    console.log('\n📊 REPORTE MENSUAL DE USO');
    console.log('==========================');
    console.log(`💰 Costo total: $${report.monthlyCost.toFixed(2)}`);
    console.log(`📈 Uso total: ${report.totalUsage} servicios`);
    console.log('\n📋 Desglose por servicio:');
    
    report.serviceBreakdown.forEach(service => {
      console.log(`  ${service.serviceType}: ${service.quantity} unidades - $${service.cost.toFixed(2)}`);
    });
    
    console.log('\n🎯 Límites restantes:');
    report.remainingLimits.forEach(limit => {
      console.log(`  ${limit.serviceType}: ${limit.remaining} restantes (${limit.percentage}% usado)`);
    });
  }
}

// =============================================================
// 5. EJEMPLO DE USO COMPLETO
// =============================================================

async function ejemploCompleto() {
  try {
    console.log('🚀 INICIANDO EJEMPLO DE SISTEMA DE CONTABILIZACIÓN\n');
    
    // Inicializar servicios
    const tracker = new UsageTracker(CONFIG);
    const emailService = new EmailService(tracker);
    const whatsappService = new WhatsAppService(tracker);
    const reportingService = new ReportingService(tracker);
    
    // 1. Enviar campaña de email
    console.log('1. 📧 ENVIANDO CAMPAÑA DE EMAIL');
    const emailRecipients = Array(1000).fill().map((_, i) => `usuario${i}@ejemplo.com`);
    const emailResults = await emailService.sendEmailCampaign(
      emailRecipients, 
      'welcome_template', 
      '¡Bienvenido a Bodas de Hoy!'
    );
    console.log(`   ✅ Enviados: ${emailResults.sent}, Entregados: ${emailResults.delivered}\n`);
    
    // 2. Enviar campaña de WhatsApp
    console.log('2. 💬 ENVIANDO CAMPAÑA DE WHATSAPP');
    const whatsappRecipients = Array(500).fill().map((_, i) => `+34600000${i.toString().padStart(3, '0')}`);
    const whatsappResults = await whatsappService.sendWhatsAppBulk(
      whatsappRecipients,
      'event_reminder',
      'Recordatorio: Tu evento está próximo'
    );
    console.log(`   ✅ Enviados: ${whatsappResults.sent}, Entregados: ${whatsappResults.delivered}\n`);
    
    // 3. Generar reporte
    console.log('3. 📊 GENERANDO REPORTE');
    await reportingService.printReport();
    
    console.log('\n🎉 EJEMPLO COMPLETADO EXITOSAMENTE');
    
  } catch (error) {
    console.error('❌ Error en ejemplo:', error.message);
  }
}

// =============================================================
// 6. SISTEMA DE ALERTAS
// =============================================================

class AlertSystem {
  constructor(tracker) {
    this.tracker = tracker;
  }

  async checkAlerts() {
    try {
      const report = await this.tracker.getMonthlyReport();
      
      report.remainingLimits.forEach(limit => {
        if (limit.percentage >= 95) {
          console.log(`🚨 ALERTA CRÍTICA: ${limit.serviceType} al ${limit.percentage}%`);
          this.sendCriticalAlert(limit);
        } else if (limit.percentage >= 80) {
          console.log(`⚠️ ADVERTENCIA: ${limit.serviceType} al ${limit.percentage}%`);
          this.sendWarningAlert(limit);
        }
      });
    } catch (error) {
      console.error('❌ Error verificando alertas:', error.message);
    }
  }

  sendCriticalAlert(limit) {
    // Implementar envío de alerta crítica
    console.log(`📧 Enviando alerta crítica para ${limit.serviceType}`);
  }

  sendWarningAlert(limit) {
    // Implementar envío de advertencia
    console.log(`📧 Enviando advertencia para ${limit.serviceType}`);
  }
}

// =============================================================
// 7. EJECUTAR EJEMPLO
// =============================================================

if (require.main === module) {
  ejemploCompleto();
}

module.exports = {
  UsageTracker,
  EmailService,
  WhatsAppService,
  ReportingService,
  AlertSystem,
  PRICING
};
