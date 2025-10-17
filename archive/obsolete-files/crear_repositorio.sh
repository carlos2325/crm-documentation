#!/bin/bash

# 🚀 Script para crear repositorio de documentación CRM en GitHub
# Autor: Carlos (carlos2325)
# Equipo: Marketing Soluciones

echo "🚀 CREANDO REPOSITORIO DE DOCUMENTACIÓN CRM"
echo "=============================================="
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -f "index.html" ] || [ ! -f "README.md" ]; then
    echo "❌ Error: No estás en el directorio correcto de la documentación CRM"
    echo "   Asegúrate de estar en: /tmp/crm-documentation"
    exit 1
fi

echo "✅ Directorio correcto detectado"
echo "📁 Contenido del directorio:"
ls -la
echo ""

# Solicitar token de GitHub
echo "🔑 INGRESA TU TOKEN DE GITHUB:"
echo "   (Para obtenerlo: https://github.com/settings/tokens)"
echo "   Necesitas permisos: repo, workflow"
read -p "Token: " GITHUB_TOKEN

if [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ Error: Token requerido"
    exit 1
fi

# Verificar token
echo "🔍 Verificando token..."
USER_INFO=$(curl -s -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/user)
USER_LOGIN=$(echo "$USER_INFO" | grep -o '"login":"[^"]*"' | cut -d'"' -f4)

if [ -z "$USER_LOGIN" ]; then
    echo "❌ Error: Token inválido o expirado"
    exit 1
fi

echo "✅ Token válido para usuario: $USER_LOGIN"
echo ""

# Crear repositorio
echo "🏗️ CREANDO REPOSITORIO EN GITHUB..."
echo "   Nombre: crm-documentation"
echo "   Descripción: Documentación completa del sistema CRM - Marketing Soluciones"
echo "   Visibilidad: Público (para GitHub Pages)"
echo ""

REPO_RESPONSE=$(curl -s -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/user/repos \
  -d '{
    "name": "crm-documentation",
    "description": "Documentación completa del sistema CRM - Equipo Marketing Soluciones",
    "private": false,
    "auto_init": false,
    "has_wiki": false,
    "has_projects": false,
    "has_issues": true,
    "has_downloads": false
  }')

REPO_NAME=$(echo "$REPO_RESPONSE" | grep -o '"name":"[^"]*"' | cut -d'"' -f4)

if [ "$REPO_NAME" = "crm-documentation" ]; then
    echo "✅ Repositorio creado exitosamente: crm-documentation"
else
    echo "❌ Error al crear repositorio:"
    echo "$REPO_RESPONSE"
    exit 1
fi

# Configurar remote origin
echo ""
echo "🔗 CONFIGURANDO REMOTE ORIGIN..."
git remote add origin "https://github.com/$USER_LOGIN/crm-documentation.git"

if [ $? -eq 0 ]; then
    echo "✅ Remote origin configurado"
else
    echo "❌ Error al configurar remote origin"
    exit 1
fi

# Cambiar nombre de la rama a main
echo ""
echo "🌿 CAMBIANDO RAMA A MAIN..."
git branch -M main

# Subir código
echo ""
echo "📤 SUBIENDO CÓDIGO A GITHUB..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo "✅ Código subido exitosamente"
else
    echo "❌ Error al subir código"
    exit 1
fi

# Configurar GitHub Pages
echo ""
echo "🌐 CONFIGURANDO GITHUB PAGES..."
echo "   Esto puede tomar unos minutos..."

# Esperar un poco para que GitHub procese el repositorio
sleep 10

# Habilitar GitHub Pages
PAGES_RESPONSE=$(curl -s -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/$USER_LOGIN/crm-documentation/pages \
  -d '{
    "source": {
      "branch": "main",
      "path": "/"
    }
  }')

echo "📋 Respuesta de GitHub Pages:"
echo "$PAGES_RESPONSE"
echo ""

# Mostrar información final
echo "🎉 ¡REPOSITORIO CREADO EXITOSAMENTE!"
echo "======================================"
echo ""
echo "📁 Repositorio: https://github.com/$USER_LOGIN/crm-documentation"
echo "🌐 GitHub Pages: https://$USER_LOGIN.github.io/crm-documentation/"
echo "📧 Comparte esta URL con tu equipo: Marketing Soluciones"
echo ""
echo "📋 PRÓXIMOS PASOS:"
echo "1. Ve a: https://github.com/$USER_LOGIN/crm-documentation/settings/pages"
echo "2. Verifica que GitHub Pages esté habilitado"
echo "3. Espera unos minutos para que se despliegue"
echo "4. Comparte la URL con tu equipo"
echo ""
echo "🔧 PARA ACTUALIZAR LA DOCUMENTACIÓN:"
echo "   git add ."
echo "   git commit -m 'Actualización de documentación'"
echo "   git push origin main"
echo ""
echo "🚀 ¡La documentación se actualizará automáticamente!"
echo ""
echo "📞 Soporte: Carlos (carlos2325)"
echo "👥 Equipo: Marketing Soluciones"
echo ""
echo "¡Gracias por usar este script! 🎉"
