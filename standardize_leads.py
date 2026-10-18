import json
from collections import Counter

SECTORS_16 = [
    "1. مصانع النبيذ والكروم والجعة والتقطير وعصير التفاح المخمر",
    "2. الفنادق والمنتجعات والنُزل ومرافق الإقامة السياحية",
    "3. صالات المناسبات والاحتفالات وأماكن الزفاف والمزارع",
    "4. جامعة كالفورنيا بوليتكنيك والكليات والمنظمات الطلابية",
    "5. المدارس ومناطق التعليم والمؤسسات الأكاديمية K-12",
    "6. الشركات والمكاتب المهنية والتقنية والمصرفية وغرف التجارة",
    "7. المستشفيات والمراكز الطبية ومرافق رعاية كبار السن والتأهيل",
    "8. شركات المقاولات والإنشاءات والهندسة المدنية والتصنيع",
    "9. وكلاء ومعارض وتوكيلات السيارات ومراكز الصيانة",
    "10. الأندية والفرق الرياضية والمراكز والبطولات واللياقة البدنية",
    "11. الجمعيات الخيرية والمنظمات غير الربحية والنوادي الخدمية",
    "12. الكنائس والمراكز الدينية والمجتمعات الروحية",
    "13. المجمعات السكنية وسكن الطلاب ومكاتب العقارات وإدارة الأملاك",
    "14. منظمو جولات النبيذ والحافلات والخدمات اللوجستية ومرافق الطيران",
    "15. المسارح والمتاحف ومراكز الفنون والترفيه الثقافي",
    "16. الهيئات الحكومية والخدمات البلدية والمرافق العامة ومراكز الإطفاء"
]

def map_sector(lead):
    old_sec = lead.get('Sector', '')
    bname = lead.get('Business_Name', '').lower()
    
    # Keyword & old sector matching
    if any(k in old_sec for k in ['نبيذ', 'جعة', 'تقطير', 'كروم']) and not any(k in old_sec for k in ['جولات', 'أعراس', 'زفاف']):
        if 'wedding' in bname or 'farm' in bname or 'barn' in bname or 'ranch' in bname:
            if 'rava' in bname:
                return SECTORS_16[2] # Rava Events
        return SECTORS_16[0]
    
    if any(k in old_sec for k in ['فنادق', 'نُزل', 'ضيافة', 'إقامة', 'منتجعات']):
        return SECTORS_16[1]
        
    if any(k in old_sec for k in ['أعراس', 'زفاف', 'صالات المناسبات']):
        return SECTORS_16[2]
        
    if any(k in old_sec for k in ['cal poly', 'كليات cal poly', 'اتحادات الطلاب']) or 'cal poly' in bname:
        if any(k in bname for k in ['athletics', 'baseball', 'sports']):
            return SECTORS_16[9]
        return SECTORS_16[3]
        
    if any(k in old_sec for k in ['مدارس', 'تعليم', 'k-12', 'حضانات']):
        if 'cuesta' in bname:
            if 'athletics' in bname:
                return SECTORS_16[9]
            return SECTORS_16[3] # College
        return SECTORS_16[4]
        
    if any(k in old_sec for k in ['شركات', 'مكاتب مهنية', 'محاسبة', 'محاماة', 'تقنية', 'مصرفية']):
        return SECTORS_16[5]
        
    if any(k in old_sec for k in ['مستشفيات', 'عيادات', 'كبار السن', 'طبية']):
        return SECTORS_16[6]
        
    if any(k in old_sec for k in ['بناء', 'مقاولات', 'إنشاءات', 'مدنية', 'تصنيع']):
        return SECTORS_16[7]
        
    if any(k in old_sec for k in ['سيارات', 'وكلاء']):
        return SECTORS_16[8]
        
    if any(k in old_sec for k in ['أندية', 'فرق رياضية', 'لياقة', 'جمباز', 'سباحة', 'غولف', 'golf']):
        return SECTORS_16[9]
        
    if any(k in old_sec for k in ['جمعيات خيرية', 'نوادي خدمية', 'منظمات غير ربحية', 'روتاري', 'rotary']):
        return SECTORS_16[10]
        
    if any(k in old_sec for k in ['كنائس', 'دينية']):
        return SECTORS_16[11]
        
    if any(k in old_sec for k in ['عقارات', 'أملاك', 'سكن']):
        return SECTORS_16[12]
        
    if any(k in old_sec for k in ['جولات النبيذ', 'حافلات', 'طيران', 'ليموزين']):
        return SECTORS_16[13]
        
    if any(k in old_sec for k in ['مسارح', 'متاحف', 'ترفيه', 'فنون']):
        return SECTORS_16[14]
        
    if any(k in old_sec for k in ['حكومية', 'بلدية', 'مرافق', 'إطفاء', 'csd', 'حدائق']):
        return SECTORS_16[15]
        
    # Default fallback inspection
    if 'rotary' in bname:
        return SECTORS_16[10]
    if 'church' in bname or 'mission' in bname:
        if 'school' in bname:
            return SECTORS_16[4]
        return SECTORS_16[11]
    if 'realt' in bname or 'haven' in bname:
        return SECTORS_16[12]
    if 'csd' in bname or 'services district' in bname or 'city of' in bname or 'county' in bname:
        return SECTORS_16[15]
        
    return old_sec

with open('/home/user/ECC/verified_leads.json', 'r', encoding='utf-8') as f:
    leads = json.load(f)

for lead in leads:
    lead['Sector'] = map_sector(lead)
    
    # Standardize Email_Type
    email = lead['Email'].lower().strip()
    if any(webmail in email for webmail in ['@gmail.com', '@yahoo.com', '@hotmail.com', '@outlook.com', '@aol.com']):
        lead['Email_Type'] = "بريد إلكتروني عام موثّق (Public Webmail Verified)"
    else:
        lead['Email_Type'] = "نطاق مؤسسي رسمي (Official Domain)"
        
    # Standardize Verification_Status
    src = lead.get('Email_Source_URL', '').lower()
    if any(gov in src for gov in ['cde.ca.gov', 'slocoe.org', 'calwarn.com', 'chamber', 'socalswim.org', 'playclubsoccer.org']):
        lead['Verification_Status'] = "موثّق من دليل عام أو سجّل حكومي موثوق"
    else:
        lead['Verification_Status'] = "موثّق من الموقع الرسمي للجهة"

sectors_cnt = Counter(l['Sector'] for l in leads)
print("Sector distribution across 16 sectors:")
for s in SECTORS_16:
    print(f"  {s}: {sectors_cnt.get(s, 0)}")

with open('/home/user/ECC/verified_leads.json', 'w', encoding='utf-8') as f:
    json.dump(leads, f, ensure_ascii=False, indent=2)

print("\nSuccessfully standardized verified_leads.json!")
