// Supabase API Wrapper (Frontend safe – ใช้เฉพาะ anon key)
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.supabase.js'

// โหลดไลบรารีผ่าน CDN (ESM) – ไม่มี build step
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession:false },
  global: {
    headers: { 'x-client-info':'nextplot-web/remote-fetch-1' }
  }
})

/**
 * ดึงรายการ properties ทั้งหมด (เบื้องต้น: select * )
 * @returns {Promise<{ok:boolean, data:any[], error?:string}>}
 */
export async function fetchProperties(){
  try{
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('code', { ascending:true })
    if(error) return { ok:false, data:[], error:error.message }
    if(!Array.isArray(data)) return { ok:false, data:[], error:'Unexpected response' }
    return { ok:true, data }
  }catch(e){
    return { ok:false, data:[], error:e.message }
  }
}

/**
 * แปลง row จากตาราง -> โครง object ที่ UI ใช้
 * รองรับคอลัมน์ตาม schema ขั้นแรก (ดูด้านล่าง STEP Supabase)
 */
export function mapRow(row){
  // ค่าปลอดภัย fallback
  const safe = (v, fb='') => (v===null || v===undefined ? fb : v)

  return {
    id: safe(row.id, row.code),
    code: safe(row.code,'NO-CODE'),
    title:{
      th: safe(row.title_th,'(ไม่มีชื่อ TH)'),
      en: safe(row.title_en, safe(row.title_th,'(no EN)')),
      zh: safe(row.title_zh, safe(row.title_en, safe(row.title_th,'(无中文)')))
    },
    location:{
      th: safe(row.location_th,''),
      en: safe(row.location_en, safe(row.location_th,'')),
      zh: safe(row.location_zh, safe(row.location_en, safe(row.location_th,'')))
    },
    price: Number(row.price)||0,
    currency: row.currency || 'THB',
    areaRai: Number(row.area_rai)||0,
    areaSqm: Number(row.area_rai||0) * 1600,
    status: row.status || 'available',
    zoning: row.zoning_name_th ? {
      th: row.zoning_name_th,
      en: row.zoning_name_en || row.zoning_name_th,
      zh: row.zoning_name_zh || row.zoning_name_en || row.zoning_name_th,
      color: row.zoning_color || '#777',
      note: {
        th: row.zoning_note_th || '',
        en: row.zoning_note_en || row.zoning_note_th || '',
        zh: row.zoning_note_zh || row.zoning_note_en || row.zoning_note_th || ''
      }
    } : null,
    tags:{
      th: Array.isArray(row.tags_th)?row.tags_th:[],
      en: Array.isArray(row.tags_en)?row.tags_en:[],
      zh: Array.isArray(row.tags_zh)?row.tags_zh:[]
    },
    media: Array.isArray(row.media)? row.media.map(m=>m.src?m.src:m) : [],
    is_sensitive: !!row.is_sensitive
  }
}
