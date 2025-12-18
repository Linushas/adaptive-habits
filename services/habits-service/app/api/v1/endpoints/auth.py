from fastapi import APIRouter, Depends, HTTPException, Response, Request
from sqlmodel import select, Session
from app.models import User
from app.db import get_session
from app.auth import (
    create_access_token,
    create_refresh_token,
    verify_password,
    get_password_hash,
    get_current_user,
    validate_token,
    ACCESS_TOKEN_EXPIRE_MINUTES,
    REFRESH_TOKEN_EXPIRE_DAYS,
)
from fastapi.security import OAuth2PasswordRequestForm
from app.config import settings

router = APIRouter()

ACCESS_TOKEN_AGE = settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
REFRESH_TOKEN_AGE = settings.REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60

@router.post("/register")
def register(username: str, password: str, session: Session = Depends(get_session)):
    statement = select(User).where(User.username == username)
    if session.exec(statement).first():
        raise HTTPException(status_code=400, detail="Username already registered")

    user = User(username=username, hashed_password=get_password_hash(password))
    session.add(user)
    session.commit()
    return {"msg": "User created"}


@router.post("/login")
def login(
    response: Response,
    form_data: OAuth2PasswordRequestForm = Depends(),
    session: Session = Depends(get_session),
):
    statement = select(User).where(User.username == form_data.username)
    user: User = session.exec(statement).first()

    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect username or password")


    token_payload = {
        "sub": user.username,
        "id": str(user.id),
    }
    access_token = create_access_token(data=token_payload)
    refresh_token = create_refresh_token(data=token_payload)

    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=(settings.ENV_MODE == "production"),
        samesite="lax",
        max_age=ACCESS_TOKEN_AGE,
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=(settings.ENV_MODE == "production"),
        samesite="lax",
        max_age=REFRESH_TOKEN_AGE,
    )

    return {"msg": "Login successful"}


@router.post("/refresh")
def refresh(
    request: Request, response: Response
):
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise HTTPException(status_code=401, detail="Refresh token missing")

    try:
        user: User = validate_token(refresh_token)
        
        token_payload = {
            "sub": user.username,
            "id": str(user.id)
        }
        access_token = create_access_token(data=token_payload)

        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            secure=(settings.ENV_MODE == "production"),
            samesite="lax",
            max_age=ACCESS_TOKEN_AGE,
        )
        return {"msg": "Token refreshed"}

    except HTTPException:
        raise HTTPException(status_code=401, detail="Invalid refresh token")


@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "username": current_user.username,
    }
