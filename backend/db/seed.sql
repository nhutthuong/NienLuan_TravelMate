-- DU LIEU MAU TRAVELMATE

-- 1. Loai hinh du lich
INSERT INTO LoaiHinhDuLich (MaLoaiHinh, Ten, MoTa) VALUES
('LH0001', 'Thiên nhiên', 'Cảnh quan núi non hùng vĩ, thung lũng, vịnh biển và hệ sinh thái tự nhiên nguyên sơ.'),
('LH0002', 'Văn hóa', 'Khám phá nếp sống, phong tục tập quán, lễ hội truyền thống và làng nghề đặc sắc.'),
('LH0003', 'Lịch sử', 'Tham quan các di tích lịch sử, bảo tàng, dấu ấn thời gian và cội nguồn dân tộc.'),
('LH0004', 'Nghỉ dưỡng', 'Trải nghiệm không gian lưu trú cao cấp, resort ven biển, spa thư giãn và tái tạo năng lượng.'),
('LH0005', 'Khám phá', 'Hành trình trải nghiệm điều mới mẻ, check-in công trình độc đáo và du thuyền thưởng ngoạn.'),
('LH0006', 'Mạo hiểm', 'Thử thách bản thân với trekking địa hình, leo đỉnh núi cao, lướt ván diều và trượt cát.'),
('LH0007', 'Biển đảo', 'Hòa mình vào làn nước trong xanh, bờ cát trắng mịn, lặn ngắm san hô và thể thao biển.'),
('LH0008', 'Ẩm thực', 'Thưởng thức tinh hoa đặc sản vùng miền, món ngon đường phố và chợ truyền thống nhộn nhịp.'),
('LH0009', 'Tâm linh', 'Chiêm bái các ngôi chùa cổ tự, đền đài thanh tịnh cầu bình an và may mắn.'),
('LH0010', 'Di sản', 'Chiêm ngưỡng các quần thể danh thắng và đô thị cổ được UNESCO công nhận là di sản thế giới.'),
('LH0011', 'Sinh thái', 'Trải nghiệm miệt vườn cây trái Nam Bộ, đồi chè xanh mát và các khu bảo tồn sinh quyển.');

SELECT setval('seq_loai_hinh', 11);

-- 2. Nguoi dung
INSERT INTO NguoiDung (MaNguoiDung, HoTen, Email, MatKhau_hash, PhuongThucXacThuc, VaiTro, TrangThai) VALUES
('ND0001', 'Quản trị viên TravelMate', 'admin@travelmate.com', '$2b$10$zJoJ7QjFiZU2WaACLGUiaOrdHxIQe6aH4Xvi/BRBRIhfDjok3hW2W', 'local', 'Admin', 'Active'),
('ND0002', 'Nguyễn Văn Du Khách', 'member@travelmate.com', '$2b$10$BmBmzcz/BiHNP/CQdyVll.2Bee4wmclbWYaAj4pyL6H1fHZ17yDk.', 'local', 'Member', 'Active');

SELECT setval('seq_nguoi_dung', 2);

-- So thich nguoi dung
INSERT INTO SoThichNguoiDung (MaNguoiDung, MaLoaiHinh) VALUES
('ND0002', 'LH0004'),
('ND0002', 'LH0007'),
('ND0002', 'LH0008'),
('ND0002', 'LH0005');

-- 3. Dia diem du lich
INSERT INTO DiaDiem (MaDiaDiem, Ten, TinhThanh, DanhHieu, MoTa, ViDo, KinhDo, QuyMo, ThoiDiemLyTuong, anh_url) VALUES
('DD0001', 'Cần Thơ', 'Cần Thơ', 'Đô thị sông nước Tây Đô', 
 'Thủ phủ miền Tây Nam Bộ nổi danh với mạng lưới sông ngòi chằng chịt, nét văn hóa chợ nổi Cái Răng độc đáo và những vườn cây trái trĩu quả quanh năm.', 
 10.0451620, 105.7468570, '1.439 km² • Đô thị loại I', 'Tháng 12 – Tháng 4', '/images/cho_noi.jpg'),

('DD0002', 'Đà Lạt', 'Lâm Đồng', 'Thành phố ngàn hoa & sương mù', 
 'Nằm trên cao nguyên Lâm Viên với khí hậu ôn đới quanh năm mát mẻ, rừng thông bạt ngàn, kiến trúc biệt thự Pháp cổ kính và cảnh quan lãng mạn.', 
 11.9404190, 108.4583130, '394 km² • Độ cao 1.500m', 'Tháng 11 – Tháng 3', '/images/ho_xuan_huong.jpg'),

('DD0003', 'Đà Nẵng', 'Đà Nẵng', 'Thành phố đáng sống bậc nhất', 
 'Trung tâm kinh tế du lịch miền Trung sở hữu bãi biển Mỹ Khê quyến rũ, bán đảo Sơn Trà hoang sơ và biểu tượng Cầu Vàng Bà Nà Hills nổi danh quốc tế.', 
 16.0544070, 108.2021670, '1.285 km² • Bờ biển 30 km', 'Tháng 3 – Tháng 8', '/images/cau_vang.jpg'),

('DD0004', 'Hà Nội', 'Hà Nội', 'Thủ đô ngàn năm văn hiến', 
 'Trái tim của cả nước với bề dày lịch sử ngàn năm, 36 phố phường rêu phong cổ kính, nét đẹp bình yên bên Hồ Gươm và nền ẩm thực trứ danh thế giới.', 
 21.0285110, 105.8541670, '3.359 km² • Thủ đô di sản', 'Tháng 9 – Tháng 11 (Thu)', '/images/ho_hoan_kiem.jpg'),

('DD0005', 'Hội An', 'Quảng Nam', 'Di sản Văn hóa Thế giới UNESCO', 
 'Đô thị cổ được bảo tồn gần như nguyên vẹn với những nếp nhà gỗ mái ngói âm dương, tường vàng rực rỡ, lung linh sắc đèn lồng và dòng sông Hoài thơ mộng.', 
 15.8800580, 108.3380470, '61,7 km² • Đô thị cổ thế kỷ 16', 'Tháng 2 – Tháng 7', '/images/hoi_an.jpg'),

