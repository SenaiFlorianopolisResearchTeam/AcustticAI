import os
from functools import lru_cache
from typing import Any, Dict

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from jose import jwt
import httpx
from dotenv import load_dotenv

load_dotenv()
AUTH0_DOMAIN = os.getenv("AUTH0_DOMAIN", "")
AUTH0_AUDIENCE = os.getenv("AUTH0_AUDIENCE", "")
AUTH0_ISSUER = f"https://{AUTH0_DOMAIN}/"
ALGORITHMS = ["RS256"]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

bearer = HTTPBearer(auto_error=False)

@lru_cache(maxsize=1)
def get_jwks() -> Dict[str, Any]:
    url = f"https://{AUTH0_DOMAIN}/.well-known/jwks.json"
    with httpx.Client(timeout=5.0) as client:
        resp = client.get(url)
        resp.raise_for_status()
        return resp.json()

def get_signing_key(kid: str) -> Dict[str, Any]:
    jwks = get_jwks()
    for key in jwks.get("keys", []):
        if key.get("kid") == kid:
            return key
    raise HTTPException(status_code=401, detail="JWKS key not found")

def verify_jwt(token: str) -> Dict[str, Any]:
    try:
        header = jwt.get_unverified_header(token)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token header")

    kid = header.get("kid")
    if not kid:
        raise HTTPException(status_code=401, detail="Missing kid in token header")

    key = get_signing_key(kid)

    try:
        payload = jwt.decode(
            token,
            key,  
            algorithms=ALGORITHMS,
            audience=AUTH0_AUDIENCE,
            issuer=AUTH0_ISSUER,
        )
        return payload
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {e}")

async def require_auth(creds: HTTPAuthorizationCredentials = Depends(bearer)):
    if not creds or creds.scheme.lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing bearer token",
        )
    return verify_jwt(creds.credentials)

@app.get("/api/public")
def public():
    return {"message": "rota pública (sem token)"}

@app.get("/api/private")
def private(user: Dict[str, Any] = Depends(require_auth)):
    return {"ok": True, "sub": user.get("sub"), "email": user.get("email")}
