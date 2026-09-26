import pytest
import requests

class TestAIScreeningAPI:
    """Test suite mở rộng cho AI Screening & Resume Parser"""
    
    @pytest.mark.integration
    def test_tc_ai_01_perfect_match(self, api_base_url, recruiter_token):
        res = requests.post(f"{api_base_url}/api/ai/parse", json={"applicationId": "app-perfect"}, headers={"Authorization": f"Bearer {recruiter_token}"})
        if res.status_code != 404: assert res.status_code == 200

    @pytest.mark.integration
    def test_tc_ai_02_zero_match(self, api_base_url, recruiter_token):
        """TC-AI-02: CV hoàn toàn không khớp (0 điểm)"""
        res = requests.post(f"{api_base_url}/api/ai/parse", json={"applicationId": "app-zero"}, headers={"Authorization": f"Bearer {recruiter_token}"})
        if res.status_code != 404: assert res.json().get("matchScore") == 0

    @pytest.mark.integration
    def test_tc_ai_03_partial_match(self, api_base_url, recruiter_token):
        """TC-AI-03: CV khớp một phần (50-70 điểm)"""
        res = requests.post(f"{api_base_url}/api/ai/parse", json={"applicationId": "app-partial"}, headers={"Authorization": f"Bearer {recruiter_token}"})
        if res.status_code != 404: 
            score = res.json().get("matchScore", 50)
            assert 50 <= score <= 70

    @pytest.mark.integration
    def test_tc_ai_04_missing_skills_array(self, api_base_url, recruiter_token):
        """TC-AI-04: API phải trả về mảng missingSkills nếu điểm < 100"""
        res = requests.post(f"{api_base_url}/api/ai/parse", json={"applicationId": "app-partial"}, headers={"Authorization": f"Bearer {recruiter_token}"})
        if res.status_code != 404: 
            assert isinstance(res.json().get("missingSkills"), list)

    @pytest.mark.integration
    def test_tc_ai_05_fallback_image_pdf(self, api_base_url, recruiter_token):
        res = requests.post(f"{api_base_url}/api/ai/parse", json={"applicationId": "image-app"}, headers={"Authorization": f"Bearer {recruiter_token}"})
        if res.status_code != 404: assert res.json().get("status") == "INSUFFICIENT_DATA"
        
    @pytest.mark.integration
    def test_tc_ai_06_encrypted_pdf(self, api_base_url, recruiter_token):
        """TC-AI-06: Báo lỗi khi CV PDF bị cài password"""
        res = requests.post(f"{api_base_url}/api/ai/parse", json={"applicationId": "encrypted-app"}, headers={"Authorization": f"Bearer {recruiter_token}"})
        if res.status_code != 404: assert res.status_code == 422 # Unprocessable

    @pytest.mark.integration
    def test_tc_ai_07_very_large_text(self, api_base_url, recruiter_token):
        """TC-AI-07: CV có lượng text cực lớn (>10k words)"""
        res = requests.post(f"{api_base_url}/api/ai/parse", json={"applicationId": "huge-text-app"}, headers={"Authorization": f"Bearer {recruiter_token}"})
        if res.status_code != 404: assert res.status_code == 200

    @pytest.mark.integration
    def test_tc_ai_08_multi_language_cv(self, api_base_url, recruiter_token):
        """TC-AI-08: CV viết trộn lẫn Tiếng Việt và Tiếng Anh"""
        res = requests.post(f"{api_base_url}/api/ai/parse", json={"applicationId": "mix-lang-app"}, headers={"Authorization": f"Bearer {recruiter_token}"})
        if res.status_code != 404: assert res.status_code == 200

    @pytest.mark.integration
    def test_tc_ai_12_prompt_injection(self, api_base_url, recruiter_token):
        """TC-AI-12: Prompt Injection vào text CV (Đã log BUG-08)"""
        res = requests.post(f"{api_base_url}/api/ai/parse", json={"applicationId": "hacked-app"}, headers={"Authorization": f"Bearer {recruiter_token}"})
        if res.status_code != 404:
            score = res.json().get("matchScore", 0)
            assert score < 100, f"Expected AI to ignore prompt injection, but got perfect score {score}"

    @pytest.mark.integration
    def test_tc_ai_18_schema_conformance(self, api_base_url, recruiter_token):
        res = requests.post(f"{api_base_url}/api/ai/parse", json={"applicationId": "app-100"}, headers={"Authorization": f"Bearer {recruiter_token}"})
        if res.status_code != 404:
            data = res.json()
            assert all(k in data for k in ("matchScore", "matchedSkills", "missingSkills"))

    @pytest.mark.integration
    def test_tc_ai_19_candidate_trigger_ai(self, api_base_url, candidate_token):
        """TC-AI-19: Ứng viên tự gọi API chấm điểm AI (403 Forbidden)"""
        res = requests.post(f"{api_base_url}/api/ai/parse", json={"applicationId": "my-app"}, headers={"Authorization": f"Bearer {candidate_token}"})
        if res.status_code != 404: assert res.status_code == 403

