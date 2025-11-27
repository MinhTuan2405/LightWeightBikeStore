from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from routers import auth_routers

app = FastAPI(
    title="LightWeight Bike Store API",
    description="Backend API with JWT Authentication & Authorization",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Default router
default_route = APIRouter(tags=['DEFAULT'])

@default_route.get("/", response_class=JSONResponse)
def read_root():
    return {
        "message": "LightWeight Bike Store API v2.0",
        "docs": "/docs",
        "authentication": {
            "register": "POST /api/auth/register",
            "login": "POST /api/auth/login",
            "me": "GET /api/auth/me"
        }
    }

@default_route.get("/health", response_class=JSONResponse)
def health_check():
    return {"status": "healthy", "version": "2.0.0"}

# Include routers
app.include_router(default_route)
app.include_router(auth_routers.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
