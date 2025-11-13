from sys import prefix
from fastapi import FastAPI, APIRouter
from fastapi.background import P
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.routing import APIRoute



app = FastAPI(
    title="Bike Store Management",
    version="0.1.0",
    description="API backend for Bike Store",
)

origins = ["*"]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

default_route = APIRouter (
    tags=['DEAFAULT']
)


@default_route.get("/", response_class=JSONResponse)
def read_root():
    return {"message": "BikestoreShop API", "status": "ok"}


@default_route.get("/health", response_class=JSONResponse)
def health_check():
    return {"status": "ok"}


app.include_router (default_route)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("src.main:app", host="0.0.0.0", port=8000, reload=True)
