
# BikestoreShop

Đây là một dự án mẫu (BikestoreShop) viết bằng Python — một API backend dành cho quản lý cửa hàng bán xe đạp.

## Tổng quan

Ứng dụng cung cấp API để quản lý sản phẩm, đơn hàng, và người dùng (mô tả chi tiết các endpoint có trong mã nguồn). Dự án dùng cấu trúc thư mục đơn giản: mã nguồn nằm trong thư mục `src/`, và file tạo database cùng dữ liệu mẫu nằm trong `database/`.

Phiên bản hiện tại: nguyên mẫu backend (không bao gồm frontend).

## Công nghệ chính

- Python 3.10+ (hoặc 3.9+)
- FastAPI (đi kèm uvicorn) — giả định từ cách chạy trong workspace
- Cơ sở dữ liệu: có script SQL trong `database/` (tùy DB engine — sqlite/postgres/mysql)

> Ghi chú: Mã nguồn có thể sử dụng cấu hình trong `src/core/config.py` và kết nối DB trong `src/core/database.py`. Mở các file đó để điều chỉnh cấu hình môi trường nếu cần.

## Yêu cầu trước

- Python 3.9 hoặc mới hơn
- Git (tuỳ nếu bạn clone)
- Trình quản lý DB phù hợp nếu bạn không dùng SQLite (Postgres/MySQL)

## Cài đặt (Windows PowerShell)

1. Mở PowerShell và chuyển vào thư mục dự án:

	 ```powershell
	 cd D:\WorkSpace\projects\BikestoreShop
	 ```

2. Tạo và kích hoạt virtual environment:

	 ```powershell
	 python -m venv .venv
	 .\.venv\Scripts\Activate.ps1
	 ```

3. Cài dependencies:

	 ```powershell
	 pip install -r requirements.txt
	 ```

## Thiết lập cơ sở dữ liệu

Có sẵn file SQL tạo schema trong `database/create_database.sql` và hướng dẫn load dữ liệu trong `database/loading_data_to_database`.

- Với SQLite (ví dụ):

	```powershell
	sqlite3 bikestore.db < .\database\create_database.sql
	```

- Với PostgreSQL (ví dụ):

	```powershell
	psql -U <username> -d <dbname> -f .\database\create_database.sql
	```

Sau khi tạo DB, chỉnh lại chuỗi kết nối trong `src/core/config.py` (hoặc bằng biến môi trường nếu dự án hỗ trợ).

## Chạy ứng dụng

Sau khi cài đặt và thiết lập DB, chạy server bằng uvicorn (từ thư mục gốc dự án):

```powershell
# khi virtualenv đang active
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

Ứng dụng sẽ sẵn sàng tại `http://127.0.0.1:8000` và tài liệu tương tác (Swagger UI) tại `http://127.0.0.1:8000/docs` (nếu dùng FastAPI).

## Cấu trúc thư mục

```
README.md
requirements.txt
database/
		create_database.sql
		database_decription.md
		loading_data_to_database
src/
		main.py            # entrypoint
		controllers/       # handlers / business logic
		core/              # cấu hình, kết nối DB
				config.py
				database.py
		models/            # các model dữ liệu
		routers/           # định nghĩa route / endpoint
```

## Các bước kiểm tra nhanh

- Kiểm tra dependencies: `pip check` (sau khi cài)
- Kiểm tra server: mở `http://127.0.0.1:8000/docs` và gọi một endpoint mẫu

## Các giả định và lưu ý

- README này giả định backend dùng FastAPI/uvicorn dựa trên cấu trúc thư mục và file `src/main.py` (có thể mở file để xác nhận). Nếu dự án dùng framework khác, điều chỉnh lệnh chạy tương ứng.
- Nếu dự án sử dụng biến môi trường để cung cấp chuỗi kết nối DB, hãy đặt chúng trước khi khởi chạy (ví dụ: `DB_URL`, `DATABASE_URL`, hoặc biến do `src/core/config.py` yêu cầu).

## Bước tiếp theo (gợi ý cải tiến)

- Thêm file `CONTRIBUTING.md` với các hướng dẫn đóng góp
- Thêm test tự động (pytest) và workflow CI (ví dụ GitHub Actions)
- Cập nhật `requirements.txt` với phiên bản cụ thể và thêm `pyproject.toml` nếu cần

## Người đóng góp

Thông tin người phát triển/nhóm (thêm tên, email hoặc liên kết tới repo nếu cần).

## License

Ghi license dự án ở đây (ví dụ MIT) hoặc xóa phần nếu không cần.

---

Nếu bạn muốn, tôi có thể:

- Tùy biến README này (thêm các endpoint mẫu từ mã nguồn)
- Tạo `CONTRIBUTING.md` và mẫu workflow CI

Chỉ cần cho tôi biết bạn muốn thêm chi tiết nào nữa.
