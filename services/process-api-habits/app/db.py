from supabase import create_client, Client
from app.config import settings
from fastapi import Header, Depends

supabase: Client = create_client(
    settings.SUPABASE_URL, 
    settings.SUPABASE_SERVICE_KEY
)

def get_supabase(authorization: str = Header(None)) -> Client:
    client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
    if authorization:
        client.auth.set_session(authorization.replace("Bearer ", ""), "")
    return client