('DD0006', 'Ninh Bình', 'Ninh Bình', 'Di sản Thế giới kép UNESCO', 
 'Vùng đất cố đô Hoa Lư linh thiêng sở hữu quần thể danh thắng Tràng An non nước hữu tình, hệ thống hang động karst triệu năm và chùa Bái Đính kỳ vĩ.', 
 20.2506140, 105.9744540, '1.387 km² • Vùng karst ngập nước', 'Tháng 1 – Tháng 3 & Tháng 5', '/images/trang_an.jpg'),

('DD0007', 'Phan Thiết', 'Bình Thuận', 'Thiên đường nắng vàng biển xanh', 
 'Thủ phủ resort nghỉ dưỡng duyên hải Nam Trung Bộ nổi bật với những đồi cát bay ngút ngàn, bờ biển Mũi Né dài lộng gió và ẩm thực hải sản phong phú.', 
 10.9804610, 108.2614740, '211 km² • Bờ biển 57 km', 'Tháng 10 – Tháng 4', '/images/mui_ne.jpg'),

('DD0008', 'Phú Quốc', 'Kiên Giang', 'Đảo ngọc thiên đường nghỉ dưỡng', 
 'Hòn đảo lớn nhất Việt Nam sở hữu những bãi biển trong xanh như ngọc bích, hoàng hôn rực rỡ, hệ thống resort sang trọng đẳng cấp quốc tế và hải sản tuyệt hảo.', 
 10.2898790, 103.9840200, '589 km² • Thành phố đảo đầu tiên', 'Tháng 11 – Tháng 4', '/images/phu_quoc.jpg'),

('DD0009', 'Sapa', 'Lào Cai', 'Thị trấn trong mây & Nóc nhà Đông Dương', 
 'Thị trấn vùng cao Tây Bắc ẩn hiện trong màn sương mờ ảo, nơi có đỉnh Fansipan hùng vĩ cao 3.143m, những thửa ruộng bậc thang tuyệt mỹ và bản làng đậm đà bản sắc.', 
 22.3363610, 103.8437880, '685 km² • Độ cao 1.600m', 'Tháng 9 – Tháng 11 & Tháng 12 – Tháng 2', '/images/fansipan.jpg'),

('DD0010', 'Vịnh Hạ Long', 'Quảng Ninh', 'Kỳ quan Thiên nhiên Thế giới UNESCO', 
 'Di sản thiên nhiên thế giới ngoạn mục với gần 2.000 hòn đảo đá vôi nhấp nhô trên làn nước xanh ngọc lục bảo, hệ thống hang động thạch nhũ huyền ảo triệu năm.', 
 20.9100510, 107.1839020, '1.553 km² • 1.969 hòn đảo', 'Tháng 4 – Tháng 6 & Tháng 9 – Tháng 11', '/images/vinh_ha_long.jpg');

SELECT setval('seq_dia_diem', 10);

-- 4. Dia diem - Loai hinh
INSERT INTO DiaDiem_LoaiHinh (MaDiaDiem, MaLoaiHinh) VALUES
('DD0001', 'LH0011'), ('DD0001', 'LH0008'), ('DD0001', 'LH0002'),
('DD0002', 'LH0004'), ('DD0002', 'LH0001'), ('DD0002', 'LH0011'), ('DD0002', 'LH0005'),
('DD0003', 'LH0007'), ('DD0003', 'LH0004'), ('DD0003', 'LH0005'), ('DD0003', 'LH0008'),
('DD0004', 'LH0003'), ('DD0004', 'LH0002'), ('DD0004', 'LH0008'), ('DD0004', 'LH0009'),
('DD0005', 'LH0010'), ('DD0005', 'LH0002'), ('DD0005', 'LH0008'), ('DD0005', 'LH0004'),
('DD0006', 'LH0010'), ('DD0006', 'LH0001'), ('DD0006', 'LH0009'), ('DD0006', 'LH0003'),
('DD0007', 'LH0007'), ('DD0007', 'LH0004'), ('DD0007', 'LH0006'),
('DD0008', 'LH0007'), ('DD0008', 'LH0004'), ('DD0008', 'LH0008'), ('DD0008', 'LH0005'),
('DD0009', 'LH0005'), ('DD0009', 'LH0006'), ('DD0009', 'LH0001'), ('DD0009', 'LH0002'), ('DD0009', 'LH0009'),
('DD0010', 'LH0010'), ('DD0010', 'LH0001'), ('DD0010', 'LH0007'), ('DD0010', 'LH0005');

-- 5. Hoat dong
INSERT INTO HoatDong (MaHoatDong, Ten, Icon) VALUES
('HD0001', 'Chèo thuyền Kayak', 'waves'),
('HD0002', 'Đi cáp treo ngắm cảnh', 'mountain'),
('HD0003', 'Trekking & Leo núi', 'footprints'),
('HD0004', 'Lặn ngắm san hô', 'anchor'),
('HD0005', 'Thưởng thức ẩm thực đường phố', 'utensils'),
('HD0006', 'Chiêm bái cầu an', 'sparkles'),
('HD0007', 'Đi thuyền nan vãn cảnh', 'compass'),
('HD0008', 'Trượt cát & Lái xe địa hình ATV', 'sun'),
('HD0009', 'Chụp ảnh check-in hoàng hôn', 'camera'),
('HD0010', 'Khám phá hang động thạch nhũ', 'eye');

SELECT setval('seq_hoat_dong', 10);

