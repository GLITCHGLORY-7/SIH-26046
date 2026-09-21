from datetime import datetime, timezone
import hashlib
from fastapi import APIRouter, Depends, Request, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.auth import (
    LoginRequest, TokenResponse, UserProfileResponse, LogoutResponse,
    SignatureVerificationRequest, SignatureManifestResponse
)
from app.services.auth_service import auth_service
from app.core.dependencies import get_current_user, get_client_ip
from app.core.security import verify_password
from app.models.user import User
from app.services.audit_service import audit_service

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login", response_model=TokenResponse)
def login(
    login_data: LoginRequest,
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Authenticate user credentials (username or email).
    Returns signed JWT access token and basic user details.
    Records LOGIN_SUCCESS or LOGIN_FAILED in the immutable audit log.
    """
    client_ip = get_client_ip(request)
    user, token = auth_service.authenticate_user(
        db=db,
        username_or_email=login_data.username,
        password=login_data.password,
        ip_address=client_ip
    )
    permissions = [p.name for p in user.role.permissions] if user.role else []
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=user,
        permissions=permissions
    )


@router.post("/logout", response_model=LogoutResponse)
def logout(
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Log out currently authenticated user.
    Records LOGOUT event in audit logs.
    """
    client_ip = get_client_ip(request)
    auth_service.record_logout(db=db, user=current_user, ip_address=client_ip)
    return LogoutResponse(message="Successfully logged out.")


@router.get("/me", response_model=UserProfileResponse)
def get_current_user_profile(
    current_user: User = Depends(get_current_user)
):
    """
    Return currently authenticated user profile, assigned role, and permissions.
    """
    role_name = current_user.role.name if current_user.role else "UNKNOWN"
    permissions = [p.name for p in current_user.role.permissions] if current_user.role else []
    return UserProfileResponse(
        user=current_user,
        role_name=role_name,
        permissions=permissions
    )


@router.post("/verify-signature", response_model=SignatureManifestResponse)
def verify_electronic_signature(
    data: SignatureVerificationRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Execute 21 CFR Part 11 compliant digital signature verification.
    Re-authenticates user with password, generates SHA-256 signature manifestation hash,
    and logs immutable audit trail entry.
    """
    if not verify_password(data.password, current_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Password verification failed. Electronic signature rejected under 21 CFR Part 11 requirements."
        )

    now = datetime.now(timezone.utc)
    ts_str = now.isoformat()
    raw_payload = f"{current_user.id}:{current_user.username}:{ts_str}:{data.action_type}:{data.entity_id or ''}"
    sig_hash = hashlib.sha256(raw_payload.encode()).hexdigest()[:24].upper()

    role_name = current_user.role.name if current_user.role else "USER"
    audit_service.record_event(
        db=db,
        action="ELECTRONIC_SIGNATURE_EXECUTED",
        entity_type="21_CFR_PART_11_SIGNATURE",
        entity_id=sig_hash,
        description=f"21 CFR Part 11 Electronic Signature executed by {current_user.full_name} ({role_name}) for {data.action_type}.",
        user_id=current_user.id,
        metadata={
            "action_type": data.action_type,
            "entity_id": data.entity_id,
            "meaning": data.meaning,
            "signature_hash": sig_hash,
            "timestamp": ts_str,
            "signer": current_user.username
        }
    )

    return SignatureManifestResponse(
        verified=True,
        signer_name=current_user.full_name,
        signer_username=current_user.username,
        signer_role=role_name,
        timestamp=ts_str,
        signature_hash=f"SIG-SHA256-{sig_hash}",
        meaning=data.meaning
    )