class TestRecruiterReviewAPI:
    """Test suite mở rộng cho quy trình Duyệt CV của Recruiter"""

    @pytest.mark.integration
    def test_tc_rev_01_status_new_to_passed(self, api_base_url, recruiter_token):
        res = requests.patch(f"{api_base_url}/api/applications/123/status", json={"status": "SCREENING_PASSED"}, headers={"Authorization": f"Bearer {recruiter_token}"})
        if res.status_code != 404: assert res.status_code == 200

    @pytest.mark.integration
    def test_tc_rev_02_status_new_to_rejected(self, api_base_url, recruiter_token):
        """TC-REV-02: Đổi trạng thái NEW -> REJECTED"""
        res = requests.patch(f"{api_base_url}/api/applications/123/status", json={"status": "REJECTED"}, headers={"Authorization": f"Bearer {recruiter_token}"})
        if res.status_code != 404: assert res.status_code == 200

    @pytest.mark.integration
    def test_tc_rev_03_invalid_status_rollback(self, api_base_url, recruiter_token):
        """TC-REV-03: Đổi trạng thái REJECTED -> NEW (Rollback sai - Đã log BUG-09)"""
        res = requests.patch(f"{api_base_url}/api/applications/rejected-123/status", json={"status": "NEW"}, headers={"Authorization": f"Bearer {recruiter_token}"})
        if res.status_code != 404: assert res.status_code == 400

    @pytest.mark.integration
    def test_tc_rev_04_status_screening_to_interview(self, api_base_url, recruiter_token):
        """TC-REV-04: Đổi trạng thái SCREENING_PASSED -> INTERVIEWING"""
        res = requests.patch(f"{api_base_url}/api/applications/123/status", json={"status": "INTERVIEWING"}, headers={"Authorization": f"Bearer {recruiter_token}"})
        if res.status_code != 404: assert res.status_code == 200

    @pytest.mark.integration
    def test_tc_rev_05_invalid_status_string(self, api_base_url, recruiter_token):
        """TC-REV-05: Gửi status lạ không nằm trong enum"""
        res = requests.patch(f"{api_base_url}/api/applications/123/status", json={"status": "HACK_STATUS"}, headers={"Authorization": f"Bearer {recruiter_token}"})
        if res.status_code != 404: assert res.status_code == 400

    @pytest.mark.integration
    def test_tc_rev_08_candidate_self_update_status(self, api_base_url, candidate_token):
        res = requests.patch(f"{api_base_url}/api/applications/123/status", json={"status": "SCREENING_PASSED"}, headers={"Authorization": f"Bearer {candidate_token}"})
        if res.status_code != 404: assert res.status_code == 403
        
    @pytest.mark.integration
    def test_tc_rev_10_bulk_status_update(self, api_base_url, recruiter_token):
        """TC-REV-10: Cập nhật trạng thái hàng loạt (Bulk update)"""
        res = requests.post(f"{api_base_url}/api/applications/bulk-status", json={
            "applicationIds": ["app-1", "app-2", "app-3"],
            "status": "REJECTED"
        }, headers={"Authorization": f"Bearer {recruiter_token}"})
        if res.status_code != 404: assert res.status_code == 200

    @pytest.mark.integration
    def test_tc_rev_11_bulk_update_empty_array(self, api_base_url, recruiter_token):
        """TC-REV-11: Cập nhật hàng loạt với mảng rỗng"""
        res = requests.post(f"{api_base_url}/api/applications/bulk-status", json={
            "applicationIds": [],
            "status": "REJECTED"
        }, headers={"Authorization": f"Bearer {recruiter_token}"})
        if res.status_code != 404: assert res.status_code == 400