-- 6. Diem tham quan
INSERT INTO DiemThamQuan (MaDiemTQ, MaDiaDiem, Ten, MoTa, ViDo, KinhDo, DiaChi, GiaVe, GioMoCua, DiemNoiBat) VALUES
('TQ0001', 'DD0001', 'Chợ nổi Cái Răng', 'Chợ đầu mối nông sản trên sông lớn và nổi tiếng nhất miền Tây Nam Bộ với nét văn hóa cây bẹo độc đáo.', 10.0055100, 105.7460200, 'Sông Cần Thơ, P. Lê Bình, Q. Cái Răng', 'Miễn phí (thuê thuyền 350.000đ - 500.000đ)', '05:00 – 09:00', 'Ăn hủ tiếu & cà phê nổi bồng bềnh trên sông'),
('TQ0002', 'DD0001', 'Nhà cổ Bình Thủy', 'Ngôi nhà cổ 5 gian 2 mái kiến trúc giao thoa Pháp - Việt hơn 150 năm tuổi, từng là bối cảnh phim Người Tình (L''Amant).', 10.0733400, 105.7621400, '144 Bùi Hữu Nghĩa, P. Bình Thủy', '20.000đ / người', '07:30 – 18:00', 'Kiến trúc Đông Tây hội ngộ & hoa lan quý hiếm'),
('TQ0003', 'DD0002', 'Thung Lũng Tình Yêu', 'Thắng cảnh nổi tiếng nằm lọt thỏm giữa sườn đồi thông xanh ngắt quanh năm và hồ Đa Thiện thơ mộng.', 11.9796700, 108.4503700, '03-05-07 Mai Anh Đào, P. 8', '250.000đ / người (trọn gói)', '07:00 – 17:00', 'Cầu kính đáy trong suốt 7D và mê cung hoa tình yêu'),
('TQ0004', 'DD0002', 'Thác Datanla', 'Cụm thác nước hoang sơ giữa rừng nguyên sinh với hệ thống máng trượt alpine coaster xuyên rừng dài nhất Đông Nam Á.', 11.9038200, 108.4485500, 'QL20 Đèo Prenn, P. 3', '50.000đ / người (máng trượt tính riêng)', '07:30 – 17:00', 'Tuyến máng trượt 2.400m xuyên rừng thông kỳ thú'),
('TQ0005', 'DD0003', 'Cầu Vàng (Sun World Ba Na Hills)', 'Kỳ quan kiến trúc được nâng đỡ bởi đôi bàn tay khổng lồ phủ rêu phong, vươn ra giữa mây trời non nước Bà Nà.', 15.9950700, 107.9965000, 'Thôn An Sơn, Xã Hòa Ninh, H. Hòa Vang', '900.000đ / người (vé cáp treo Bà Nà)', '08:00 – 18:30', 'Tuyệt tác vươn tầm thế giới ngắm toàn cảnh mây trời'),
('TQ0006', 'DD0003', 'Bán đảo Sơn Trà & Chùa Linh Ứng', 'Lá phổi xanh che chắn gió bão cho Đà Nẵng với tượng Phật Bà Quan Âm cao 67m hướng mắt nhìn ra Biển Đông.', 16.1001400, 108.2778400, 'Bán đảo Sơn Trà, P. Thọ Quang, Q. Sơn Trà', 'Miễn phí', '06:00 – 18:00', 'Tượng Phật Quan Âm cao nhất Việt Nam & ngắm voọc chà vá'),
('TQ0007', 'DD0004', 'Hồ Hoàn Kiếm & Đền Ngọc Sơn', 'Trái tim thiêng liêng của thủ đô với Tháp Rùa cổ kính, Cầu Thê Húc đỏ son dẫn vào Đền Ngọc Sơn trầm mặc giữa lòng hồ.', 21.0285110, 105.8541670, 'Đinh Tiên Hoàng, P. Hàng Trống, Q. Hoàn Kiếm', '30.000đ / người lớn', '07:00 – 18:00', 'Biểu tượng lịch sử ngàn năm văn hiến bên hồ nước xanh biếc'),
('TQ0008', 'DD0004', 'Văn Miếu - Quốc Tử Giám', 'Trường đại học đầu tiên của Việt Nam lưu giữ 82 bia tiến sĩ vinh danh truyền thống hiếu học hiền tài của dân tộc.', 21.0293600, 105.8360500, '58 Quốc Tử Giám, P. Văn Miếu, Q. Đống Đa', '30.000đ / người', '08:00 – 17:30', 'Khuê Văn Các & 82 tấm bia tiến sĩ Di sản Ký ức Thế giới'),
('TQ0009', 'DD0005', 'Chùa Cầu Hội An', 'Cây cầu ngói cổ kính mang phong cách Nhật Bản vắt qua nhánh sông nhỏ, biểu tượng linh thiêng kết nối văn hóa phố Hội.', 15.8771100, 108.3260700, 'Đường Nguyễn Thị Minh Khai, P. Cẩm Phô', '80.000đ / vé tham quan phố cổ', '07:00 – 21:30', 'Cầu ngói cổ 400 năm tuổi trên tờ tiền 20.000 đồng'),
('TQ0010', 'DD0005', 'Hội quán Phúc Kiến', 'Công trình kiến trúc Trung Hoa lộng lẫy và quy mô nhất Hội An, nơi thờ Thiên Hậu Thánh Mẫu bảo hộ người đi biển.', 15.8781900, 108.3308900, '46 Trần Phú, P. Cẩm Châu', 'Đã gồm trong vé phố cổ', '07:30 – 18:00', 'Nhang vòng khổng lồ cầu may & cổng tam quan chạm khắc tinh xảo'),
('TQ0011', 'DD0006', 'Quần thể Danh thắng Tràng An', 'Tuyệt tác địa chất karst thế giới với mê cung hang động xuyên thủy và thung nước xanh biếc được chèo thuyền khám phá.', 20.2541800, 105.9087500, 'Xã Ninh Xuân, H. Hoa Lư', '250.000đ / người (thuyền đò 3 tiếng)', '07:00 – 17:00', 'Ngồi thuyền nan luồn qua 9 hang động xuyên thủy kỳ thú'),
('TQ0012', 'DD0006', 'Chùa Bái Đính', 'Quần thể chùa Phật giáo nắm giữ nhiều kỷ lục châu Á và Việt Nam nhất, sở hữu hành lang 500 tượng La Hán bằng đá xanh.', 20.2694400, 105.8569400, 'Xã Gia Sinh, H. Gia Viễn', 'Miễn phí (xe điện 30.000đ/chuyến)', '06:00 – 20:00', 'Đại bảo tháp cao 100m & chuông đồng lớn nhất Việt Nam'),
('TQ0013', 'DD0007', 'Đồi Cát Bay Mũi Né', 'Bãi cát vàng óng ả liên tục đổi hình dạng theo chiều gió biển, điểm đến không thể bỏ qua để trải nghiệm trượt cát.', 10.9491600, 108.2936100, 'Vòng xoay Mũi Né, P. Mũi Né', 'Miễn phí (thuê ván trượt 20.000đ)', 'Tự do (đẹp nhất 05:00 – 08:00)', 'Bức tranh đồi cát sa mạc biến ảo kỳ diệu bên biển'),
('TQ0014', 'DD0007', 'Suối Tiên Mũi Né', 'Dòng suối nước đỏ phù sa mát lạnh chảy hiền hòa giữa hẻm núi nhũ cát trắng và đất đỏ tạo hình kỳ vĩ như tranh vẽ.', 10.9513800, 108.2683300, '49 Huỳnh Thúc Kháng, P. Hàm Tiến', '15.000đ / người', '06:00 – 18:00', 'Đi chân trần lội suối phù sa ngắm thạch nhũ cát độc nhất vô nhị'),
('TQ0015', 'DD0008', 'Bãi Sao Phú Quốc', 'Bãi biển đẹp tựa thiên đường với dải cát trắng mịn như kem, làn nước trong vắt màu ngọc lam phẳng lặng không một gợn sóng.', 10.0526700, 104.0336200, 'Ấp Bãi Sao, P. An Thới', 'Miễn phí', 'Tự do', 'Bờ cát trắng mịn như bột & hàng dừa nghiêng bóng nên thơ'),
('TQ0016', 'DD0008', 'Cáp treo Hòn Thơm & Sun World', 'Tuyến cáp treo 3 dây vượt biển dài nhất thế giới nối An Thới với đảo Hòn Thơm, ngắm nhìn toàn cảnh làng chài từ trên cao.', 10.0263800, 104.0152700, 'Bãi Đất Đỏ, P. An Thới', '650.000đ / người lớn', '08:30 – 17:30', 'Kỷ lục Guinness cáp treo vượt biển dài nhất thế giới 7.899m'),
('TQ0017', 'DD0009', 'Đỉnh Fansipan - Sun World Fansipan Legend', 'Nóc nhà Đông Dương cao 3.143m ngự trị giữa biển mây bồng bềnh, điểm săn mây và chiêm bái đại tượng Phật thiêng liêng.', 22.3033300, 103.7750000, 'Thị xã Sapa', '850.000đ / vé cáp treo khứ hồi', '07:30 – 17:30', 'Chạm tay vào cột mốc 3.143m Nóc nhà Đông Dương giữa biển mây'),
('TQ0018', 'DD0009', 'Bản Cát Cát', 'Bản làng cổ kính của đồng bào dân tộc H''Mông nép mình dưới chân dãy Hoàng Liên Sơn với nghề dệt thổ cẩm và cối xay nước.', 22.3275000, 103.8344400, 'Xã San Sả Hồ, Thị xã Sapa', '90.000đ / người lớn', '06:00 – 18:00', 'Bản làng đồng bào vùng cao mộc mạc bên thác Tiên Sa róc rách'),
('TQ0019', 'DD0010', 'Hang Sửng Sốt', 'Hang động thạch nhũ rộng lớn và tráng lệ bậc nhất Vịnh Hạ Long, nằm trên đảo Bồ Hòn với hàng ngàn nhũ đá biến hóa huyền ảo.', 20.8736100, 107.0863800, 'Đảo Bồ Hòn, Vịnh Hạ Long', 'Đã gồm trong vé tuyến tham quan số 2', '07:30 – 16:30', 'Hai gian hang khổng lồ lấp lánh ánh sáng thạch nhũ triệu năm'),
('TQ0020', 'DD0010', 'Đảo Ti Tốp', 'Hòn đảo có bãi cát hình trăng khuyết ôm lấy chân đảo và đỉnh vọng cảnh tuyệt đẹp nhìn bao quát toàn bộ kỳ quan vịnh biển.', 20.8591600, 107.0805500, 'Vịnh Hạ Long', 'Đã gồm trong vé tuyến tham quan', '07:30 – 17:00', 'Leo 400 bậc đá ngắm nhìn góc ảnh vịnh biển đẹp nhất thế giới');

