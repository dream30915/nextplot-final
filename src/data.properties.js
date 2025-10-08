// Added NP006 (Bangna) for visual parity with mock + previous 5
export const properties = [
  {
    id:'NP006',
    code:'NP006',
    title:{
      th:'ที่ดินบางนา กรุงเทพมหานคร 2 ไร่ 2 งาน',
      en:'Bangna Bangkok Land 2 Rai 2 Ngan',
      zh:'曼谷邦纳土地 2 莱 2 岸'
    },
    location:{
      th:'บางนา กรุงเทพมหานคร',
      en:'Bangna, Bangkok',
      zh:'曼谷 邦纳'
    },
    price:15000000,
    currency:'THB',
    areaRai:2.5,           // 2 ไร่ 2 งาน = 2.5 ไร่
    areaSqm:2.5*1600,
    status:'available',
    zoning:{
      th:'สีเหลือง', en:'Yellow', zh:'黄色',
      color:'#FFD700',
      note:{ th:'ที่อยู่อาศัยหนาแน่นน้อย', en:'Low density residential', zh:'低密度住宅' }
    },
    tags:{
      th:['ใกล้ถนนใหญ่','เหมาะลงทุน','โฉนดพร้อม'],
      en:['Near main road','Investment','Title deed'],
      zh:['临主路','投资','产权证']
    },
    media:[
      'https://images.unsplash.com/photo-1464822759844-d150ad6082ba?w=800&auto=format&fit=crop&q=70',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop&q=70'
    ]
  },
  {
    id:'NP001',
    code:'NP001',
    title:{ th:'ที่ดินปลวกแดง ระยอง 3.5 ไร่', en:'Land Pluak Daeng Rayong 3.5 Rai', zh:'罗勇 Pluak Daeng 土地 3.5 莱' },
    location:{ th:'ปลวกแดง, ระยอง', en:'Pluak Daeng, Rayong', zh:'罗勇 Pluak Daeng' },
    price:5200000, currency:'THB',
    areaRai:3.5, areaSqm:3.5*1600,
    status:'available',
    zoning:{
      th:'สีชมพู', en:'Pink', zh:'粉色',
      color:'#FFC0CB',
      note:{ th:'คลังสินค้า / โลจิสติกส์', en:'Warehouse / Logistics', zh:'仓储 / 物流' }
    },
    tags:{ th:['ลงทุน','ใกล้ถนนใหญ่'], en:['Investment','Near main road'], zh:['投资','临主路'] },
    media:[
      'https://images.unsplash.com/photo-1472145246862-b24cf25c4a36?w=800&auto=format&fit=crop&q=70',
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=70'
    ]
  },
  {
    id:'NP002',
    code:'NP002',
    title:{ th:'ที่ดินบ่อวิน ชลบุรี 2 ไร่', en:'Land Bo Win Chonburi 2 Rai', zh:'春武里 Bo Win 土地 2 莱' },
    location:{ th:'บ่อวิน, ชลบุรี', en:'Bo Win, Chonburi', zh:'春武里 Bo Win' },
    price:7800000, currency:'THB',
    areaRai:2.0, areaSqm:2.0*1600,
    status:'available',
    zoning:{
      th:'สีม่วงอ่อน', en:'Light Purple', zh:'淡紫色',
      color:'#B19CD9',
      note:{ th:'อุตสาหกรรมกึ่งพาณิชย์', en:'Semi‑industrial', zh:'轻工业/商用' }
    },
    tags:{ th:['เชิงพาณิชย์'], en:['Commercial'], zh:['商业'] },
    media:[
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&auto=format&fit=crop&q=70',
      'https://images.unsplash.com/photo-1464822759844-d150ad6082ba?w=800&auto=format&fit=crop&q=70'
    ]
  },
  {
    id:'NP003',
    code:'NP003',
    title:{ th:'ที่ดินปลวกแดง ระยอง 1.25 ไร่ (จอง)', en:'Pluak Daeng Rayong 1.25 Rai (Reserved)', zh:'罗勇 Pluak Daeng 1.25 莱 (预订)' },
    location:{ th:'ปลวกแดง, ระยอง', en:'Pluak Daeng, Rayong', zh:'罗勇 Pluak Daeng' },
    price:3500000, currency:'THB',
    areaRai:1.25, areaSqm:1.25*1600,
    status:'reserved',
    zoning:{
      th:'สีน้ำตาล', en:'Brown', zh:'棕色',
      color:'#8B4513',
      note:{ th:'ผสมพาณิชย์หนาแน่น', en:'High density mixed commercial', zh:'高密度混合商业' }
    },
    tags:{ th:['ใกล้ชุมชน','คุ้มค่า'], en:['Near community','Value'], zh:['近社区','划算'] },
    media:[
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop&q=70'
    ]
  },
  {
    id:'NP004',
    code:'NP004',
    title:{ th:'ที่ดินวิวสวย เหมาะทำรีสอร์ท 5 ไร่', en:'Scenic Plot 5 Rai (Resort Potential)', zh:'景观地块 5 莱 适合度假村' },
    location:{ th:'ปลวกแดง, ระยอง', en:'Pluak Daeng, Rayong', zh:'罗勇 Pluak Daeng' },
    price:12500000, currency:'THB',
    areaRai:5.0, areaSqm:5.0*1600,
    status:'available',
    zoning:{
      th:'สีเขียว', en:'Green', zh:'绿色',
      color:'#228B22',
      note:{ th:'อนุรักษ์/พักผ่อน', en:'Conservation / Leisure', zh:'保育 / 休闲' }
    },
    tags:{ th:['วิวสวย','เหมาะทำรีสอร์ท'], en:['Scenic','Resort potential'], zh:['景观好','适合度假村'] },
    media:[
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&auto=format&fit=crop&q=70'
    ]
  },
  {
    id:'NP005',
    code:'NP005',
    title:{ th:'ที่ดินราคาพิเศษ 0.75 ไร่ (ขายแล้ว)', en:'Special Price 0.75 Rai (Sold)', zh:'特价 0.75 莱 (已售)' },
    location:{ th:'ปลวกแดง, ระยอง', en:'Pluak Daeng, Rayong', zh:'罗勇 Pluak Daeng' },
    price:2800000, currency:'THB',
    areaRai:0.75, areaSqm:0.75*1600,
    status:'sold',
    zoning:{
      th:'สีเหลือง', en:'Yellow', zh:'黄色',
      color:'#FFD700',
      note:{ th:'ที่อยู่อาศัยหนาแน่นน้อย', en:'Low density residential', zh:'低密度住宅' }
    },
    tags:{ th:['ราคาพิเศษ'], en:['Special price'], zh:['特价'] },
    media:[
      'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?w=800&auto=format&fit=crop&q=70'
    ],
    is_sensitive:false
  }
]
