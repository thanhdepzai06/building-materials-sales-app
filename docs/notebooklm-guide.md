# HƯỚNG DẪN KHAI THÁC DỮ LIỆU VLXD BẰNG NOTEBOOKLM

> Tài liệu này phục vụ đồ án **VLXD Sales** — mục tiêu: có **số liệu có căn cứ**
> để đưa vào `src/data/pricingConfig.ts`, trả lời được câu hỏi của hội đồng:
> *"Số liệu này ở đâu ra?"*

---

## ⚠️ HIỂU ĐÚNG VỀ NOTEBOOKLM TRƯỚC KHI BẮT ĐẦU

NotebookLM **KHÔNG tìm kiếm web**. Nó chỉ trả lời dựa trên **tài liệu bạn upload**.

| NotebookLM làm được | NotebookLM KHÔNG làm được |
|---|---|
| Đọc PDF/Word/Excel bạn upload | Tự tìm giá gạch trên mạng |
| Trích dẫn nguồn + số trang | Cho số liệu nếu bạn không upload |
| Tổng hợp, so sánh nhiều tài liệu | Truy cập website thương mại |
| Tạo bảng, xuất JSON | Biết giá thị trường hiện tại |

**➡️ Bạn phải tải tài liệu về trước, rồi mới upload.**

---

## BƯỚC 1 — TẢI TÀI LIỆU VỀ

### 🥇 Loại A: Định mức 1776 (Bộ Xây dựng) — QUAN TRỌNG NHẤT

Đây là **văn bản pháp quy** chứa định mức vật tư chính thống. Có nó là trả lời
được mọi câu hỏi về định mức.

**Từ khóa Google:**
```
định mức 1776 filetype:pdf
định mức dự toán xây dựng công trình phần xây dựng 1776
```

**Cần lấy:** Mã hiệu **AK.50000** (công tác ốp lát gạch) — chứa định mức
nhân công và vật liệu trên 1 m².

### 🥈 Loại B: Bảng giá / Catalog của hãng

Vào trực tiếp website hãng, mục **Catalog / Tài liệu / Download**:

| Hãng | Website |
|---|---|
| Viglacera | viglacera.com.vn |
| Đồng Tâm | dongtam.com.vn |
| Prime | prime.com.vn |
| Taicera | taicera.vn |
| Hà Thanh | hathanh.vn |

**Từ khóa:**
```
bảng giá gạch Đồng Tâm 2025 filetype:pdf
catalog gạch Viglacera 2025 filetype:pdf
```

### 🥉 Loại C: Tiêu chuẩn kỹ thuật

```
TCVN 7745 gạch ceramic filetype:pdf
TCVN 7899 gạch granite porcelain filetype:pdf
```

> 💡 **Mẹo:** Đổi tên file trước khi upload cho dễ quản lý:
> `DinhMuc1776_PhanXayDung.pdf`, `Catalog_Viglacera_2025.pdf`

---

## BƯỚC 2 — TẠO NOTEBOOK VÀ UPLOAD

**Nên tạo 2 notebook riêng:**

| Notebook | Chứa | Mục đích |
|---|---|---|
| **NB1: Định mức & Tiêu chuẩn** | Định mức 1776, TCVN | Lấy định mức, phân loại gạch |
| **NB2: Bảng giá & Catalog** | Catalog các hãng | Lấy giá, kích thước, quy cách hộp |

**Lý do tách:** trộn lẫn dễ nhiễu, NotebookLM lấy nhầm số từ tài liệu này sang tài liệu kia.

---

## BƯỚC 3 — CÁC PROMPT

### 🎯 PROMPT 1 — Trích xuất định mức vật tư *(dùng cho NB1)*