SELECT setval('seq_diem_tq', 20);

-- Media diem tham quan
INSERT INTO MediaDiemThamQuan (MaMediaDTQ, MaDiemTQ, ThuTu, Media_url, media_type) VALUES
('MTQ0001', 'TQ0001', 1, '/images/cho_noi.jpg', 'image'),
('MTQ0002', 'TQ0002', 1, '/images/cho_noi.jpg', 'image'),
('MTQ0003', 'TQ0003', 1, '/images/ho_xuan_huong.jpg', 'image'),
('MTQ0004', 'TQ0004', 1, '/images/ho_xuan_huong.jpg', 'image'),
('MTQ0005', 'TQ0005', 1, '/images/cau_vang.jpg', 'image'),
('MTQ0006', 'TQ0006', 1, '/images/cau_vang.jpg', 'image'),
('MTQ0007', 'TQ0007', 1, '/images/ho_hoan_kiem.jpg', 'image'),
('MTQ0008', 'TQ0008', 1, '/images/ho_hoan_kiem.jpg', 'image'),
('MTQ0009', 'TQ0009', 1, '/images/hoi_an.jpg', 'image'),
('MTQ0010', 'TQ0010', 1, '/images/hoi_an.jpg', 'image'),
('MTQ0011', 'TQ0011', 1, '/images/trang_an.jpg', 'image'),
('MTQ0012', 'TQ0012', 1, '/images/trang_an.jpg', 'image'),
('MTQ0013', 'TQ0013', 1, '/images/mui_ne.jpg', 'image'),
('MTQ0014', 'TQ0014', 1, '/images/mui_ne.jpg', 'image'),
('MTQ0015', 'TQ0015', 1, '/images/phu_quoc.jpg', 'image'),
('MTQ0016', 'TQ0016', 1, '/images/phu_quoc.jpg', 'image'),
('MTQ0017', 'TQ0017', 1, '/images/fansipan.jpg', 'image'),
('MTQ0018', 'TQ0018', 1, '/images/fansipan.jpg', 'image'),
('MTQ0019', 'TQ0019', 1, '/images/vinh_ha_long.jpg', 'image'),
('MTQ0020', 'TQ0020', 1, '/images/vinh_ha_long.jpg', 'image');

SELECT setval('seq_media_dtq', 20);

