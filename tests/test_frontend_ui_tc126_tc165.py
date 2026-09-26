import pytest
from playwright.sync_api import Page, expect

class TestInterviewAndScorecardUI:
    """Test suite MỞ RỘNG cho Phỏng vấn & Chấm điểm"""

    @pytest.mark.e2e
    def test_tc_int_01_schedule_valid(self, page: Page, web_base_url):
        page.goto(f"{web_base_url}/recruiter/applications/123/schedule")
        page.fill("input[name='date']", "2030-01-01")
        page.click("button[type='submit']")
        expect(page.locator(".toast-success")).to_be_visible()

    @pytest.mark.e2e
    def test_tc_int_02_schedule_past_date(self, page: Page, web_base_url):
        page.goto(f"{web_base_url}/recruiter/applications/123/schedule")
        page.fill("input[name='date']", "2020-01-01")
        page.click("button[type='submit']")
        expect(page.locator(".toast-error")).to_contain_text("Thời gian không hợp lệ")

    @pytest.mark.e2e
    def test_tc_int_03_schedule_weekend_warning(self, page: Page, web_base_url):
        page.goto(f"{web_base_url}/recruiter/applications/123/schedule")
        page.fill("input[name='date']", "2026-09-27") # Sunday
        expect(page.locator(".warning-msg")).to_contain_text("Ngày cuối tuần")

    @pytest.mark.e2e
    def test_tc_int_05_schedule_overlap(self, page: Page, web_base_url):
        """TC-INT-05: Cảnh báo trùng lịch phỏng vấn"""
        page.goto(f"{web_base_url}/recruiter/applications/124/schedule")
        page.fill("input[name='date']", "2030-01-01") # Same as 123
        page.click("button[type='submit']")
        expect(page.locator(".toast-error")).to_contain_text("Bị trùng lịch với buổi phỏng vấn khác")

    @pytest.mark.e2e
    def test_tc_int_07_email_preview(self, page: Page, web_base_url):
        """TC-INT-07: Xem trước email mời phỏng vấn"""
        page.goto(f"{web_base_url}/recruiter/applications/123/schedule")
        page.click("button:has-text('Xem trước Email')")
        expect(page.locator(".email-preview-modal")).to_be_visible()

    @pytest.mark.e2e
    def test_tc_int_10_prevent_empty_scorecard(self, page: Page, web_base_url):
        page.goto(f"{web_base_url}/interviewer/scorecard/123")
        page.fill("input[name='score']", "")
        page.click("button[type='submit']")
        error_msg = page.locator(".field-error")
        expect(error_msg).to_be_visible()

    @pytest.mark.e2e
    def test_tc_int_11_score_exceeds_max(self, page: Page, web_base_url):
        page.goto(f"{web_base_url}/interviewer/scorecard/123")
        page.fill("input[name='score']", "150")
        page.click("button[type='submit']")
        expect(page.locator(".toast-error")).to_contain_text("Điểm tối đa là 100")

    @pytest.mark.e2e
    def test_tc_int_12_score_negative(self, page: Page, web_base_url):
        page.goto(f"{web_base_url}/interviewer/scorecard/123")
        page.fill("input[name='score']", "-10")
        page.click("button[type='submit']")
        expect(page.locator(".toast-error")).to_contain_text("Điểm tối thiểu là 0")

    @pytest.mark.e2e
    def test_tc_int_14_submit_scorecard_readonly(self, page: Page, web_base_url):
        page.goto(f"{web_base_url}/interviewer/scorecard/submitted-123")
        expect(page.locator("input[name='score']")).to_be_disabled()

class TestOfferManagementUI:
    """Test suite MỞ RỘNG cho quy trình Quản lý Offer"""

    @pytest.mark.e2e
    def test_tc_off_01_valid_draft(self, page: Page, web_base_url):
        page.goto(f"{web_base_url}/hm/offers/new")
        page.fill("input[name='salary']", "25000000")
        page.click("button:has-text('Tạo Draft')")
        expect(page.locator(".toast-success")).to_be_visible()

    @pytest.mark.e2e
    def test_tc_off_02_negative_salary(self, page: Page, web_base_url):
        page.goto(f"{web_base_url}/hm/offers/new")
        page.fill("input[name='salary']", "-5000000")
        page.click("button:has-text('Tạo Draft')")
        expect(page.locator(".error-text")).to_contain_text("Lương không được âm")

    @pytest.mark.e2e
    def test_tc_off_03_empty_job_title(self, page: Page, web_base_url):
        page.goto(f"{web_base_url}/hm/offers/new")
        page.fill("input[name='jobTitle']", "")
        page.click("button:has-text('Tạo Draft')")
        expect(page.locator(".error-text")).to_contain_text("Tiêu đề không được bỏ trống")

    @pytest.mark.e2e
    def test_tc_off_06_format_currency_vnd(self, page: Page, web_base_url):
        page.goto(f"{web_base_url}/hm/offers/new")
        page.fill("input[name='salary']", "25000000")
        page.click("body")
        expect(page.locator("input[name='salary']")).to_have_value("25,000,000")

    @pytest.mark.e2e
    def test_tc_off_07_pdf_export_preview(self, page: Page, web_base_url):
        page.goto(f"{web_base_url}/hm/offers/123")
        page.click("button:has-text('Xem bản in PDF')")
        expect(page.locator(".pdf-viewer-modal")).to_be_visible()

    @pytest.mark.e2e
    def test_tc_off_09_prevent_double_click_offer(self, page: Page, web_base_url):
        page.goto(f"{web_base_url}/hm/offers/send/123")
        btn = page.locator("button:has-text('Xác nhận Gửi')")
        btn.click()
        expect(btn).to_be_disabled()

    @pytest.mark.e2e
    def test_tc_off_10_candidate_accept_offer(self, page: Page, web_base_url):
        page.goto(f"{web_base_url}/candidate/offers/123/review")
        page.click("button:has-text('Chấp nhận Offer')")
        expect(page.locator(".success-banner")).to_contain_text("Chúc mừng bạn đã gia nhập")

    @pytest.mark.e2e
    def test_tc_off_12_candidate_reject_offer(self, page: Page, web_base_url):
        page.goto(f"{web_base_url}/candidate/offers/123/review")
        page.click("button:has-text('Từ chối Offer')")
        page.fill("textarea[name='reason']", "Đã nhận việc khác")
        page.click("button:has-text('Gửi lý do')")
        expect(page.locator(".status-badge")).to_contain_text("Đã từ chối")

    @pytest.mark.e2e
    def test_tc_off_14_candidate_view_stepper(self, page: Page, web_base_url):
        page.goto(f"{web_base_url}/candidate/applications/123")
        step_offered = page.locator(".step.active:has-text('OFFER')")
        expect(step_offered).to_be_visible()
