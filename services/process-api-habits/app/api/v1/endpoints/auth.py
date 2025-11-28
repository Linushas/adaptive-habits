from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select, Session
from app.models import User
from app.db import get_session
from app.auth import create_access_token, verify_password, get_password_hash
from fastapi.security import OAuth2PasswordRequestForm

router = APIRouter()

@router.post("/token")
def login(form_data: OAuth2PasswordRequestForm = Depends(), session: Session = Depends(get_session)):
    statement = select(User).where(User.username == form_data.username)
    user = session.exec(statement).first()
    
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/register")
def register(username: str, password: str, session: Session = Depends(get_session)):
    statement = select(User).where(User.username == username)
    if session.exec(statement).first():
        raise HTTPException(status_code=400, detail="Username already registered")

    hashed_pwd = get_password_hash(password)
    user = User(username=username, hashed_password=hashed_pwd)
    session.add(user)
    session.commit()
    return {"msg": "User created"}