```
Bạn là chuyên gia dự toán xây dựng. Dựa CHÍNH XÁC vào các tài liệu đã tải lên,
hãy trích xuất định mức vật tư và nhân công cho công tác ốp lát gạch.

Xuất kết quả dưới dạng BẢNG có các cột sau:
| Mã hiệu | Loại công tác | Vật liệu | Đơn vị | Định mức cho 1m2 | Nhân công (công/1m2) | Nguồn (tên tài liệu, số trang) |

Yêu cầu bắt buộc:
1. CHỈ lấy số liệu có trong tài liệu. Nếu không tìm thấy, ghi rõ "Không có trong tài liệu".
2. Mỗi dòng PHẢI ghi rõ nguồn: tên tài liệu + số trang/mục.
3. Phân biệt rõ: ốp tường vs lát nền; gạch ceramic vs granite.
4. Nếu tài liệu có nhiều mã hiệu liên quan, liệt kê HẾT.

Sau bảng, trả lời thêm:
- Định mức nào áp dụng cho gạch khổ lớn (60x60 trở lên)?
- Có ghi chú nào về hao hụt vật liệu không?
```

---

### 🎯 PROMPT 2 — Bảng giá theo thông số kỹ thuật *(dùng cho NB2)*

```
Từ các catalog và bảng giá đã tải lên, hãy lập bảng sản phẩm gạch ốp lát.

Cột yêu cầu:
| Tên sản phẩm | Mã SP | Hãng | Kích thước (cm) | Loại gạch | Bề mặt | Độ hút nước | Giá | Đơn vị giá | Số viên/hộp | m2/hộp | Nguồn (tài liệu, trang) |

Yêu cầu:
1. Chuẩn hóa đơn vị giá: nếu tài liệu ghi giá theo hộp, hãy QUY ĐỔI sang giá/m2
   và ghi rõ công thức quy đổi đã dùng.
2. Ghi rõ "Không có trong tài liệu" cho ô nào thiếu dữ liệu — TUYỆT ĐỐI không tự bịa.
3. Sắp xếp theo kích thước tăng dần.
4. Cuối bảng, tóm tắt: khoảng giá thấp nhất - cao nhất cho từng loại gạch
   (ceramic / granite / porcelain).
```

---

### 🎯 PROMPT 3 — Tiêu chuẩn phân loại gạch *(dùng cho NB1)*

```
Từ các tiêu chuẩn TCVN đã tải lên, hãy giải thích cách PHÂN LOẠI gạch ốp lát.

Trả lời các câu hỏi:
1. Phân biệt ceramic / granite / porcelain dựa trên tiêu chí nào?
   (độ hút nước, lực uốn, thành phần xương)
2. Mỗi loại có ngưỡng kỹ thuật cụ thể nào? (số liệu chính xác + nguồn)
3. Tiêu chuẩn quy định gì về kích thước và dung sai?
4. Loại nào phù hợp lát sàn, loại nào phù hợp ốp tường? Vì sao?
5. Có yêu cầu gì khác biệt giữa khu vực trong nhà và ngoài trời?

Mỗi khẳng định PHẢI kèm trích dẫn: tên tiêu chuẩn + số mục/trang.
```

---

### 🎯 PROMPT 4 — Xuất JSON để đổ vào code

```
Dựa trên tất cả tài liệu đã tải lên, hãy tổng hợp thành cấu trúc dữ liệu
cho ứng dụng di động bán vật liệu xây dựng.

Với mỗi sản phẩm/mục, xuất JSON theo format:
{
  "ten": "...",
  "hang": "...",
  "kichThuoc": "60x60",
  "loai": "ceramic|granite|porcelain|mosaic|gia-go",
  "beMat": "bong|mo|nham",
  "doHutNuoc": số hoặc null,
  "giaM2": số hoặc null,
  "vienMoiHop": số hoặc null,
  "xuatXu": "...",
  "nguon": "tên tài liệu, trang X"
}

Yêu cầu:
1. CHỈ xuất dữ liệu có thật trong tài liệu.
2. Trường nào không có dữ liệu → để null, KHÔNG bịa số.
3. Nếu có mâu thuẫn giữa các tài liệu, ghi chú rõ mâu thuẫn đó.
```

---

### 🎯 PROMPT 5 — Kiểm tra chéo số liệu tạm tính

Dùng khi bạn đã có số nhưng muốn xác minh:

```
Tôi có các con số sau, hãy KIỂM TRA CHÉO với tài liệu đã tải lên:

- Keo dán gạch: 4,5 kg/m2
- Mạch vữa (grout): 0,5 kg/m2
- Nhân công lát sàn: 100.000đ/m2
- Nhân công ốp tường: 120.000đ/m2
- Hao hụt lát thẳng: 5%

Với mỗi con số:
1. Tài liệu có xác nhận không? Trích dẫn cụ thể (tài liệu, trang).
2. Nếu lệch, con số trong tài liệu là bao nhiêu?
3. Nếu tài liệu KHÔNG đề cập, ghi rõ "không có căn cứ trong tài liệu".
```

