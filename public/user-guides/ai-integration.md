# 🤖 Integración con IA - Guía Completa

**Integra ChatGPT, Claude y otras IAs para automatizar tu negocio de eventos**

---

## 🎯 **¿Qué puedes hacer con IA?**

### **Automatización Inteligente**
- ✅ **Chatbots avanzados** con comprensión contextual
- ✅ **Generación automática** de contenido personalizado
- ✅ **Análisis predictivo** de comportamiento de clientes
- ✅ **Asistentes virtuales** para gestión de eventos

### **Integraciones Disponibles**
- ✅ **OpenAI GPT-4** - Para conversaciones avanzadas
- ✅ **Anthropic Claude** - Para análisis complejos
- ✅ **Google Gemini** - Para tareas multiformato
- ✅ **IA Local** - Para privacidad total

---

## 🚀 **Configuración Básica**

### **Configurar Claves de API**
```javascript
// Configuración de claves de IA
const configuracionIA = {
  openai: {
    apiKey: "sk-tu-clave-openai",
    model: "gpt-4",
    temperature: 0.7
  },
  claude: {
    apiKey: "sk-ant-tu-clave-claude",
    model: "claude-3-sonnet-20240229",
    temperature: 0.7
  },
  gemini: {
    apiKey: "tu-clave-gemini",
    model: "gemini-pro",
    temperature: 0.7
  }
};
```

