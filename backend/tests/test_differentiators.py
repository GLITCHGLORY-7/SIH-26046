from fastapi.testclient import TestClient
from app.database.init_db import DEMO_PASSWORD

def test_electronic_signature_success(client: TestClient, admin_token: str):
    headers = {"Authorization": f"Bearer {admin_token}"}
    payload = {
        "password": DEMO_PASSWORD,
        "action_type": "ETHICS_APPROVAL",
        "meaning": "I hereby certify approval under 21 CFR Part 11.",
        "entity_id": "SUB-001"
    }
    response = client.post("/api/v1/auth/verify-signature", json=payload, headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["verified"] is True
    assert "SIG-SHA256-" in data["signature_hash"]
    assert data["signer_username"] == "admin"


def test_electronic_signature_invalid_password(client: TestClient, admin_token: str):
    headers = {"Authorization": f"Bearer {admin_token}"}
    payload = {
        "password": "WrongPassword123!",
        "action_type": "ETHICS_APPROVAL"
    }
    response = client.post("/api/v1/auth/verify-signature", json=payload, headers=headers)
    assert response.status_code == 401


def test_document_upload_and_retrieve(client: TestClient, admin_token: str):
    headers = {"Authorization": f"Bearer {admin_token}"}
    file_content = b"Sample Clinical Trial Protocol Text"
    files = {"file": ("protocol.txt", file_content, "text/plain")}
    data = {"category": "PROTOCOL_DOSSIER"}

    up_res = client.post("/api/v1/documents/upload", headers=headers, files=files, data=data)
    assert up_res.status_code == 200
    up_data = up_res.json()
    assert up_data["success"] is True
    assert "url" in up_data

    # Retrieve document
    doc_res = client.get(up_data["url"])
    assert doc_res.status_code == 200
    assert doc_res.content == file_content