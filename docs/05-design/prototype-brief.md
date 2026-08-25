rototype goal: kiểm chứng 4 flow có rủi ro cao.
Persona: Mai - Busy Shopper.

FLOW A - Voice search
"Tìm cà phê rang vừa dưới 200 nghìn"
→ listening → transcript → processing → product results.

FLOW B - Clarification
"Thêm sữa vào giỏ"
→ có 3 sản phẩm phù hợp → assistant hỏi chọn loại nào.

FLOW C - Add to cart
"Thêm 2 hộp sữa hạt Oat 1L"
→ product resolved → stock check → cart updated → đọc lại item + quantity.

FLOW D - Checkout confirmation
"Đặt đơn này"
→ Order Draft → hiển thị items + total → nút/câu xác nhận → success.

Required states:
idle, listening, processing, no-match, ambiguous, network-error,
out-of-stock, cart-updated, order-draft, confirm, success.

Prototype assumptions phải hiển thị riêng, không được trộn vào requirement.