---

### 🎓 PROMPT 6 — Chuẩn bị phản biện đồ án

```
Dựa trên tài liệu đã tải lên, hãy đóng vai giảng viên phản biện đồ án
"Ứng dụng bán vật liệu xây dựng có tính năng mô phỏng vật liệu".

Đặt cho tôi 10 câu hỏi khó về:
1. Căn cứ pháp lý của các con số định mức tôi dùng
2. Tính hợp lý của công thức tính giá tôi xây dựng
3. Sai số của phương pháp ước lượng diện tích từ ảnh
4. Tính thực tiễn so với quy trình bán hàng VLXD thật

Với mỗi câu hỏi, gợi ý luôn câu trả lời dựa trên tài liệu.
```

---

## BƯỚC 4 — MẸO DÙNG HIỆU QUẢ

| Mẹo | Lý do |
|---|---|
| **Tạo 2 notebook riêng** | Tránh nhiễu giữa định mức và bảng giá |
| **Đổi tên file trước khi upload** | `DinhMuc1776_PhanXayDung.pdf` dễ tra hơn `document(3).pdf` |
| **Hỏi từng câu nhỏ** | Đừng gộp 10 ý vào 1 prompt — dễ bỏ sót |
| **Luôn yêu cầu trích dẫn** | Thêm *"mỗi số liệu phải ghi nguồn và số trang"* |
| **Bấm vào số trích dẫn** | NotebookLM dẫn thẳng tới đoạn gốc — tự kiểm chứng |
| **Dùng "Note" lưu kết quả** | Lưu bảng nó tạo, rồi copy ra |

---

## ⚠️ CẢNH BÁO: NOTEBOOKLM CÓ THỂ BỊA SỐ

Nó là AI, vẫn có thể **hallucinate**. Vì vậy mọi prompt trên đều có câu ràng buộc:

> *"CHỈ lấy số liệu có trong tài liệu. Nếu không tìm thấy, ghi rõ 'Không có trong tài liệu'."*

**Bạn PHẢI kiểm chứng:** bấm vào trích dẫn, xem số trang có đúng không.
**Đừng tin ngay.**

---

## BƯỚC 5 — GỬI KẾT QUẢ CHO DEV

Copy kết quả (bảng hoặc JSON) dán vào chat. Dev sẽ đổ vào file:

```
src/data/pricingConfig.ts
```

File này được thiết kế sẵn để **mỗi con số đều có trường `source`**:

```ts
adhesive: {
  value: 4.5,
  unit: 'kg/m2',
  source: 'Dinh muc 1776, ma hieu AK.54120, trang 312',  // ← nguồn thật
}
```

**Nhờ vậy, khi hội đồng hỏi "số này ở đâu ra?", bạn mở file và chỉ ngay được.**

---

## 📋 CHECKLIST TIẾN ĐỘ

- [ ] Tải được **Định mức 1776** (PDF)
- [ ] Tải được **≥3 catalog** hãng gạch
- [ ] Tải được **≥1 TCVN** về gạch ốp lát
- [ ] Upload vào 2 notebook riêng
- [ ] Chạy **Prompt 1** → có bảng định mức
- [ ] Chạy **Prompt 2** → có bảng giá
- [ ] Chạy **Prompt 3** → có tiêu chí phân loại
- [ ] Kiểm chứng trích dẫn (bấm vào từng nguồn)
- [ ] Gửi kết quả cho dev

---

## 🎯 MỤC TIÊU TỐI THIỂU

Không cần tìm quá nhiều. **Đủ dùng** là:

| Nhóm | Số lượng tối thiểu |
|---|---|
| Giá gạch | **8–12 sản phẩm** đa dạng (3–4 hãng, 3–4 kích thước) |
| Định mức | **3 con số** (keo, mạch vữa, hao hụt) |
| Nhân công | **2 con số** (lát sàn, ốp tường) |

Với 15 con số đó, hệ thống sinh được hàng trăm sản phẩm bằng công thức hệ số.