### **Verificar Conexiones de IA**
```javascript
async function verificarConexionesIA() {
  const response = await fetch('https://api2.eventosorganizador.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${miToken}`,
      'Origin': 'https://tu-dominio.com'
    },
    body: JSON.stringify({
      query: `
        query {
          getAIStatus {
            success
            status {
              openai {
                conectado
                modelo
                limiteUsos
                usosRestantes
              }
              claude {
                conectado
                modelo
                limiteUsos
                usosRestantes
              }
              gemini {
                conectado
                modelo
                limiteUsos
                usosRestantes
              }
            }
            errors
          }
        }
      `
    })
  });

  const data = await response.json();
  
  if (data.data.getAIStatus.success) {
    const status = data.data.getAIStatus.status;
    console.log('🤖 Estado de conexiones IA:');
    
    console.log('   OpenAI:');
    console.log(`     Conectado: ${status.openai.conectado ? '✅' : '❌'}`);
    console.log(`     Modelo: ${status.openai.modelo}`);
    console.log(`     Usos restantes: ${status.openai.usosRestantes}`);
    
    console.log('   Claude:');
    console.log(`     Conectado: ${status.claude.conectado ? '✅' : '❌'}`);
    console.log(`     Modelo: ${status.claude.modelo}`);
    console.log(`     Usos restantes: ${status.claude.usosRestantes}`);
    
    console.log('   Gemini:');
    console.log(`     Conectado: ${status.gemini.conectado ? '✅' : '❌'}`);
    console.log(`     Modelo: ${status.gemini.modelo}`);
    console.log(`     Usos restantes: ${status.gemini.usosRestantes}`);
    
    return status;
  } else {
    console.log('❌ Error verificando IA:', data.data.getAIStatus.errors);
    return null;
  }
}
```

---

## 💬 **Chatbot con IA Avanzado**

### **Crear Chatbot con IA**
```javascript
async function crearChatbotIA() {
  const response = await fetch('https://api2.eventosorganizador.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${miToken}`,
      'Origin': 'https://tu-dominio.com'
    },
    body: JSON.stringify({
      query: `
        mutation CreateAIChatbot($input: CreateAIChatbotInput!) {
          createAIChatbot(input: $input) {
            success
            chatbot {
              id
              nombre
              descripcion
              configuracion {
                modelo
                temperatura
                maxTokens
                sistemaPrompt
              }
              capacidades {
                analisisSentimientos
                generacionContenido
                recomendaciones
                traduccion
              }
              estado
              createdAt
            }
            errors
          }
        }
      `,
      variables: {
        input: {
          nombre: "Asistente IA de Bodas",
          descripcion: "Chatbot inteligente especializado en consultas sobre bodas",
          configuracion: {
            modelo: "gpt-4",
            temperatura: 0.7,
            maxTokens: 1000,
            sistemaPrompt: "Eres un asistente especializado en bodas y eventos. Ayudas a los clientes con consultas sobre precios, disponibilidad, decoración, catering y todos los aspectos de la planificación de bodas. Eres amable, profesional y conocedor del sector."
          },
          capacidades: {
            analisisSentimientos: true,
            generacionContenido: true,
            recomendaciones: true,
            traduccion: true
          }
        }
      }
    })
  });

  const data = await response.json();
  
  if (data.data.createAIChatbot.success) {
    const chatbot = data.data.createAIChatbot.chatbot;
    console.log('✅ Chatbot IA creado exitosamente:');
    console.log(`   ID: ${chatbot.id}`);
    console.log(`   Nombre: ${chatbot.nombre}`);
    console.log(`   Modelo: ${chatbot.configuracion.modelo}`);
    console.log(`   Capacidades: ${Object.keys(chatbot.capacidades).filter(k => chatbot.capacidades[k]).join(', ')}`);
    return chatbot.id;
  } else {
    console.log('❌ Error creando chatbot IA:', data.data.createAIChatbot.errors);
    return null;
  }
}
```

### **Procesar Mensaje con IA**
```javascript
async function procesarMensajeIA(numero, mensaje, chatbotId) {
  const response = await fetch('https://api2.eventosorganizador.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${miToken}`,
      'Origin': 'https://tu-dominio.com'
    },
    body: JSON.stringify({
      query: `
        mutation ProcessAIMessage($input: ProcessAIMessageInput!) {
          processAIMessage(input: $input) {
            success
            respuesta {
              mensaje
              analisisSentimientos {
                emocion
                confianza
                polaridad
              }
              intencion {
                categoria
                subcategoria
                confianza
              }
              recomendaciones {
                tipo
                descripcion
                prioridad
              }
              datosExtraidos {
                fecha
                presupuesto
                ubicacion
                tipoEvento
              }
            }
            metadata {
              modelo
              tokensUsados
              tiempoProcesamiento
              costo
            }
            errors
          }
        }
      `,
      variables: {
        input: {
          numero: numero,
          mensaje: mensaje,
          chatbotId: chatbotId,
          contexto: {
            historialConversacion: [],
            datosCliente: {},
            preferencias: {}
          }
        }
      }
    })
  });

  const data = await response.json();
  
  if (data.data.processAIMessage.success) {
    const resultado = data.data.processAIMessage;
    console.log('🤖 Respuesta IA generada:');
    console.log(`   Mensaje: ${resultado.respuesta.mensaje}`);
    
    if (resultado.respuesta.analisisSentimientos) {
      const sentimientos = resultado.respuesta.analisisSentimientos;
      console.log(`   Sentimiento: ${sentimientos.emocion} (${sentimientos.confianza}%)`);
    }
    
    if (resultado.respuesta.intencion) {
      const intencion = resultado.respuesta.intencion;
      console.log(`   Intención: ${intencion.categoria} - ${intencion.subcategoria}`);
    }
    
    if (resultado.respuesta.datosExtraidos.fecha) {
      console.log(`   Fecha extraída: ${resultado.respuesta.datosExtraidos.fecha}`);
    }
    
    console.log(`   Tokens usados: ${resultado.metadata.tokensUsados}`);
    console.log(`   Tiempo: ${resultado.metadata.tiempoProcesamiento}ms`);
    
    return resultado;
  } else {
    console.log('❌ Error procesando mensaje IA:', data.data.processAIMessage.errors);
    return null;
  }
}
```

---

## 📝 **Generación de Contenido**

### **Generar Contenido para Eventos**
```javascript
async function generarContenidoEvento(tipoEvento, tema, detalles) {
  const response = await fetch('https://api2.eventosorganizador.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${miToken}`,
      'Origin': 'https://tu-dominio.com'
    },
    body: JSON.stringify({
      query: `
        mutation GenerateEventContent($input: GenerateEventContentInput!) {
          generateEventContent(input: $input) {
            success
            contenido {
              invitacion {
                titulo
                mensaje
                hashtags
              }
              descripcionEvento
              programaEvento {
                hora
                actividad
                descripcion
              }
              mensajesRedesSociales {
                plataforma
                mensaje
                hashtags
              }
              emailMarketing {
                asunto
                contenido
                callToAction
              }
            }
            metadata {
              modelo
              tokensUsados
              tiempoGeneracion
            }
            errors
          }
        }
      `,
      variables: {
        input: {
          tipoEvento: tipoEvento,
          tema: tema,
          detalles: detalles,
          configuracion: {
            modelo: "gpt-4",
            estilo: "profesional",
            idioma: "español",
            tono: "elegante"
          }
        }
      }
    })
  });

  const data = await response.json();
  
  if (data.data.generateEventContent.success) {
    const contenido = data.data.generateEventContent.contenido;
    console.log('✅ Contenido generado exitosamente:');
    
    console.log('   📧 Invitación:');
    console.log(`     Título: ${contenido.invitacion.titulo}`);
    console.log(`     Mensaje: ${contenido.invitacion.mensaje}`);
    
    console.log('   📅 Programa del evento:');
    contenido.programaEvento.forEach(actividad => {
      console.log(`     ${actividad.hora}: ${actividad.actividad}`);
    });
    
    console.log('   📱 Redes sociales:');
    contenido.mensajesRedesSociales.forEach(mensaje => {
      console.log(`     ${mensaje.plataforma}: ${mensaje.mensaje}`);
    });
    
    return contenido;
  } else {
    console.log('❌ Error generando contenido:', data.data.generateEventContent.errors);
    return null;
  }
}

