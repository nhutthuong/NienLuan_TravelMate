-- CƠ SỞ DỮ LIỆU TRAVELMATE
-- 19 Bảng + 13 Sequences sinh mã tự động

-- KHỞI TẠO CÁC SEQUENCE ĐỂ TỰ ĐỘNG SINH MÃ DẠNG VARCHAR (ND0001, DD0001...)
CREATE SEQUENCE IF NOT EXISTS seq_nguoi_dung START 1;
CREATE SEQUENCE IF NOT EXISTS seq_loai_hinh START 1;
CREATE SEQUENCE IF NOT EXISTS seq_dia_diem START 1;
CREATE SEQUENCE IF NOT EXISTS seq_diem_tq START 1;
CREATE SEQUENCE IF NOT EXISTS seq_media_dtq START 1;
CREATE SEQUENCE IF NOT EXISTS seq_hoat_dong START 1;
CREATE SEQUENCE IF NOT EXISTS seq_khach_san START 1;
CREATE SEQUENCE IF NOT EXISTS seq_media_ks START 1;
CREATE SEQUENCE IF NOT EXISTS seq_tien_nghi START 1;
CREATE SEQUENCE IF NOT EXISTS seq_ls_tim_kiem START 1;
CREATE SEQUENCE IF NOT EXISTS seq_yeu_thich START 1;
CREATE SEQUENCE IF NOT EXISTS seq_danh_gia_ks START 1;
CREATE SEQUENCE IF NOT EXISTS seq_danh_gia_dtq START 1;

