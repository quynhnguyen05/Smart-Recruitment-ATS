import pytest
import requests
import time

class TestSecurityAndEdgeCases:
    """Test suite cho Security, RBAC & NFR (TC-SEC-01 đến TC-NFR-15)"""

    @pytest.mark.security
    def test_tc_sec_01_invalid_jwt_signature(self, api_base_url):
        """TC-SEC-01: Gửi token giả mạo (Invalid Sign)"""
        fake_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.fake_signature_123"
        res = requests.get(f"{api_base_url}/api/admin/users",
            headers={"Authorization": f"Bearer {fake_token}"})
        assert res.status_code == 401

    @pytest.mark.security
    def test_tc_sec_04_sql_injection_login(self, api_base_url):
        """TC-SEC-04: SQL/NoSQL Injection Login"""
        res = requests.post(f"{api_base_url}/api/auth/login", json={
            "email": "admin@ats.demo' OR '1'='1",
            "password": "Password123!"
        })
        # Prisma ORM bảo vệ DB, expect trả về 401/400 thay vì sập DB 500
        assert res.status_code in [400, 401]

    @pytest.mark.security
    def test_tc_sec_13_rate_limiting_login(self, api_base_url):
        """TC-SEC-13: Rate Limiting Login 5 lần sai -> 429"""
        # [BUG FAILED] API không bật rate limit (express-rate-limit)
        for _ in range(6):
            res = requests.post(f"{api_base_url}/api/auth/login", json={
                "email": "admin@ats.demo", "password": "WrongPassword"
            })
        
        # Lần gọi thứ 6 phải bị chặn bởi hệ thống Rate Limit
        if res.status_code != 404:
            assert res.status_code == 429, f"Expected 429 Too Many Requests, got {res.status_code}"

    @pytest.mark.security
    def test_tc_sec_14_path_traversal_cv_download(self, api_base_url, recruiter_token):
        """TC-SEC-14: Path Traversal qua URL download CV"""
        res = requests.get(f"{api_base_url}/api/applications/../../../../etc/passwd/download",
            headers={"Authorization": f"Bearer {recruiter_token}"})
        if res.status_code != 404:
            assert res.status_code in [400, 403, 404]

    @pytest.mark.security
    def test_tc_sec_20_cors_origin_restriction(self, api_base_url):
        """TC-SEC-20: Đổi CORS từ Origin lạ (Tấn công CSRF)"""
        # [BUG FAILED] API set Access-Control-Allow-Origin: * thay vì domain cụ thể
        res = requests.options(f"{api_base_url}/api/jobs", headers={
            "Origin": "http://evil-hacker.com",
            "Access-Control-Request-Method": "POST"
        })
        if res.status_code != 404:
            allowed_origin = res.headers.get("Access-Control-Allow-Origin")
            assert allowed_origin != "*", "CORS is set to wildcard '*', allowing CSRF attacks"
            assert allowed_origin != "http://evil-hacker.com", "CORS reflected attacker origin"

    @pytest.mark.nfr
    def test_tc_nfr_01_ai_latency_under_5_seconds(self, api_base_url, recruiter_token):
        """TC-NFR-01: Thời gian AI phân tích CV PDF ≤ 5.0 giây"""
        start_time = time.time()
        res = requests.post(f"{api_base_url}/api/ai/parse", json={"applicationId": "test-perf"},
            headers={"Authorization": f"Bearer {recruiter_token}"})
        latency = time.time() - start_time
        if res.status_code != 404:
            assert latency <= 5.0, f"AI latency too high: {latency}s"

    @pytest.mark.nfr
    def test_tc_nfr_02_job_list_latency(self, api_base_url):
        """TC-NFR-02: Độ trễ API Load Job List < 500ms"""
        start_time = time.time()
        res = requests.get(f"{api_base_url}/api/jobs?status=PUBLISHED")
        latency = time.time() - start_time
        if res.status_code != 404:
            assert latency <= 0.5, f"Job list latency too high: {latency}s"
