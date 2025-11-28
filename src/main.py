from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from routers import (
    auth_routers,
    product_routers,
    brand_routers,
    category_routers,
    customer_routers,
    order_routers,
    staff_routers
)

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
        "endpoints": {
            "auth": "/api/auth",
            "products": "/api/products",
            "brands": "/api/brands",
            "categories": "/api/categories",
            "customers": "/api/customers",
            "orders": "/api/orders",
            "staffs": "/api/staffs"
        }
    }

@default_route.get("/health", response_class=JSONResponse)
def health_check():
    return {"status": "healthy", "version": "2.0.0"}

# Include routers
app.include_router(default_route)
app.include_router(auth_routers.router)
app.include_router(product_routers.router)
app.include_router(brand_routers.router)
app.include_router(category_routers.router)
app.include_router(customer_routers.router)
app.include_router(order_routers.router)
app.include_router(staff_routers.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