-- Diem tham quan - Hoat dong
INSERT INTO DiemThamQuan_HoatDong (MaDiemTQ, MaHoatDong, ThuTu, GhiChu) VALUES
('TQ0001', 'HD0005', 1, 'Ăn sáng hủ tiếu trên sông'),
('TQ0001', 'HD0007', 2, 'Chụp ảnh tàu bè chợ nổi'),
('TQ0005', 'HD0002', 1, 'Cáp treo Bà Nà đạt kỷ lục'),
('TQ0005', 'HD0009', 2, 'Check-in bàn tay Cầu Vàng'),
('TQ0011', 'HD0007', 1, 'Thuyền nan luồn qua hang động'),
('TQ0013', 'HD0008', 1, 'Trượt ván cát và xe địa hình'),
('TQ0015', 'HD0009', 1, 'Tắm biển bãi cát trắng mịn'),
('TQ0017', 'HD0002', 1, 'Cáp treo săn mây Hoàng Liên Sơn'),
('TQ0017', 'HD0006', 2, 'Chiêm bái tượng Phật trên đỉnh'),
('TQ0019', 'HD0010', 1, 'Khám phá hang động thạch nhũ');

-- Diem tham quan - Loai hinh
INSERT INTO DiemThamQuan_LoaiHinh (MaDiemTQ, MaLoaiHinh) VALUES
('TQ0001', 'LH0008'), ('TQ0001', 'LH0002'),
('TQ0003', 'LH0001'), ('TQ0003', 'LH0005'),
('TQ0005', 'LH0005'), ('TQ0005', 'LH0004'),
('TQ0007', 'LH0003'), ('TQ0007', 'LH0002'),
('TQ0009', 'LH0010'), ('TQ0009', 'LH0002'),
('TQ0011', 'LH0010'), ('TQ0011', 'LH0001'),
('TQ0013', 'LH0006'), ('TQ0013', 'LH0007'),
('TQ0015', 'LH0007'), ('TQ0015', 'LH0004'),
('TQ0017', 'LH0005'), ('TQ0017', 'LH0006'), ('TQ0017', 'LH0009'),
('TQ0019', 'LH0010'), ('TQ0019', 'LH0001');

-- 7. Tien nghi
INSERT INTO TienNghi (MaTienNghi, Ten, Icon) VALUES
('TN0001', 'Hồ bơi vô cực view biển/núi', 'waves'),
('TN0002', 'Spa & Trị liệu thảo mộc', 'sparkles'),
('TN0003', 'Bãi biển riêng biệt lập', 'umbrella'),
('TN0004', 'Suối khoáng nóng tự nhiên', 'flame'),
('TN0005', 'Nhà hàng Fine Dining cao cấp', 'utensils'),
('TN0006', 'Quầy bar ngắm hoàng hôn', 'wine'),
('TN0007', 'Xe riêng đưa đón sân bay', 'car'),
('TN0008', 'Bồn tắm ngâm khoáng view thiên nhiên', 'bath'),
('TN0009', 'Bữa sáng buffet thượng hạng', 'coffee'),
('TN0010', 'Trà chiều & Bánh ngọt kiểu Âu', 'cup-soda');

SELECT setval('seq_tien_nghi', 10);

-- 8. Khach san
INSERT INTO KhachSan (MaKhachSan, MaDiaDiem, Ten, SoSao, MoTa, ViDo, KinhDo, DiaChi, GiaThamKhao, DiemNoiBat, DonViTinh, booking_url) VALUES
('KS0001', 'DD0001', 'Victoria Can Tho Resort', 4.5, 
 'Khu nghỉ dưỡng phong cách thuộc địa Pháp nép mình bên dòng sông Hậu hiền hòa, bao quanh bởi khu vườn nhiệt đới xanh mướt.', 
 10.0475100, 105.7891200, 'Phường Cái Khế, Q. Ninh Kiều, Cần Thơ', 
 2350000, 'Hồ bơi hướng sông Hậu & bữa sáng trên du thuyền cổ', '/đêm', 
 'https://www.agoda.com/vi-vn/victoria-can-tho-resort/hotel/can-tho-vn.html'),

('KS0002', 'DD0001', 'Azerai Can Tho Resort', 5.0, 
 'Được mệnh danh là ốc đảo bình yên trên cồn Ấu, kiến trúc tối giản đương đại hòa quyện cảnh sắc thiên nhiên sông nước phù sa.', 
 10.0198000, 105.7954000, 'Cồn Ấu, P. Hưng Phú, Q. Cái Răng, Cần Thơ', 
 6200000, 'Ốc đảo biệt lập trên cồn phù sa với spa chuẩn quốc tế', '/đêm', 
 'https://www.booking.com/hotel/vn/azerai-can-tho.vi.html'),

('KS0003', 'DD0002', 'Ana Mandara Villas Dalat Resort & Spa', 5.0, 
 'Quần thể 17 biệt thự kiểu Pháp cổ xây dựng từ những năm 1920 tọa lạc trên đồi thông thơ mộng giữa lòng thành phố ngàn hoa.', 
 11.9391000, 108.4285000, 'Đường Lê Lai, P. 5, TP. Đà Lạt', 
 3450000, 'Biệt thự Pháp cổ nguyên bản có lò sưởi ấm cúng và spa đá nóng', '/đêm', 
 'https://www.agoda.com/vi-vn/ana-mandara-villas-dalat-resort-spa/hotel/dalat-vn.html'),

('KS0004', 'DD0002', 'Dalat Edensee Lake Resort & Spa', 5.0, 
 'Khu nghỉ dưỡng phong cách làng châu Âu nằm biệt lập bên hồ Tuyền Lâm, bao bọc bởi rừng thông nguyên sinh bạt ngàn.', 
 11.8795000, 108.4231000, 'Khu du lịch Hồ Tuyền Lâm, P. 4, TP. Đà Lạt', 
 2950000, 'View ôm trọn hồ Tuyền Lâm tĩnh lặng và dịch vụ chèo thuyền kayak', '/đêm', 
 'https://www.booking.com/hotel/vn/dalat-edensee-lake-resort-spa.vi.html'),

('KS0005', 'DD0003', 'InterContinental Danang Sun Peninsula Resort', 5.0, 
 'Tuyệt tác nghỉ dưỡng của kiến trúc sư Bill Bensley tọa lạc trên sườn đồi bán đảo Sơn Trà với bãi biển riêng tư tuyệt mỹ.', 
 16.1218000, 108.3079000, 'Bãi Bắc, Bán đảo Sơn Trà, TP. Đà Nẵng', 
 11800000, 'Khu nghỉ dưỡng sang trọng hàng đầu thế giới với nhà hàng Michelin La Maison 1888', '/đêm', 
 'https://www.agoda.com/vi-vn/intercontinental-danang-sun-peninsula-resort/hotel/da-nang-vn.html'),

