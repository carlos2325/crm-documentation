#!/usr/bin/env python3
"""
🧪 Script de Testing para MCP API
Verifica que el servidor MCP funciona correctamente
"""

import httpx
import json
import sys
from typing import Dict, Any, List

# Configuración
MCP_URL = "https://api2.eventosorganizador.com/mcp"
# MCP_URL = "http://localhost:4001/mcp"  # Para testing local

# Token de autenticación (reemplazar con token real)
AUTH_TOKEN = "YOUR_JWT_TOKEN_HERE"
DEVELOPMENT = "bodasdehoy"

# Headers
HEADERS = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {AUTH_TOKEN}",
    "X-Development": DEVELOPMENT
}

def test_tools_list() -> bool:
    """Test 1: Verificar que tools/list funciona"""
    print("\n" + "="*60)
    print("🧪 TEST 1: tools/list")
    print("="*60)
    
    try:
        response = httpx.post(
            MCP_URL,
            json={
                "jsonrpc": "2.0",
                "method": "tools/list",
                "id": 1
            },
            headers=HEADERS,
            timeout=30.0
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code != 200:
            print(f"❌ FALLO: Status code {response.status_code}")
            print(f"Response: {response.text}")
            return False
        
        data = response.json()
        
        if "result" not in data or "tools" not in data["result"]:
            print("❌ FALLO: Respuesta no tiene estructura esperada")
            print(f"Response: {json.dumps(data, indent=2)}")
            return False
        
        tools = data["result"]["tools"]
        print(f"✅ ÉXITO: {len(tools)} herramientas disponibles")
        
        # Mostrar primeras 5 herramientas
        print("\n📋 Primeras 5 herramientas:")
        for i, tool in enumerate(tools[:5], 1):
            print(f"  {i}. {tool['name']} - {tool.get('description', 'Sin descripción')}")
        
        if len(tools) > 5:
            print(f"  ... y {len(tools) - 5} más")
        
        return True
        
    except httpx.HTTPError as e:
        print(f"❌ ERROR HTTP: {e}")
        return False
    except Exception as e:
        print(f"❌ ERROR: {e}")
        return False

def test_tool_call(tool_name: str, arguments: Dict[str, Any]) -> bool:
    """Test 2: Verificar que tools/call funciona"""
    print("\n" + "="*60)
    print(f"🧪 TEST 2: tools/call - {tool_name}")
    print("="*60)
    
    try:
        response = httpx.post(
            MCP_URL,
            json={
                "jsonrpc": "2.0",
                "method": "tools/call",
                "id": 2,
                "params": {
                    "name": tool_name,
                    "arguments": arguments
                }
            },
            headers=HEADERS,
            timeout=30.0
        )
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code != 200:
            print(f"❌ FALLO: Status code {response.status_code}")
            print(f"Response: {response.text}")
            return False
        
        data = response.json()
        
        if "result" not in data:
            print("❌ FALLO: Respuesta no tiene 'result'")
            print(f"Response: {json.dumps(data, indent=2)}")
            return False
        
        print(f"✅ ÉXITO: Herramienta ejecutada correctamente")
        print(f"\n📊 Resultado (primeros 500 caracteres):")
        result_str = json.dumps(data["result"], indent=2)
        print(result_str[:500])
        if len(result_str) > 500:
            print("...")
        
        return True
        
    except httpx.HTTPError as e:
        print(f"❌ ERROR HTTP: {e}")
        return False
    except Exception as e:
        print(f"❌ ERROR: {e}")
        return False

def test_ssl_connection() -> bool:
    """Test 3: Verificar que SSL funciona"""
    print("\n" + "="*60)
    print("🧪 TEST 3: SSL Connection")
    print("="*60)
    
    try:
        # Intentar sin verify primero (para diagnosticar)
        response = httpx.post(
            MCP_URL,
            json={
                "jsonrpc": "2.0",
                "method": "tools/list",
                "id": 1
            },
            headers=HEADERS,
            timeout=30.0,
            verify=True  # Verificar certificado SSL
        )
        
        print(f"✅ SSL funciona correctamente")
        print(f"Status Code: {response.status_code}")
        return True
        
    except httpx.ConnectError as e:
        print(f"❌ ERROR DE CONEXIÓN: {e}")
        print("\n💡 Posibles causas:")
        print("  1. Servidor MCP no está corriendo")
        print("  2. Puerto 4001 no está expuesto en Nginx")
        print("  3. Firewall bloqueando conexión")
        return False
    except httpx.HTTPStatusError as e:
        print(f"❌ ERROR HTTP: {e}")
        return False
    except Exception as e:
        print(f"❌ ERROR SSL: {e}")
        print("\n💡 Posibles causas:")
        print("  1. Certificado SSL inválido")
        print("  2. TLS version incompatible")
        print("  3. Cipher suites incompatibles")
        return False

def test_performance() -> bool:
    """Test 4: Verificar performance"""
    print("\n" + "="*60)
    print("🧪 TEST 4: Performance")
    print("="*60)
    
    import time
    
    try:
        # Test 10 requests
        times = []
        for i in range(10):
            start = time.time()
            response = httpx.post(
                MCP_URL,
                json={
                    "jsonrpc": "2.0",
                    "method": "tools/list",
                    "id": i
                },
                headers=HEADERS,
                timeout=30.0
            )
            elapsed = (time.time() - start) * 1000  # ms
            times.append(elapsed)
            
            if response.status_code != 200:
                print(f"❌ Request {i+1} falló")
                return False
        
        avg_time = sum(times) / len(times)
        min_time = min(times)
        max_time = max(times)
        
        print(f"✅ Performance Test Completado")
        print(f"\n📊 Estadísticas (10 requests):")
        print(f"  Promedio: {avg_time:.2f}ms")
        print(f"  Mínimo: {min_time:.2f}ms")
        print(f"  Máximo: {max_time:.2f}ms")
        
        if avg_time < 100:
            print(f"  🚀 EXCELENTE (<100ms)")
        elif avg_time < 500:
            print(f"  ✅ BUENO (<500ms)")
        else:
            print(f"  ⚠️ MEJORAR (>500ms)")
        
        return True
        
    except Exception as e:
        print(f"❌ ERROR: {e}")
        return False

def main():
    """Ejecutar todos los tests"""
    print("🚀 INICIANDO TESTS DEL SERVIDOR MCP")
    print(f"URL: {MCP_URL}")
    print(f"Development: {DEVELOPMENT}")
    
    results = []
    
    # Test 1: tools/list
    results.append(("tools/list", test_tools_list()))
    
    # Test 2: tools/call (ejemplo simple)
    results.append(("tools/call", test_tool_call(
        "get_user_complete_summary",
        {
            "email": "bodasdehoy.com@gmail.com",
            "development": "bodasdehoy"
        }
    )))
    
    # Test 3: SSL
    results.append(("SSL Connection", test_ssl_connection()))
    
    # Test 4: Performance
    results.append(("Performance", test_performance()))
    
    # Resumen
    print("\n" + "="*60)
    print("📊 RESUMEN DE TESTS")
    print("="*60)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} - {test_name}")
    
    print("\n" + "="*60)
    print(f"Resultado: {passed}/{total} tests pasados")
    
    if passed == total:
        print("🎉 ¡TODOS LOS TESTS PASARON!")
        sys.exit(0)
    else:
        print("⚠️ Algunos tests fallaron")
        sys.exit(1)

if __name__ == "__main__":
    main()

