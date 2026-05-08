from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.api import api_router
from app.core.config import settings
from app.db.base import Base
from app.db.session import engine

from pathlib import Path

app = FastAPI(title=settings.PROJECT_NAME, version="1.0.0")

# ==========================================================
# CORS
# ==========================================================
origins = [
    "http://localhost:8000",
    "http://127.0.0.1:8000",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================================
# API
# ==========================================================
app.include_router(api_router, prefix=settings.API_V1_STR)

# ==========================================================
# Startup
# ==========================================================
@app.on_event("startup")
def on_startup():
    try:
        Base.metadata.create_all(bind=engine)
        print("✅ Banco de Dados inicializado com sucesso.")
    except Exception as e:
        print(f"⚠️ Erro ao conectar no DB durante o startup: {e}")

# ==========================================================
# React build path
# ==========================================================

APP_DIR = Path(__file__).resolve().parent
FASTAPI_DIR = APP_DIR.parent
PROJECT_DIR = FASTAPI_DIR.parent

FRONTEND_DIST = PROJECT_DIR / "REACT" / "Frontend" / "dist"

print(f"🔎 Procurando React build em: {FRONTEND_DIST}")

# ==========================================================
# Servir React
# ==========================================================

if FRONTEND_DIST.exists():

    app.mount(
        "/",
        StaticFiles(directory=FRONTEND_DIST, html=True),
        name="react"
    )

    print("✅ React build encontrado e servido pelo FastAPI.")

else:

    print("⚠️ React build não encontrado.")

    @app.get("/", include_in_schema=False)
    async def no_build():
        return Response(
            content="React build não encontrado. Rode: npm run build",
            status_code=404
        )