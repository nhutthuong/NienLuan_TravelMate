import React, { useMemo } from 'react';
import { MapPin, Clock, Compass, Sparkles, Shirt, Utensils, Building } from 'lucide-react';

const DESTINATION_TIPS = {
  DD0001: {
    // Cần Thơ
    subtitle: 'Kinh nghiệm khám phá miền sông nước Tây Đô',
    tips: [
      {
        icon: <Clock className="w-4 h-4 text-sky-600" />,
        title: 'Đi chợ nổi sớm',
        desc: 'Nên thuê thuyền xuất bến từ 05:30 – 07:00 sáng để bắt trọn khoảnh khắc Chợ nổi Cái Răng tấp nập và thưởng thức hủ tiếu nóng hổi bồng bềnh trên sông.',
      },
      {
        icon: <Shirt className="w-4 h-4 text-emerald-600" />,
        title: 'Trang phục & Hành trang',
        desc: 'Quần áo cotton thoáng mát, nón lá hoặc mũ rộng vành che nắng sông nước, kính râm và kem chống nắng.',
      },
      {
        icon: <Utensils className="w-4 h-4 text-amber-600" />,
        title: 'Ẩm thực miệt vườn',
        desc: 'Đừng quên thử bánh xèo củ hũ dừa, nem nướng Cái Răng, cá lóc nướng trui và trái cây tươi hái tại vườn Phong Điền.',
      },
    ],
  },
  DD0002: {
    // Đà Lạt
    subtitle: 'Cẩm nang vi vu thành phố ngàn hoa và sương mù',
    tips: [
      {
        icon: <Clock className="w-4 h-4 text-sky-600" />,
        title: 'Săn mây & Bình minh',
        desc: 'Thời điểm ngắm sương sớm và săn mây đẹp nhất là từ 05:00 – 06:30 tại đồi chè Cầu Đất hoặc đỉnh Hòn Bồ.',
      },
      {
        icon: <Shirt className="w-4 h-4 text-emerald-600" />,
        title: 'Áo khoác giữ ấm',
        desc: 'Nhiệt độ Đà Lạt về đêm thường xuống 14 – 16°C. Hãy mang theo áo len, khăn choàng và áo khoác gió ấm áp.',
      },
      {
        icon: <Utensils className="w-4 h-4 text-amber-600" />,
        title: 'Món ngon phố núi',
        desc: 'Thưởng thức lẩu gà lá é, lẩu bò Ba Toa, bánh tráng nướng và một ly sữa đậu nành nóng hổi giữa tiết trời se lạnh.',
      },
    ],
  },
  DD0003: {
    // Đà Nẵng
    subtitle: 'Bí quyết trải nghiệm thành phố biển đáng sống',
    tips: [
      {
        icon: <Clock className="w-4 h-4 text-sky-600" />,
        title: 'Thời điểm ngắm Cầu Rồng',
        desc: 'Vào 21:00 tối thứ Bảy và Chủ nhật hàng tuần, Cầu Rồng sẽ trình diễn phun lửa và phun nước độc đáo.',
      },
      {
        icon: <Shirt className="w-4 h-4 text-emerald-600" />,
        title: 'Hành trang biển & núi',
        desc: 'Đồ bơi tắm biển Mỹ Khê, kem chống nắng cùng giày thể thao êm chân khi khám phá Bà Nà Hills và bán đảo Sơn Trà.',
      },
      {
        icon: <Utensils className="w-4 h-4 text-amber-600" />,
        title: 'Đặc sản miền Trung',
        desc: 'Mì Quảng ếch, bánh tráng cuốn thịt heo hai đầu da chấm mắm nêm, bún chả cá và hải sản tươi sống.',
      },
    ],
  },
  DD0004: {
    // Hà Nội
    subtitle: 'Kinh nghiệm dạo bước thủ đô ngàn năm văn hiến',
    tips: [
      {
        icon: <Clock className="w-4 h-4 text-sky-600" />,
        title: 'Phố đi bộ cuối tuần',
        desc: 'Không gian quanh Hồ Gươm trở thành phố đi bộ từ tối thứ Sáu đến hết Chủ nhật với nhiều hoạt động văn hóa nghệ thuật.',
      },
      {
        icon: <Shirt className="w-4 h-4 text-emerald-600" />,
        title: 'Trang phục trang nhã',
        desc: 'Nên mặc trang phục lịch sự, kín đáo khi vào viếng Lăng Bác, Văn Miếu Quốc Tử Giám và các ngôi chùa cổ tự.',
      },
      {
        icon: <Utensils className="w-4 h-4 text-amber-600" />,
        title: 'Tinh hoa ẩm thực',
        desc: 'Phở bò gia truyền Bát Đàn, bún chả que tre, chả cá Lã Vọng và nhâm nhi cà phê trứng Giảng trứ danh.',
      },
    ],
  },
  DD0005: {
    // Hội An
    subtitle: 'Mẹo lưu giữ khoảnh khắc đẹp nhất phố cổ',
    tips: [
      {
        icon: <Clock className="w-4 h-4 text-sky-600" />,
        title: 'Phố cổ lên đèn',
        desc: 'Khoảng từ 17:30 – 21:30 là lúc những ngọn đèn lồng lung linh nhất, lý tưởng để thả hoa đăng trên sông Hoài.',
      },
      {
        icon: <Shirt className="w-4 h-4 text-emerald-600" />,
        title: 'Tông màu nổi bật',
        desc: 'Trang phục tông trắng, vàng cổ điển hoặc áo dài truyền thống rất nổi bật khi chụp ảnh bên tường vàng và giàn hoa giấy.',
      },
      {
        icon: <Utensils className="w-4 h-4 text-amber-600" />,
        title: 'Món ngon nức tiếng',
        desc: 'Cao lầu sợi dai giòn, cơm gà Hội An, bánh bao bánh vạc (hoa hồng trắng) và bánh mì kẹp đậm đà.',
      },
    ],
  },
  DD0006: {
    // Ninh Bình
    subtitle: 'Hành trình khám phá non nước di sản kỳ vĩ',
    tips: [
      {
        icon: <Clock className="w-4 h-4 text-sky-600" />,
        title: 'Đi thuyền sớm',
        desc: 'Nên bắt đầu chuyến đò Tràng An hoặc Tam Cốc từ 07:30 – 08:30 để ngắm dòng sông phẳng lặng, tĩnh tâm và tránh nắng.',
      },
      {
        icon: <Shirt className="w-4 h-4 text-emerald-600" />,
        title: 'Giày bám tốt & Mũ nón',
        desc: 'Mang giày thể thao chống trượt để chinh phục gần 500 bậc đá đỉnh Hang Múa và ô/dù che nắng khi ngồi thuyền đò.',
      },
      {
        icon: <Utensils className="w-4 h-4 text-amber-600" />,
        title: 'Đặc sản cố đô',
        desc: 'Thịt dê núi tái chanh chấm tương gừng, cơm cháy giòn rụm sốt dê và ốc núi luộc gừng sả.',
      },
    ],
  },
  DD0007: {
    // Phan Thiết
    subtitle: 'Bí kíp chinh phục xứ sở đồi cát và biển xanh',
    tips: [
      {
        icon: <Clock className="w-4 h-4 text-sky-600" />,
        title: 'Trượt cát sáng sớm',
        desc: 'Thời điểm thích hợp nhất để đi Đồi Cát Bay hoặc Bàu Trắng là 05:30 – 08:00 sáng trước khi cát bị mặt trời nung nóng.',
      },
      {
        icon: <Shirt className="w-4 h-4 text-emerald-600" />,
        title: 'Bảo vệ da & Mắt',
        desc: 'Kính râm chống lóa cát, kem chống nắng phổ rộng, mũ rộng vành và dép có quai tiện tháo khi đi chân trần trên cát.',
      },
      {
        icon: <Utensils className="w-4 h-4 text-amber-600" />,
        title: 'Hải sản & Bánh xèo',
        desc: 'Lẩu thả Mũi Né tươi ngọt, bánh căn Phan Thiết, gỏi cá mai và các món ốc biển nướng mỡ hành dọc bờ kè.',
      },
    ],
  },
  DD0008: {
    // Phú Quốc
    subtitle: 'Kinh nghiệm du hí đảo ngọc thiên đường',
    tips: [
      {
        icon: <Clock className="w-4 h-4 text-sky-600" />,
        title: 'Mùa biển đẹp nhất',
        desc: 'Từ tháng 11 đến tháng 4 năm sau là mùa khô, mặt biển êm đềm như ngọc bích, nước trong vắt nhìn thấy đáy san hô.',
      },
      {
        icon: <Shirt className="w-4 h-4 text-emerald-600" />,
        title: 'Hành trang đi tour đảo',
        desc: 'Túi chống nước điện thoại, kính lặn ống thở cá nhân, kem chống nắng an toàn cho rạn san hô và đồ bơi sắc màu.',
      },
      {
        icon: <Utensils className="w-4 h-4 text-amber-600" />,
        title: 'Đặc sản đảo ngọc',
        desc: 'Gỏi cá trích cuốn bánh tráng rau rừng, bún quậy trứ danh, nhum biển nướng trứng và ghẹ Hàm Ninh tươi ngọt.',
      },
    ],
  },
  DD0009: {
    // Sapa / Fansipan
    subtitle: 'Cẩm nang chinh phục Nóc nhà Đông Dương & Bản làng',
    tips: [
      {
        icon: <Clock className="w-4 h-4 text-sky-600" />,
        title: 'Thời điểm lên đỉnh Fansipan',
        desc: 'Nên đi cáp treo lên đỉnh Fansipan vào buổi sáng (08:30 – 11:00) khi trời tan bớt sương mù, cơ hội ngắm biển mây cao nhất.',
      },
      {
        icon: <Shirt className="w-4 h-4 text-emerald-600" />,
        title: 'Giữ ấm nhiều lớp',
        desc: 'Đỉnh núi cao 3.143m có nhiệt độ thấp hơn thị trấn từ 8 – 10°C và gió mạnh. Cần áo ấm cản gió, găng tay và giày leo núi êm chân.',
      },
      {
        icon: <Utensils className="w-4 h-4 text-amber-600" />,
        title: 'Hương vị Tây Bắc',
        desc: 'Thưởng thức lẩu cá tầm/cá hồi tươi, lợn cắp nách nướng than hoa, gà đen hầm thuốc bắc và đồ nướng chợ đêm Sapa.',
      },
    ],
  },
  DD0010: {
    // Vịnh Hạ Long
    subtitle: 'Bí quyết khám phá kỳ quan thiên nhiên thế giới',
    tips: [
      {
        icon: <Clock className="w-4 h-4 text-sky-600" />,
        title: 'Bình minh & Hoàng hôn vịnh',
        desc: 'Trải nghiệm du thuyền ngắm hoàng hôn đỏ rực buông xuống những đảo đá vôi và tập Thái Cực Quyền đón bình minh trên boong tàu.',
      },
      {
        icon: <Shirt className="w-4 h-4 text-emerald-600" />,
        title: 'Giày chống trượt',
        desc: 'Nên mang giày thể thao có độ ma sát tốt khi leo các bậc thang đá ẩm ướt trong hang Sửng Sốt, hang Đầu Gỗ hay đỉnh Ti Tốp.',
      },
      {
        icon: <Utensils className="w-4 h-4 text-amber-600" />,
        title: 'Đặc sản vịnh biển',
        desc: 'Chả mực Hạ Long giã tay ăn kèm bánh cuốn nóng, sá sùng xào cần tỏi, sam biển và cháo hà ngọt đậm vị biển.',
      },
    ],
  },
};

