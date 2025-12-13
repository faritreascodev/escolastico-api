from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import httpx
import os
from typing import Optional

app = FastAPI(
    title="Escolastico API Gateway",
    version="1.0.0",
    description="API Gateway para sistema de gestión escolar con arquitectura de microservicios"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# URLs de microservicios
SERVICES = {
    "usuarios": os.getenv("USUARIOS_SERVICE_URL", "http://usuarios-service:5001"),
    "cursos": os.getenv("CURSOS_SERVICE_URL", "http://cursos-service:5002"),
    "matriculas": os.getenv("MATRICULAS_SERVICE_URL", "http://matriculas-service:5003"),
    "calificaciones": os.getenv("CALIFICACIONES_SERVICE_URL", "http://calificaciones-service:5004"),
    "asistencia": os.getenv("ASISTENCIA_SERVICE_URL", "http://asistencia-service:5005"),
}

# Cliente HTTP
client = httpx.AsyncClient(timeout=30.0)


@app.get("/")
async def root():
    """Endpoint raíz del API Gateway"""
    return {
        "message": "Escolastico API Gateway - Microservicios",
        "version": "1.0.0",
        "services": {
            "usuarios": f"{SERVICES['usuarios']}/api-docs",
            "cursos": f"{SERVICES['cursos']}/api-docs",
            "matriculas": f"{SERVICES['matriculas']}/api-docs",
            "calificaciones": f"{SERVICES['calificaciones']}/api-docs",
            "asistencia": f"{SERVICES['asistencia']}/api-docs",
        },
        "docs": "/docs"
    }


@app.get("/health")
async def health():
    """Health check del gateway"""
    return {
        "status": "UP",
        "service": "api-gateway",
        "services_status": await check_services_health()
    }


async def check_services_health():
    """Verifica el estado de todos los microservicios"""
    health_status = {}
    for name, url in SERVICES.items():
        try:
            response = await client.get(f"{url}/health", timeout=5.0)
            health_status[name] = "UP" if response.status_code == 200 else "DOWN"
        except:
            health_status[name] = "DOWN"
    return health_status


async def proxy_request(service_url: str, path: str, request: Request):
    """Proxy de peticiones a microservicios"""
    try:
        # Construir URL completa
        url = f"{service_url}{path}"
        
        # Obtener query params
        query_params = dict(request.query_params)
        
        # Preparar headers
        headers = dict(request.headers)
        headers.pop("host", None)
        
        # Realizar petición según método
        if request.method == "GET":
            response = await client.get(url, params=query_params, headers=headers)
        elif request.method == "POST":
            body = await request.json() if request.headers.get("content-type") == "application/json" else None
            response = await client.post(url, json=body, params=query_params, headers=headers)
        elif request.method == "PUT":
            body = await request.json() if request.headers.get("content-type") == "application/json" else None
            response = await client.put(url, json=body, params=query_params, headers=headers)
        elif request.method == "PATCH":
            body = await request.json() if request.headers.get("content-type") == "application/json" else None
            response = await client.patch(url, json=body, params=query_params, headers=headers)
        elif request.method == "DELETE":
            response = await client.delete(url, params=query_params, headers=headers)
        else:
            raise HTTPException(status_code=405, detail="Method not allowed")
        
        return JSONResponse(
            content=response.json(),
            status_code=response.status_code
        )
    
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="Service timeout")
    except httpx.ConnectError:
        raise HTTPException(status_code=503, detail="Service unavailable")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ==================== RUTAS DE USUARIOS ====================
@app.api_route("/api/estudiantes", methods=["GET", "POST"], operation_id="estudiantes_root")
@app.api_route("/api/estudiantes/{path:path}", methods=["GET", "PUT", "PATCH", "DELETE"], operation_id="estudiantes_by_path")
async def estudiantes_proxy(request: Request, path: str = ""):
    """Proxy para estudiantes"""
    route = f"/estudiantes/{path}" if path else "/estudiantes"
    return await proxy_request(SERVICES["usuarios"], route, request)


@app.api_route("/api/profesores", methods=["GET", "POST"], operation_id="profesores_root")
@app.api_route("/api/profesores/{path:path}", methods=["GET", "PUT", "PATCH", "DELETE"], operation_id="profesores_by_path")
async def profesores_proxy(request: Request, path: str = ""):
    """Proxy para profesores"""
    route = f"/profesores/{path}" if path else "/profesores"
    return await proxy_request(SERVICES["usuarios"], route, request)


# ==================== RUTAS DE CURSOS ====================
@app.api_route("/api/cursos", methods=["GET", "POST"], operation_id="cursos_root")
@app.api_route("/api/cursos/{path:path}", methods=["GET", "PUT", "PATCH", "DELETE"], operation_id="cursos_by_path")
async def cursos_proxy(request: Request, path: str = ""):
    """Proxy para cursos"""
    route = f"/cursos/{path}" if path else "/cursos"
    return await proxy_request(SERVICES["cursos"], route, request)


# ==================== RUTAS DE MATRICULAS ====================
@app.api_route("/api/matriculas", methods=["GET", "POST"], operation_id="matriculas_root")
@app.api_route("/api/matriculas/{path:path}", methods=["GET", "PUT", "PATCH", "DELETE"], operation_id="matriculas_by_path")
async def matriculas_proxy(request: Request, path: str = ""):
    """Proxy para matrículas"""
    route = f"/matriculas/{path}" if path else "/matriculas"
    return await proxy_request(SERVICES["matriculas"], route, request)


# ==================== RUTAS DE CALIFICACIONES ====================
@app.api_route("/api/calificaciones", methods=["GET", "POST"], operation_id="calificaciones_root")
@app.api_route("/api/calificaciones/{path:path}", methods=["GET", "PUT", "PATCH", "DELETE"], operation_id="calificaciones_by_path")
async def calificaciones_proxy(request: Request, path: str = ""):
    """Proxy para calificaciones"""
    route = f"/calificaciones/{path}" if path else "/calificaciones"
    return await proxy_request(SERVICES["calificaciones"], route, request)


# ==================== RUTAS DE ASISTENCIA ====================
@app.api_route("/api/asistencias", methods=["GET", "POST"], operation_id="asistencias_root")
@app.api_route("/api/asistencias/{path:path}", methods=["GET", "PUT", "PATCH", "DELETE"], operation_id="asistencias_by_path")
async def asistencias_proxy(request: Request, path: str = ""):
    """Proxy para asistencias"""
    route = f"/asistencias/{path}" if path else "/asistencias"
    return await proxy_request(SERVICES["asistencia"], route, request)


@app.on_event("shutdown")
async def shutdown_event():
    """Cerrar cliente HTTP al apagar"""
    await client.aclose()