('KS0006', 'DD0003', 'Furama Resort Danang', 5.0, 
 'Khu nghỉ dưỡng 5 sao đầu tiên tại Đà Nẵng nằm sát biển Mỹ Khê với phong cách văn hóa Chăm pa tinh tế và hồ bơi đầm phá độc đáo.', 
 16.0396000, 108.2483000, '105 Võ Nguyên Giáp, P. Khuê Mỹ, Q. Ngũ Hành Sơn, TP. Đà Nẵng', 
 4100000, 'Hồ bơi đầm phá nhiệt đới giữa rừng cây và bãi biển riêng Mỹ Khê', '/đêm', 
 'https://www.booking.com/hotel/vn/furama-resort-danang.vi.html'),

('KS0007', 'DD0004', 'Sofitel Legend Metropole Hanoi', 5.0, 
 'Khách sạn di sản huyền thoại mở cửa từ năm 1901, nơi lưu giữ tinh hoa kiến trúc Pháp cổ điển và từng đón tiếp nhiều nguyên thủ thế giới.', 
 21.0256000, 105.8561000, '15 Ngô Quyền, P. Tràng Tiền, Q. Hoàn Kiếm, Hà Nội', 
 7600000, 'Khách sạn di sản 120 năm tuổi với hầm trú ẩn lịch sử và trà chiều sang trọng', '/đêm', 
 'https://www.agoda.com/vi-vn/sofitel-legend-metropole-hanoi/hotel/hanoi-vn.html'),

('KS0008', 'DD0004', 'Capella Hanoi', 5.0, 
 'Khách sạn boutique kiệt tác của Bill Bensley tái hiện hoàng kim nhạc kịch Opera những năm 1920, chỉ cách Hồ Gươm vài bước chân.', 
 21.0248000, 105.8553000, '11 Lê Phụng Hiểu, P. Tràng Tiền, Q. Hoàn Kiếm, Hà Nội', 
 8900000, 'Nhà hàng Koki 1 sao Michelin và thiết kế nghệ thuật Opera tráng lệ', '/đêm', 
 'https://www.booking.com/hotel/vn/capella-hanoi.vi.html'),

('KS0009', 'DD0005', 'Anantara Hoi An Resort', 5.0, 
 'Khu nghỉ dưỡng boutique thanh lịch nép mình bên dòng sông Thu Bồn thơ mộng, chỉ cách trung tâm phố cổ Hội An 1km.', 
 15.8778000, 108.3375000, '01 Phạm Hồng Thái, P. Cẩm Châu, TP. Hội An', 
 4800000, 'Du thuyền ngắm hoàng hôn trên sông Thu Bồn & lớp học làm đèn lồng', '/đêm', 
 'https://www.agoda.com/vi-vn/anantara-hoi-an-resort/hotel/hoi-an-vn.html'),

('KS0010', 'DD0005', 'Four Seasons Resort The Nam Hai', 5.0, 
 'Tuyệt tác biệt thự ven biển Hà My với kiến trúc lấy cảm hứng từ phong thủy nhà rường truyền thống và hồ bơi vô cực 3 tầng ngoạn mục.', 
 15.9189000, 108.3341000, 'Khối Hà My Đông B, Điện Bàn, Quảng Nam', 
 16500000, 'Hồ bơi vô cực 3 tầng nối thẳng ra biển & The Heart of the Earth Spa nổi trên hồ sen', '/đêm', 
 'https://www.booking.com/hotel/vn/the-nam-hai.vi.html'),

('KS0011', 'DD0006', 'Emeralda Resort Ninh Binh', 5.0, 
 'Tái hiện không gian làng quê Bắc Bộ cổ kính với mái ngói đỏ, sân gạch, vườn cây ăn trái và nằm ngay sát khu bảo tồn ngập nước Vân Long.', 
 20.3621000, 105.8654000, 'Xã Gia Vân, H. Gia Viễn, Tỉnh Ninh Bình', 
 2550000, 'Kiến trúc làng cổ Bắc Bộ thanh bình có hồ bơi nước nóng trong nhà', '/đêm', 
 'https://www.agoda.com/vi-vn/emeralda-resort-ninh-binh/hotel/ninh-binh-vn.html'),

('KS0012', 'DD0006', 'Tam Coc Garden Resort', 4.5, 
 'Khu nghỉ dưỡng sinh thái nép mình giữa những cánh đồng lúa xanh ngát và những ngọn núi đá vôi kỳ vĩ của vùng Tam Cốc.', 
 20.2089000, 105.9321000, 'Thôn Hải Nham, Xã Ninh Hải, H. Hoa Lư, Ninh Bình', 
 3900000, 'Không gian điền viên tĩnh lặng giữa cánh đồng lúa và núi non nguyên sơ', '/đêm', 
 'https://www.booking.com/hotel/vn/tam-coc-garden.vi.html'),

('KS0013', 'DD0007', 'Anantara Mui Ne Resort', 5.0, 
 'Resort đẳng cấp quốc tế kết hợp hoàn hảo giữa nét duyên Việt Nam và lối thiết kế hiện đại bên bờ biển rợp bóng dừa Mũi Né.', 
 10.9542000, 108.1965000, '12A Nguyễn Đình Chiểu, P. Hàm Tiến, TP. Phan Thiết', 
 4200000, 'Bãi biển riêng tư tĩnh lặng và biệt thự có hồ bơi riêng biệt lập', '/đêm', 
 'https://www.agoda.com/vi-vn/anantara-mui-ne-resort/hotel/phan-thiet-vn.html'),

('KS0014', 'DD0007', 'The Cliff Resort & Residences', 4.5, 
 'Tọa lạc trên dốc đá thoai thoải hướng thẳng ra toàn cảnh vịnh biển Mũi Né, sở hữu những căn hộ và villa view biển đắt giá.', 
 10.9421000, 108.1724000, 'Khu phố 5, P. Phú Hài, TP. Phan Thiết', 
 2750000, 'Hồ bơi tràn bờ sát vách đá và rạp chiếu phim ngoài trời cạnh bờ biển', '/đêm', 
 'https://www.booking.com/hotel/vn/the-cliff-resort-residences.vi.html'),