const LocationSidebar = ({
  location = {},
  onOpenMap,
  onOpenHotelsModal,
  onOpenAttractionsModal,
}) => {
  const locId = location.maDiaDiem || location.id;

  const currentGuide = useMemo(() => {
    if (locId && DESTINATION_TIPS[locId]) {
      return DESTINATION_TIPS[locId];
    }
    return {
      subtitle: `Kinh nghiệm khám phá ${location.ten || 'địa danh'} trọn vẹn`,
      tips: [
        {
          icon: <Clock className="w-4 h-4 text-sky-600" />,
          title: 'Thời điểm lý tưởng',
          desc: `Thời gian đẹp nhất để ghé thăm là ${location.thoiDiemLyTuong || 'quanh năm'}, thời tiết thuận lợi cho các hoạt động ngoài trời.`,
        },
        {
          icon: <Shirt className="w-4 h-4 text-emerald-600" />,
          title: 'Trang phục & Hành trang',
          desc: `Chuẩn bị trang phục phù hợp với đặc trưng địa hình (${location.quyMo || 'danh thắng'}), mang giày êm chân và nón mũ che nắng.`,
        },
        {
          icon: <Utensils className="w-4 h-4 text-amber-600" />,
          title: 'Trải nghiệm & Ẩm thực',
          desc: `Khám phá các loại hình ${Array.isArray(location.loaiHinh) ? location.loaiHinh.join(', ') : 'du lịch tiêu biểu'} và thưởng thức món ngon đặc sản địa phương.`,
        },
      ],
    };
  }, [locId, location.ten, location.thoiDiemLyTuong, location.quyMo, location.loaiHinh]);

  const attractionsCount = location.attractions?.length || location.totalAttractions || 0;
  const hotelsCount = location.hotels?.length || location.totalHotels || 0;

  return (
    <div className="w-full lg:w-80 flex-shrink-0">
      <div className="sticky top-24 flex flex-col gap-6">
        {/* Bản đồ mini */}
        <div
          onClick={onOpenMap}
          className="bg-sky-50 rounded-3xl p-5 cursor-pointer shadow-sm hover:shadow-md transition border border-sky-100 group"
        >
          <div className="flex justify-between items-center text-sm font-semibold text-sky-900 mb-3">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-sky-600" />
              Tọa độ GPS:
            </span>
            <span className="text-xs font-mono text-sky-700">
              {location.viDo ? `${location.viDo.toFixed(3)}°, ${location.kinhDo.toFixed(3)}°` : 'Bấm để xem'}
            </span>
          </div>

          <div className="bg-gradient-to-br from-sky-400 to-sky-600 h-36 rounded-2xl flex flex-col items-center justify-center text-white font-bold mb-4 relative overflow-hidden shadow-inner group-hover:scale-[1.02] transition-transform">
            <MapPin className="w-8 h-8 mb-1 animate-bounce" />
            <span className="text-sm">Mở Bản đồ tương tác</span>
            <span className="text-[11px] font-normal opacity-90">Xem vị trí &amp; chỉ đường</span>
          </div>

          <div className="text-sm text-slate-700 space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Mùa du lịch đẹp:
              </span>
              <span className="font-bold text-xs text-slate-800">
                {location.thoiDiemLyTuong || 'Quanh năm'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-slate-400" />
                Khu vực:
              </span>
              <span className="font-bold text-xs text-slate-800">
                {location.tinhThanh}
              </span>
            </div>
          </div>
        </div>

        {/* Cẩm nang & Mẹo khám phá điểm đến */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Cẩm nang du lịch {location.ten}
            </h3>
          </div>
          <p className="text-xs text-slate-500 mb-5 leading-relaxed">
            {currentGuide.subtitle}
          </p>

          <div className="space-y-4">
            {currentGuide.tips.map((tip, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="mt-0.5 w-6 h-6 rounded-lg bg-sky-50 flex items-center justify-center shrink-0">
                  {tip.icon}
                </div>
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-bold text-slate-800 mb-0.5">
                    {tip.title}
                  </div>
                  <div className="text-xs text-slate-500 leading-relaxed">
                    {tip.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-5 mt-5 border-t border-slate-100 flex flex-col gap-2.5">
            <button
              type="button"
              onClick={onOpenAttractionsModal}
              className="w-full bg-sky-600 hover:bg-sky-700 text-white py-3 rounded-2xl font-bold text-xs sm:text-sm transition shadow-sm cursor-pointer flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4" />
              <span>Xem {attractionsCount} điểm tham quan</span>
            </button>

            <button
              type="button"
              onClick={onOpenHotelsModal}
              className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 py-2.5 rounded-2xl font-semibold text-xs sm:text-sm transition cursor-pointer border border-slate-200 flex items-center justify-center gap-2"
            >
              <Building className="w-4 h-4 text-teal-600" />
              <span>Gợi ý {hotelsCount} khách sạn lưu trú</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationSidebar;