// Ejemplo de uso
const contenido = await generarContenidoEvento("boda", "vintage", {
  novios: "María y Carlos",
  fecha: "25 de Diciembre 2025",
  ubicacion: "Hotel Maravilloso, Madrid",
  colores: "dorado y blanco",
  estilo: "elegante y romántico"
});
```

### **Generar Respuestas Personalizadas**
```javascript
async function generarRespuestaPersonalizada(consulta, contextoCliente) {
  const response = await fetch('https://api2.eventosorganizador.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${miToken}`,
      'Origin': 'https://tu-dominio.com'
    },
    body: JSON.stringify({
      query: `
        mutation GeneratePersonalizedResponse($input: GeneratePersonalizedResponseInput!) {
          generatePersonalizedResponse(input: $input) {
            success
            respuesta {
              mensaje
              recomendaciones
              productosSugeridos
              proximosPasos
            }
            metadata {
              modelo
              personalizacionLevel
              confianza
            }
            errors
          }
        }
      `,
      variables: {
        input: {
          consulta: consulta,
          contextoCliente: contextoCliente,
          configuracion: {
            modelo: "claude-3-sonnet-20240229",
            personalizacion: "alta",
            incluirRecomendaciones: true
          }
        }
      }
    })
  });

  const data = await response.json();
  
  if (data.data.generatePersonalizedResponse.success) {
    const respuesta = data.data.generatePersonalizedResponse.respuesta;
    console.log('✅ Respuesta personalizada generada:');
    console.log(`   Mensaje: ${respuesta.mensaje}`);
    
    if (respuesta.recomendaciones.length > 0) {
      console.log('   Recomendaciones:');
      respuesta.recomendaciones.forEach(rec => {
        console.log(`     - ${rec}`);
      });
    }
    
    if (respuesta.productosSugeridos.length > 0) {
      console.log('   Productos sugeridos:');
      respuesta.productosSugeridos.forEach(prod => {
        console.log(`     - ${prod.nombre}: ${prod.descripcion}`);
      });
    }
    
    return respuesta;
  } else {
    console.log('❌ Error generando respuesta:', data.data.generatePersonalizedResponse.errors);
    return null;
  }
}