('KS0015', 'DD0008', 'JW Marriott Phu Quoc Emerald Bay Resort & Spa', 5.0, 
 'Kiệt tác trường đại học thần thoại Lamarck University của Bill Bensley bên bờ biển Bãi Khem cát trắng mịn như kem.', 
 10.0381000, 104.0322000, 'Bãi Khem, P. An Thới, TP. Phú Quốc', 
 9200000, 'Hồ bơi hình vỏ sò khổng lồ và bãi biển riêng Bãi Khem đẹp nhất đảo', '/đêm', 
 'https://www.agoda.com/vi-vn/jw-marriott-phu-quoc-emerald-bay-resort-spa/hotel/phu-quoc-island-vn.html'),

('KS0016', 'DD0008', 'InterContinental Phu Quoc Long Beach Resort', 5.0, 
 'Tọa lạc tại Bãi Trường hoang sơ, nổi tiếng với quầy bar tầng thượng INK 360 ngắm toàn cảnh hoàng hôn ngoạn mục nhất đảo.', 
 10.1345000, 103.9782000, 'Bãi Trường, Xã Dương Tơ, TP. Phú Quốc', 
 4600000, 'Quầy bar INK 360 thiết kế bạch tuộc ngắm hoàng hôn đỉnh cao', '/đêm', 
 'https://www.booking.com/hotel/vn/intercontinental-phu-quoc-long-beach-resort.vi.html'),

('KS0017', 'DD0009', 'Hotel de la Coupole - MGallery', 5.0, 
 'Khách sạn tráng lệ mang phong cách thời trang haute couture Pháp giao hòa sắc màu thổ cẩm vùng cao Tây Bắc ngay giữa trung tâm Sapa.', 
 22.3331000, 103.8422000, '01 Hoàng Liên, Thị xã Sapa, Tỉnh Lào Cai', 
 3850000, 'Ga tàu hỏa leo núi Mường Hoa ngay trong sảnh và hồ bơi nước nóng Le Grand Bassin tuyệt mỹ', '/đêm', 
 'https://www.agoda.com/vi-vn/hotel-de-la-coupole-mgallery-by-sofitel/hotel/sapa-vn.html'),

('KS0018', 'DD0009', 'Topas Ecolodge', 5.0, 
 'Khu nghỉ dưỡng sinh thái độc đáo nằm trên đỉnh hai ngọn đồi tròn trong thung lũng Mường Hoa, được National Geographic vinh danh.', 
 22.2514000, 103.9021000, 'Xã Thanh Bình, Thị xã Sapa, Lào Cai', 
 6100000, 'Hồ bơi vô cực nước nóng view toàn cảnh thung lũng ruộng bậc thang ngoạn mục', '/đêm', 
 'https://www.booking.com/hotel/vn/topas-ecolodge.vi.html'),

('KS0019', 'DD0010', 'Vinpearl Resort & Spa Ha Long', 5.0, 
 'Khu nghỉ dưỡng hoàn toàn trên mặt biển tọa lạc biệt lập trên đảo Rều, ngắm nhìn toàn cảnh kỳ quan vịnh biển 360 độ.', 
 20.9412000, 107.0321000, 'Đảo Rều, Bãi Cháy, TP. Hạ Long, Quảng Ninh', 
 3200000, 'Lâu đài nghỉ dưỡng trắng muốt biệt lập trên biển với 3 bãi tắm riêng', '/đêm', 
 'https://www.agoda.com/vi-vn/vinpearl-resort-spa-ha-long/hotel/ha-long-vn.html'),

('KS0020', 'DD0010', 'Du thuyền Paradise Elegance Cruise Ha Long', 5.0, 
 'Khách sạn nổi trên vịnh với du thuyền vỏ thép hiện đại, cabin sang trọng có ban công riêng nhìn ra hàng ngàn đảo đá vôi kỳ vĩ.', 
 20.9254000, 107.0125000, 'Cảng tàu khách quốc tế Tuần Châu, TP. Hạ Long', 
 7500000, 'Nghỉ đêm giữa lòng kỳ quan di sản thế giới với bữa tối hải sản chuẩn 5 sao', '/cabin đôi', 
 'https://www.booking.com/hotel/vn/paradise-elegance-cruise-halong.vi.html');

SELECT setval('seq_khach_san', 20);

-- Media khach san
INSERT INTO MediaKhachSan (MaMediaKS, MaKhachSan, ThuTu, Media_url, Media_type) VALUES
('MKS0001', 'KS0001', 1, '/images/cho_noi.jpg', 'image'),
('MKS0002', 'KS0002', 1, '/images/cho_noi.jpg', 'image'),
('MKS0003', 'KS0003', 1, '/images/ho_xuan_huong.jpg', 'image'),
('MKS0004', 'KS0004', 1, '/images/ho_xuan_huong.jpg', 'image'),
('MKS0005', 'KS0005', 1, '/images/cau_vang.jpg', 'image'),
('MKS0006', 'KS0006', 1, '/images/cau_vang.jpg', 'image'),
('MKS0007', 'KS0007', 1, '/images/ho_hoan_kiem.jpg', 'image'),
('MKS0008', 'KS0008', 1, '/images/ho_hoan_kiem.jpg', 'image'),
('MKS0009', 'KS0009', 1, '/images/hoi_an.jpg', 'image'),
('MKS0010', 'KS0010', 1, '/images/hoi_an.jpg', 'image'),
('MKS0011', 'KS0011', 1, '/images/trang_an.jpg', 'image'),
('MKS0012', 'KS0012', 1, '/images/trang_an.jpg', 'image'),
('MKS0013', 'KS0013', 1, '/images/mui_ne.jpg', 'image'),
('MKS0014', 'KS0014', 1, '/images/mui_ne.jpg', 'image'),
('MKS0015', 'KS0015', 1, '/images/phu_quoc.jpg', 'image'),
('MKS0016', 'KS0016', 1, '/images/phu_quoc.jpg', 'image'),
('MKS0017', 'KS0017', 1, '/images/fansipan.jpg', 'image'),
('MKS0018', 'KS0018', 1, '/images/fansipan.jpg', 'image'),
('MKS0019', 'KS0019', 1, '/images/vinh_ha_long.jpg', 'image'),
('MKS0020', 'KS0020', 1, '/images/vinh_ha_long.jpg', 'image');

