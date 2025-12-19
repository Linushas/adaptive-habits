from typing import Optional
from enum import Enum
from datetime import datetime, timedelta, timezone
from uuid import UUID
from pydantic import BaseModel
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from app.models import User
from app.config import settings


SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.HASH_ALGORITHM


class TokenType(Enum):
    ACCESS = "access"
    REFRESH = "refresh"


class TokenPayload(BaseModel):
    sub: str
    user_id: str
    exp: Optional[datetime] = None
    type: TokenType


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


def create_token(payload: TokenPayload) -> str:
    to_encode = payload.model_dump()
    expire: datetime = None
    if payload.type == TokenType.ACCESS:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
    elif payload.type == TokenType.REFRESH:
        expire = datetime.now(timezone.utc) + timedelta(
            days=settings.REFRESH_TOKEN_EXPIRE_DAYS
        )
    else:
        raise ValueError("Invalid Token Type")
    to_encode.update({"exp": expire, "type": payload.type.value})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def validate_token(token: str, expected_type: TokenType = None) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload_dict = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        token_payload = TokenPayload(**payload_dict)
    except (JWTError, ValueError):
        raise credentials_exception

    if expected_type and token_payload.type != expected_type:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token type. Expected {expected_type.value}",
        )

    if token_payload.sub is None or token_payload.user_id is None:
        raise credentials_exception

    user = User(
        id=UUID(token_payload.user_id), username=token_payload.sub, hashed_password=""
    )

    return user


def get_current_user(
    request: Request,
    token: Optional[str] = Depends(oauth2_scheme),
):
    token_str = request.cookies.get(settings.ACCESS_TOKEN_NAME) or token
    if not token_str:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return validate_token(token_str, expected_type=TokenType.ACCESS)
