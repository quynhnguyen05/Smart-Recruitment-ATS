import pytest
import os
import requests

# Fixture for API base URL
@pytest.fixture(scope="session")
def api_base_url():
    return os.getenv("API_BASE_URL", "http://localhost:3001")

# Fixture for Frontend base URL
@pytest.fixture(scope="session")
def web_base_url():
    return os.getenv("WEB_BASE_URL", "http://localhost:3000")

@pytest.fixture(scope="session")
def admin_token(api_base_url):
    """Lấy token của admin để dùng cho các API yêu cầu quyền cao"""
    response = requests.post(f"{api_base_url}/api/auth/login", json={
        "email": "admin@ats.demo",
        "password": "Demo@123"
    })
    if response.status_code == 200:
        return response.json().get("token")
    return None

@pytest.fixture(scope="session")
def recruiter_token(api_base_url):
    """Lấy token của recruiter"""
    response = requests.post(f"{api_base_url}/api/auth/login", json={
        "email": "recruiter@ats.demo",
        "password": "Demo@123"
    })
    if response.status_code == 200:
        return response.json().get("token")
    return None

@pytest.fixture(scope="session")
def candidate_token(api_base_url):
    """Lấy token của candidate"""
    response = requests.post(f"{api_base_url}/api/auth/login", json={
        "email": "candidate@ats.demo",
        "password": "Demo@123"
    })
    if response.status_code == 200:
        return response.json().get("token")
    return None