// Ejemplo de uso
const respuesta = await generarRespuestaPersonalizada(
  "Quiero una boda para 100 personas con presupuesto de €15,000",
  {
    nombre: "María García",
    historialEventos: [],
    preferencias: ["vintage", "exterior"],
    ubicacion: "Madrid",
    fechaPreferida: "verano 2025"
  }
);
```

---

## 📊 **Análisis Predictivo**

### **Analizar Comportamiento de Clientes**
```javascript
async function analizarComportamientoClientes() {
  const response = await fetch('https://api2.eventosorganizador.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${miToken}`,
      'Origin': 'https://tu-dominio.com'
    },
    body: JSON.stringify({
      query: `
        query AnalyzeCustomerBehavior {
          analyzeCustomerBehavior {
            success
            analisis {
              tendencias {
                tipoEventoPopular
                presupuestoPromedio
                estacionPreferida
                ubicacionPopular
              }
              predicciones {
                proximosEventos
                probabilidadConversion
                recomendacionesMarketing
              }
              insights {
                categoria
                descripcion
                impacto
                accionRecomendada
              }
              segmentacion {
                segmento
                caracteristicas
                tamaño
                valorPromedio
              }
            }
            metadata {
              periodoAnalizado
              totalClientes
              confianzaPrediccion
            }
            errors
          }
        }
      `
    })
  });

  const data = await response.json();
  
  if (data.data.analyzeCustomerBehavior.success) {
    const analisis = data.data.analyzeCustomerBehavior.analisis;
    console.log('📊 Análisis de comportamiento de clientes:');
    
    console.log('   📈 Tendencias:');
    console.log(`     Tipo de evento popular: ${analisis.tendencias.tipoEventoPopular}`);
    console.log(`     Presupuesto promedio: €${analisis.tendencias.presupuestoPromedio}`);
    console.log(`     Estación preferida: ${analisis.tendencias.estacionPreferida}`);
    
    console.log('   🔮 Predicciones:');
    console.log(`     Próximos eventos esperados: ${analisis.predicciones.proximosEventos}`);
    console.log(`     Probabilidad de conversión: ${analisis.predicciones.probabilidadConversion}%`);
    
    console.log('   💡 Insights:');
    analisis.insights.forEach(insight => {
      console.log(`     ${insight.categoria}: ${insight.descripcion}`);
      console.log(`       Impacto: ${insight.impacto}`);
      console.log(`       Acción: ${insight.accionRecomendada}`);
    });
    
    return analisis;
  } else {
    console.log('❌ Error analizando comportamiento:', data.data.analyzeCustomerBehavior.errors);
    return null;
  }
}
```

### **Predecir Éxito de Campañas**
```javascript
async function predecirExitoCampaña(datosCampaña) {
  const response = await fetch('https://api2.eventosorganizador.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${miToken}`,
      'Origin': 'https://tu-dominio.com'
    },
    body: JSON.stringify({
      query: `
        mutation PredictCampaignSuccess($input: PredictCampaignSuccessInput!) {
          predictCampaignSuccess(input: $input) {
            success
            prediccion {
              probabilidadExito
              metricasEsperadas {
                tasaApertura
                tasaClicks
                tasaConversion
                mensajesEnviados
              }
              factoresInfluencia {
                factor
                impacto
                recomendacion
              }
              optimizaciones {
                tipo
                descripcion
                impactoEsperado
              }
              riesgo {
                nivel
                factores
                mitigacion
              }
            }
            metadata {
              modelo
              confianza
              datosHistoricos
            }
            errors
          }
        }
      `,
      variables: {
        input: {
          tipo: datosCampaña.tipo,
          segmento: datosCampaña.segmento,
          mensaje: datosCampaña.mensaje,
          canal: datosCampaña.canal,
          fechaEnvio: datosCampaña.fechaEnvio,
          configuracion: {
            modelo: "gpt-4",
            incluirOptimizaciones: true,
            analizarRiesgos: true
          }
        }
      }
    })
  });

  const data = await response.json();
  
  if (data.data.predictCampaignSuccess.success) {
    const prediccion = data.data.predictCampaignSuccess.prediccion;
    console.log('🔮 Predicción de éxito de campaña:');
    console.log(`   Probabilidad de éxito: ${prediccion.probabilidadExito}%`);
    
    console.log('   📊 Métricas esperadas:');
    const metricas = prediccion.metricasEsperadas;
    console.log(`     Tasa de apertura: ${metricas.tasaApertura}%`);
    console.log(`     Tasa de clicks: ${metricas.tasaClicks}%`);
    console.log(`     Tasa de conversión: ${metricas.tasaConversion}%`);
    
    console.log('   🎯 Optimizaciones recomendadas:');
    prediccion.optimizaciones.forEach(opt => {
      console.log(`     ${opt.tipo}: ${opt.descripcion}`);
      console.log(`       Impacto esperado: ${opt.impactoEsperado}%`);
    });
    
    console.log('   ⚠️ Riesgos identificados:');
    console.log(`     Nivel de riesgo: ${prediccion.riesgo.nivel}`);
    console.log(`     Factores: ${prediccion.riesgo.factores.join(', ')}`);
    console.log(`     Mitigación: ${prediccion.riesgo.mitigacion}`);
    
    return prediccion;
  } else {
    console.log('❌ Error prediciendo éxito:', data.data.predictCampaignSuccess.errors);
    return null;
  }
}