-- Bảng 1: NguoiDung
CREATE TABLE NguoiDung (
    MaNguoiDung VARCHAR(12) PRIMARY KEY DEFAULT ('ND' || LPAD(nextval('seq_nguoi_dung')::TEXT, 4, '0')),
    HoTen VARCHAR(100) NOT NULL,
    Email VARCHAR(150) NOT NULL UNIQUE,
    MatKhau_hash VARCHAR(255), -- Nullable nếu đăng nhập bằng Google
    Google_ID VARCHAR(100) UNIQUE, -- Nullable nếu đăng nhập thường
    PhuongThucXacThuc VARCHAR(20) NOT NULL DEFAULT 'local' CHECK (PhuongThucXacThuc IN ('local', 'google')),
    Avatar_url TEXT,
    VaiTro VARCHAR(20) NOT NULL DEFAULT 'Member' CHECK (VaiTro IN ('Member', 'Admin')),
    TrangThai VARCHAR(20) NOT NULL DEFAULT 'Active' CHECK (TrangThai IN ('Active', 'Banned')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Bảng 2: LoaiHinhDuLich (4 nhóm sở thích: Thiên nhiên, Văn hóa, Nghỉ dưỡng, Khám phá)
CREATE TABLE LoaiHinhDuLich (
    MaLoaiHinh VARCHAR(12) PRIMARY KEY DEFAULT ('LH' || LPAD(nextval('seq_loai_hinh')::TEXT, 4, '0')),
    Ten VARCHAR(100) NOT NULL UNIQUE,
    MoTa TEXT
);

-- Bảng 3: SoThichNguoiDung (Bảng trung gian N-N giữa NguoiDung và LoaiHinhDuLich)
CREATE TABLE SoThichNguoiDung (
    MaNguoiDung VARCHAR(12) NOT NULL REFERENCES NguoiDung(MaNguoiDung) ON DELETE CASCADE,
    MaLoaiHinh VARCHAR(12) NOT NULL REFERENCES LoaiHinhDuLich(MaLoaiHinh) ON DELETE CASCADE,
    PRIMARY KEY (MaNguoiDung, MaLoaiHinh)
);

-- Bảng 4: DiaDiem
CREATE TABLE DiaDiem (
    MaDiaDiem VARCHAR(12) PRIMARY KEY DEFAULT ('DD' || LPAD(nextval('seq_dia_diem')::TEXT, 4, '0')),
    Ten VARCHAR(150) NOT NULL,
    TinhThanh VARCHAR(100) NOT NULL,
    DanhHieu VARCHAR(150), -- VD: "Di sản kép", "Kỳ quan thiên nhiên", "Di sản thế giới"...
    MoTa TEXT,
    ViDo DECIMAL(10, 7),
    KinhDo DECIMAL(10, 7),
    QuyMo VARCHAR(150), -- VD: "1.553 km² • 1.969 đảo"
    ThoiDiemLyTuong VARCHAR(150), -- VD: "Tháng 10 – Tháng 4"
    anh_url TEXT NOT NULL
);

-- Bảng 5: DiaDiem_LoaiHinh (Bảng trung gian N-N giữa DiaDiem và LoaiHinhDuLich)
CREATE TABLE DiaDiem_LoaiHinh (
    MaDiaDiem VARCHAR(12) NOT NULL REFERENCES DiaDiem(MaDiaDiem) ON DELETE CASCADE,
    MaLoaiHinh VARCHAR(12) NOT NULL REFERENCES LoaiHinhDuLich(MaLoaiHinh) ON DELETE CASCADE,
    PRIMARY KEY (MaDiaDiem, MaLoaiHinh)
);

-- Bảng 6: DiemThamQuan
CREATE TABLE DiemThamQuan (
    MaDiemTQ VARCHAR(12) PRIMARY KEY DEFAULT ('TQ' || LPAD(nextval('seq_diem_tq')::TEXT, 4, '0')),
    MaDiaDiem VARCHAR(12) NOT NULL REFERENCES DiaDiem(MaDiaDiem) ON DELETE CASCADE,
    Ten VARCHAR(200) NOT NULL,
    MoTa TEXT,
    ViDo DECIMAL(10, 7),
    KinhDo DECIMAL(10, 7),
    DiaChi TEXT,
    GiaVe VARCHAR(100), -- VD: "Miễn phí", "100.000đ / người"
    GioMoCua VARCHAR(100), -- VD: "08:00 - 17:00"
    DiemNoiBat VARCHAR(255)
);

-- Bảng 7: MediaDiemThamQuan (Ảnh đầu tiên theo ThuTu nhỏ nhất dùng làm ảnh đại diện)
CREATE TABLE MediaDiemThamQuan (
    MaMediaDTQ VARCHAR(12) PRIMARY KEY DEFAULT ('MTQ' || LPAD(nextval('seq_media_dtq')::TEXT, 4, '0')),
    MaDiemTQ VARCHAR(12) NOT NULL REFERENCES DiemThamQuan(MaDiemTQ) ON DELETE CASCADE,
    ThuTu INT NOT NULL DEFAULT 1,
    Media_url TEXT NOT NULL,
    media_type VARCHAR(20) NOT NULL DEFAULT 'image' CHECK (media_type IN ('image', 'video'))
);

-- Bảng 8: DiemThamQuan_LoaiHinh (Bảng trung gian N-N)
CREATE TABLE DiemThamQuan_LoaiHinh (
    MaDiemTQ VARCHAR(12) NOT NULL REFERENCES DiemThamQuan(MaDiemTQ) ON DELETE CASCADE,
    MaLoaiHinh VARCHAR(12) NOT NULL REFERENCES LoaiHinhDuLich(MaLoaiHinh) ON DELETE CASCADE,
    PRIMARY KEY (MaDiemTQ, MaLoaiHinh)
);

-- Bảng 9: HoatDong (Danh mục hoạt động điểm tham quan)
CREATE TABLE HoatDong (
    MaHoatDong VARCHAR(12) PRIMARY KEY DEFAULT ('HD' || LPAD(nextval('seq_hoat_dong')::TEXT, 4, '0')),
    Ten VARCHAR(150) NOT NULL UNIQUE,
    Icon VARCHAR(50) DEFAULT 'sparkles'
);

-- Bảng 10: DiemThamQuan_HoatDong (Bảng trung gian N-N)
CREATE TABLE DiemThamQuan_HoatDong (
    MaDiemTQ VARCHAR(12) NOT NULL REFERENCES DiemThamQuan(MaDiemTQ) ON DELETE CASCADE,
    MaHoatDong VARCHAR(12) NOT NULL REFERENCES HoatDong(MaHoatDong) ON DELETE RESTRICT,
    ThuTu SMALLINT NOT NULL DEFAULT 1,
    GhiChu TEXT, -- Nullable
    PRIMARY KEY (MaDiemTQ, MaHoatDong)
);

-- Bảng 11: KhachSan
CREATE TABLE KhachSan (
    MaKhachSan VARCHAR(12) PRIMARY KEY DEFAULT ('KS' || LPAD(nextval('seq_khach_san')::TEXT, 4, '0')),
    MaDiaDiem VARCHAR(12) NOT NULL REFERENCES DiaDiem(MaDiaDiem) ON DELETE CASCADE,
    Ten VARCHAR(200) NOT NULL,
    SoSao DECIMAL(2, 1) DEFAULT 5.0 CHECK (SoSao >= 0 AND SoSao <= 5.0),
    MoTa TEXT,
    ViDo DECIMAL(10, 7),
    KinhDo DECIMAL(10, 7),
    DiaChi TEXT,
    GiaThamKhao BIGINT NOT NULL DEFAULT 0, -- Lưu dạng số nguyên (VNĐ) để lọc theo khoảng giá
    DiemNoiBat VARCHAR(255), -- VD: "Khoáng nóng tự nhiên giàu Brom"
    DonViTinh VARCHAR(50) DEFAULT '/đêm', -- VD: "/đêm", "/cabin đôi"
    booking_url TEXT NOT NULL -- Link Affiliate Agoda / Booking.com
);

-- Bảng 12: MediaKhachSan (Ảnh đầu tiên theo ThuTu nhỏ nhất dùng làm ảnh đại diện)
CREATE TABLE MediaKhachSan (
    MaMediaKS VARCHAR(12) PRIMARY KEY DEFAULT ('MKS' || LPAD(nextval('seq_media_ks')::TEXT, 4, '0')),
    MaKhachSan VARCHAR(12) NOT NULL REFERENCES KhachSan(MaKhachSan) ON DELETE CASCADE,
    ThuTu INT NOT NULL DEFAULT 1,
    Media_url TEXT NOT NULL,
    Media_type VARCHAR(20) NOT NULL DEFAULT 'image' CHECK (Media_type IN ('image', 'video'))
);

-- Bảng 13: KhachSan_LoaiHinh (Bảng trung gian N-N)
CREATE TABLE KhachSan_LoaiHinh (
    MaKhachSan VARCHAR(12) NOT NULL REFERENCES KhachSan(MaKhachSan) ON DELETE CASCADE,
    MaLoaiHinh VARCHAR(12) NOT NULL REFERENCES LoaiHinhDuLich(MaLoaiHinh) ON DELETE CASCADE,
    PRIMARY KEY (MaKhachSan, MaLoaiHinh)
);

-- Bảng 14: TienNghi (Danh mục tiện nghi nghỉ dưỡng dùng chung)
CREATE TABLE TienNghi (
    MaTienNghi VARCHAR(12) PRIMARY KEY DEFAULT ('TN' || LPAD(nextval('seq_tien_nghi')::TEXT, 4, '0')),
    Ten VARCHAR(150) NOT NULL UNIQUE,
    Icon VARCHAR(50) DEFAULT 'check'
);

-- Bảng 15: KhachSan_TienNghi (Bảng trung gian N-N)
CREATE TABLE KhachSan_TienNghi (
    MaKhachSan VARCHAR(12) NOT NULL REFERENCES KhachSan(MaKhachSan) ON DELETE CASCADE,
    MaTienNghi VARCHAR(12) NOT NULL REFERENCES TienNghi(MaTienNghi) ON DELETE RESTRICT,
    ThuTu SMALLINT NOT NULL DEFAULT 1,
    GhiChu TEXT, -- Nullable (VD: "Hồ bơi vô cực trên boong tàu")
    PRIMARY KEY (MaKhachSan, MaTienNghi)
);

-- Bảng 16: LichSuTimKiem (Lưu lịch sử nhận diện ảnh AI ResNet50)
CREATE TABLE LichSuTimKiem (
    MaLSTimKiem VARCHAR(12) PRIMARY KEY DEFAULT ('LS' || LPAD(nextval('seq_ls_tim_kiem')::TEXT, 4, '0')),
    MaNguoiDung VARCHAR(12) NOT NULL REFERENCES NguoiDung(MaNguoiDung) ON DELETE CASCADE,
    MaDiaDiem VARCHAR(12) NOT NULL REFERENCES DiaDiem(MaDiaDiem) ON DELETE CASCADE,
    Anh_TaiLen_url TEXT NOT NULL,
    DoTinCay DECIMAL(5, 2) NOT NULL, -- VD: 99.40 (%)
    KetQuaTopK JSONB, -- Lưu mảng JSON Top-3 dự đoán
    GhiChu TEXT,
    searched_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Bảng 17: YeuThich (Wishlist: Lưu Địa điểm, Điểm tham quan hoặc Khách sạn)
CREATE TABLE YeuThich (
    MaYeuThich VARCHAR(12) PRIMARY KEY DEFAULT ('YT' || LPAD(nextval('seq_yeu_thich')::TEXT, 4, '0')),
    MaNguoiDung VARCHAR(12) NOT NULL REFERENCES NguoiDung(MaNguoiDung) ON DELETE CASCADE,
    MaDiaDiem VARCHAR(12) REFERENCES DiaDiem(MaDiaDiem) ON DELETE CASCADE,
    MaDiemTQ VARCHAR(12) REFERENCES DiemThamQuan(MaDiemTQ) ON DELETE CASCADE,
    MaKhachSan VARCHAR(12) REFERENCES KhachSan(MaKhachSan) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    -- Đảm bảo mỗi dòng yêu thích chỉ trỏ tới đúng 1 trong 3 loại (Địa điểm, Điểm TQ hoặc Khách sạn)
    CONSTRAINT chk_yeu_thich_mot_loai CHECK (
        (CASE WHEN MaDiaDiem IS NOT NULL THEN 1 ELSE 0 END +
         CASE WHEN MaDiemTQ IS NOT NULL THEN 1 ELSE 0 END +
         CASE WHEN MaKhachSan IS NOT NULL THEN 1 ELSE 0 END) = 1
    ),
    -- Chống lưu trùng lặp cùng 1 mục của cùng 1 người dùng
    CONSTRAINT uq_yeu_thich_diadiem UNIQUE (MaNguoiDung, MaDiaDiem),
    CONSTRAINT uq_yeu_thich_diemtq UNIQUE (MaNguoiDung, MaDiemTQ),
    CONSTRAINT uq_yeu_thich_khachsan UNIQUE (MaNguoiDung, MaKhachSan)
);

-- Bảng 18: DanhGiaKhachSan
CREATE TABLE DanhGiaKhachSan (
    MaDanhGiaKS VARCHAR(12) PRIMARY KEY DEFAULT ('DGKS' || LPAD(nextval('seq_danh_gia_ks')::TEXT, 4, '0')),
    MaNguoiDung VARCHAR(12) NOT NULL REFERENCES NguoiDung(MaNguoiDung) ON DELETE CASCADE,
    MaKhachSan VARCHAR(12) NOT NULL REFERENCES KhachSan(MaKhachSan) ON DELETE CASCADE,
    DanhGia DECIMAL(2, 1) NOT NULL CHECK (DanhGia >= 1.0 AND DanhGia <= 5.0),
    BinhLuan TEXT,
    TrangThai VARCHAR(20) NOT NULL DEFAULT 'Approved' CHECK (TrangThai IN ('Approved', 'Flagged')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Bảng 19: DanhGiaDiemTQ
CREATE TABLE DanhGiaDiemTQ (
    MaDanhGiaDTQ VARCHAR(12) PRIMARY KEY DEFAULT ('DGTQ' || LPAD(nextval('seq_danh_gia_dtq')::TEXT, 4, '0')),
    MaNguoiDung VARCHAR(12) NOT NULL REFERENCES NguoiDung(MaNguoiDung) ON DELETE CASCADE,
    MaDiemTQ VARCHAR(12) NOT NULL REFERENCES DiemThamQuan(MaDiemTQ) ON DELETE CASCADE,
    DanhGia DECIMAL(2, 1) NOT NULL CHECK (DanhGia >= 1.0 AND DanhGia <= 5.0),
    BinhLuan TEXT,
    TrangThai VARCHAR(20) NOT NULL DEFAULT 'Approved' CHECK (TrangThai IN ('Approved', 'Flagged')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- TẠO INDEX TỐI ƯU TRUY VẤN CHO KHÓA NGOẠI & LẤY ẢNH ĐẠI DIỆN ĐẦU TIÊN
CREATE INDEX idx_media_dtq_lookup ON MediaDiemThamQuan(MaDiemTQ, media_type, ThuTu);
CREATE INDEX idx_media_ks_lookup ON MediaKhachSan(MaKhachSan, Media_type, ThuTu);
CREATE INDEX idx_diemtq_diadiem ON DiemThamQuan(MaDiaDiem);
CREATE INDEX idx_khachsan_diadiem ON KhachSan(MaDiaDiem);
CREATE INDEX idx_lichsu_nguoidung ON LichSuTimKiem(MaNguoiDung, searched_at DESC);
CREATE INDEX idx_yeuthich_nguoidung ON YeuThich(MaNguoiDung, created_at DESC);