SELECT setval('seq_media_ks', 20);

-- Khach san - Tien nghi
INSERT INTO KhachSan_TienNghi (MaKhachSan, MaTienNghi, ThuTu, GhiChu) VALUES
('KS0001', 'TN0001', 1, 'Hồ bơi nhiệt đới hướng sông'),
('KS0001', 'TN0002', 2, 'Spa trị liệu cổ truyền'),
('KS0003', 'TN0002', 1, 'La Cochinchine Spa thảo mộc'),
('KS0003', 'TN0005', 2, 'Nhà hàng Le Petit Dalat'),
('KS0005', 'TN0001', 1, 'Hồ bơi L.O.N.G Pool dài 50m'),
('KS0005', 'TN0003', 2, 'Bãi biển riêng 700m tách biệt'),
('KS0005', 'TN0005', 3, 'Nhà hàng La Maison 1888 Michelin'),
('KS0007', 'TN0005', 1, 'Nhà hàng Pháp Le Beaulieu'),
('KS0007', 'TN0010', 2, 'Trà chiều tại Le Club Bar'),
('KS0010', 'TN0001', 1, 'Hồ bơi vô cực 3 tầng nối thẳng ra biển'),
('KS0010', 'TN0003', 2, 'Bãi biển Hà My riêng tư'),
('KS0015', 'TN0001', 1, 'Hồ bơi hình vỏ sò Shell Pool'),
('KS0015', 'TN0003', 2, 'Bãi biển Bãi Khem cát trắng mịn'),
('KS0018', 'TN0001', 1, 'Hồ bơi vô cực nước nóng ngắm thung lũng mây'),
('KS0020', 'TN0005', 1, 'Bữa tối tôm hùm thượng hạng trên du thuyền'),
('KS0020', 'TN0006', 2, 'Piano Lounge trên boong ngắm vịnh đêm');

-- Khach san - Loai hinh
INSERT INTO KhachSan_LoaiHinh (MaKhachSan, MaLoaiHinh) VALUES
('KS0001', 'LH0004'), ('KS0001', 'LH0011'),
('KS0002', 'LH0004'), ('KS0002', 'LH0011'),
('KS0003', 'LH0004'), ('KS0003', 'LH0001'),
('KS0005', 'LH0004'), ('KS0005', 'LH0007'),
('KS0007', 'LH0004'), ('KS0007', 'LH0003'),
('KS0010', 'LH0004'), ('KS0010', 'LH0007'),
('KS0011', 'LH0004'), ('KS0011', 'LH0001'),
('KS0013', 'LH0004'), ('KS0013', 'LH0007'),
('KS0015', 'LH0004'), ('KS0015', 'LH0007'),
('KS0018', 'LH0004'), ('KS0018', 'LH0001'), ('KS0018', 'LH0006'),
('KS0020', 'LH0004'), ('KS0020', 'LH0005'), ('KS0020', 'LH0007');

-- 9. Tuong tac nguoi dung
INSERT INTO LichSuTimKiem (MaLSTimKiem, MaNguoiDung, MaDiaDiem, Anh_TaiLen_url, DoTinCay, KetQuaTopK, GhiChu) VALUES
('LS0001', 'ND0002', 'DD0010', '/images/vinh_ha_long.jpg', 99.40, 
 '[{"label": "Vịnh Hạ Long", "score": 0.994}, {"label": "Ninh Bình", "score": 0.004}, {"label": "Phú Quốc", "score": 0.001}]'::jsonb, 
 'Nhận diện ảnh du thuyền trên vịnh biển'),
('LS0002', 'ND0002', 'DD0003', '/images/cau_vang.jpg', 98.75, 
 '[{"label": "Đà Nẵng", "score": 0.9875}, {"label": "Hội An", "score": 0.008}, {"label": "Sapa", "score": 0.003}]'::jsonb, 
 'Nhận diện Cầu Vàng Bà Nà Hills'),
('LS0003', 'ND0002', 'DD0006', '/images/trang_an.jpg', 97.80, 
 '[{"label": "Ninh Bình", "score": 0.978}, {"label": "Vịnh Hạ Long", "score": 0.015}, {"label": "Cần Thơ", "score": 0.004}]'::jsonb, 
 'Nhận diện dòng sông Tràng An');

SELECT setval('seq_ls_tim_kiem', 3);

-- Yeu thich
INSERT INTO YeuThich (MaYeuThich, MaNguoiDung, MaDiaDiem, MaDiemTQ, MaKhachSan) VALUES
('YT0001', 'ND0002', 'DD0010', NULL, NULL),
('YT0002', 'ND0002', NULL, 'TQ0005', NULL),
('YT0003', 'ND0002', NULL, NULL, 'KS0005'),
('YT0004', 'ND0002', NULL, NULL, 'KS0015');

SELECT setval('seq_yeu_thich', 4);

-- Danh gia khach san
INSERT INTO DanhGiaKhachSan (MaDanhGiaKS, MaNguoiDung, MaKhachSan, DanhGia, BinhLuan) VALUES
('DGKS0001', 'ND0002', 'KS0005', 5.0, 'Khu nghỉ dưỡng đẹp nhất Việt Nam từng trải nghiệm. Kiến trúc của Bill Bensley quá xuất sắc, bãi biển riêng tư tuyệt đối!'),
('DGKS0002', 'ND0002', 'KS0015', 5.0, 'Bãi cát Bãi Khem trắng mịn như kem, đồ ăn ngon và dịch vụ đẳng cấp 5 sao chuẩn mực.');

SELECT setval('seq_danh_gia_ks', 2);

-- Danh gia diem tham quan
INSERT INTO DanhGiaDiemTQ (MaDanhGiaDTQ, MaNguoiDung, MaDiemTQ, DanhGia, BinhLuan) VALUES
('DGTQ0001', 'ND0002', 'TQ0005', 5.0, 'Cầu Vàng nhìn ở ngoài thực sự tráng lệ và kỳ vĩ giữa biển mây. Rất đáng để ghé thăm khi tới Đà Nẵng!'),
('DGTQ0002', 'ND0002', 'TQ0011', 4.8, 'Tràng An non nước hữu tình, các bác chèo thuyền đò rất thân thiện và nhiệt tình.');

SELECT setval('seq_danh_gia_dtq', 2);