// Ejemplo de uso
const prediccion = await predecirExitoCampaña({
  tipo: "promocional",
  segmento: "leads_calificados",
  mensaje: "¡Ofertas especiales para tu boda perfecta!",
  canal: "whatsapp",
  fechaEnvio: "2025-10-20T10:00:00Z"
});
```

---

## 🎯 **Ejemplo Completo: Asistente IA Completo**

```javascript
async function asistenteIACompleto() {
  console.log('🤖 Iniciando asistente IA completo...');
  
  try {
    // 1. Verificar conexiones IA
    console.log('1️⃣ Verificando conexiones IA...');
    const status = await verificarConexionesIA();
    if (!status) throw new Error('No se pudieron verificar las conexiones IA');
    
    // 2. Crear chatbot IA
    console.log('2️⃣ Creando chatbot IA...');
    const chatbotId = await crearChatbotIA();
    if (!chatbotId) throw new Error('No se pudo crear el chatbot IA');
    
    // 3. Generar contenido para evento
    console.log('3️⃣ Generando contenido para evento...');
    const contenido = await generarContenidoEvento("boda", "vintage", {
      novios: "María y Carlos",
      fecha: "25 de Diciembre 2025",
      ubicacion: "Hotel Maravilloso, Madrid",
      colores: "dorado y blanco"
    });
    
    // 4. Analizar comportamiento de clientes
    console.log('4️⃣ Analizando comportamiento de clientes...');
    const analisis = await analizarComportamientoClientes();
    
    // 5. Predecir éxito de campaña
    console.log('5️⃣ Prediciendo éxito de campaña...');
    const prediccion = await predecirExitoCampaña({
      tipo: "promocional",
      segmento: "leads_calificados",
      mensaje: "¡Ofertas especiales para tu boda perfecta!",
      canal: "whatsapp",
      fechaEnvio: "2025-10-20T10:00:00Z"
    });
    
    // 6. Simular conversaciones con IA
    console.log('6️⃣ Simulando conversaciones con IA...');
    const consultas = [
      "Hola, quiero información sobre bodas",
      "Tengo un presupuesto de €15,000 para 100 invitados",
      "¿Qué servicios incluyen?",
      "¿Pueden ayudarme con la decoración?"
    ];
    
    for (const consulta of consultas) {
      console.log(`   Procesando: "${consulta}"`);
      const respuesta = await procesarMensajeIA("+34600123456", consulta, chatbotId);
      if (respuesta) {
        console.log(`   Respuesta IA: ${respuesta.respuesta.mensaje.substring(0, 100)}...`);
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('🎉 ¡Asistente IA completo funcionando!');
    console.log(`   Chatbot IA ID: ${chatbotId}`);
    console.log(`   Contenido generado: ${contenido ? '✅' : '❌'}`);
    console.log(`   Análisis completado: ${analisis ? '✅' : '❌'}`);
    console.log(`   Predicción generada: ${prediccion ? '✅' : '❌'}`);
    
    return {
      chatbot: chatbotId,
      contenido: contenido,
      analisis: analisis,
      prediccion: prediccion
    };
    
  } catch (error) {
    console.error('❌ Error en asistente IA:', error.message);
    return null;
  }
}

// Ejecutar asistente completo
const resultado = await asistenteIACompleto();
```

---

## 🎯 **Próximos Pasos**

### **¿Ya dominas la integración con IA?**
👉 **[Ir a API Avanzada](./advanced-api.md)**

### **¿Quieres personalización extrema?**
👉 **[Ir a Personalización](./customization.md)**

### **¿Necesitas ejemplos avanzados?**
👉 **[Ver Código de Ejemplo](./code-examples.md)**

---

## 💡 **Consejos para IA**

1. **Optimiza prompts:** Mensajes claros dan mejores resultados
2. **Controla costos:** Monitorea el uso de tokens
3. **Combina modelos:** Usa diferentes IAs para diferentes tareas
4. **Valida respuestas:** Siempre revisa la calidad del contenido generado
5. **Aprende continuamente:** Mejora los prompts basándote en los resultados

---

**¿Necesitas ayuda con IA?** 📧 soporte@eventosorganizador.com
