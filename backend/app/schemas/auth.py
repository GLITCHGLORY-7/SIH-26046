from typing import List, Optional
from pydantic import BaseModel, Field
from app.schemas.user import UserResponse


class LoginRequest(BaseModel):
    username: str = Field(..., description="Username or email address")
    password: str = Field(..., description="Account password")


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
    permissions: List[str] = []


class UserProfileResponse(BaseModel):
    user: UserResponse
    role_name: str
    permissions: List[str] = []


class LogoutResponse(BaseModel):
    message: str = "Successfully logged out"


class SignatureVerificationRequest(BaseModel):
    password: str = Field(..., description="Password confirmation to execute electronic signature")
    action_type: str = Field("GENERAL_SIGNATURE", description="Type of clinical action being signed")
    meaning: str = Field("I hereby electronically sign and certify this clinical record in accordance with 21 CFR Part 11.", description="Signature intent manifestation")
    entity_id: Optional[str] = Field(None, description="Target entity identifier (e.g. Trial ID, Submission ID, AE ID)")


class SignatureManifestResponse(BaseModel):
    verified: bool
    signer_name: str
    signer_username: str
    signer_role: str
    timestamp: str
    signature_hash: str
    meaning: str

