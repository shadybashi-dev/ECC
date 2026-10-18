# reclassify_exact_16.py
import json
from collections import Counter

SECTORS = {
    1: "1. مصانع النبيذ والكروم والجعة والتقطير وعصير التفاح المخمر",
    2: "2. الفنادق والمنتجعات والنُزل ومرافق الإقامة السياحية",
    3: "3. صالات المناسبات والاحتفالات وأماكن الزفاف والمزارع",
    4: "4. جامعة كالفورنيا بوليتكنيك والكليات والمنظمات الطلابية",
    5: "5. المدارس ومناطق التعليم والمؤسسات الأكاديمية K-12",
    6: "6. الشركات والمكاتب المهنية والتقنية والمصرفية وغرف التجارة",
    7: "7. المستشفيات والمراكز الطبية ومرافق رعاية كبار السن والتأهيل",
    8: "8. شركات المقاولات والإنشاءات والهندسة المدنية والتصنيع",
    9: "9. وكلاء ومعارض وتوكيلات السيارات ومراكز الصيانة",
    10: "10. الأندية والفرق الرياضية والمراكز والبطولات واللياقة البدنية",
    11: "11. الجمعيات الخيرية والمنظمات غير الربحية والنوادي الخدمية",
    12: "12. الكنائس والمراكز الدينية والمجتمعات الروحية",
    13: "13. المجمعات السكنية وسكن الطلاب ومكاتب العقارات وإدارة الأملاك",
    14: "14. منظمو جولات النبيذ والحافلات والخدمات اللوجستية ومرافق الطيران",
    15: "15. المسارح والمتاحف ومراكز الفنون والترفيه الثقافي",
    16: "16. الهيئات الحكومية والخدمات البلدية والمرافق العامة ومراكز الإطفاء"
}

with open('/home/user/ECC/verified_leads.json', 'r', encoding='utf-8') as f:
    leads = json.load(f)

for lead in leads:
    bn = lead['Business_Name'].strip()
    bn_lower = bn.lower()
    
    # 8. Construction, Contractors, Civil Engineering, Manufacturing
    if any(k in bn_lower for k in [
        'wallace group', 'specialty construction', 'cannon corp', 'cannon (cannoncorp)',
        'jw design', 'central pacific construction', 'ward custom construction'
    ]):
        lead['Sector'] = SECTORS[8]
        continue

    # 7. Healthcare, Hospitals, Physical Therapy, Mental Health, Senior Living
    if any(k in bn_lower for k in [
        'adventist health', 'twin cities community hospital', 'arroyo grande community hospital',
        'french hospital medical center', 'community health centers of the central coast',
        'avila senior living', 'compass health', 'the oaks at paso robles', 'the village at sydney creek',
        'the villages of san luis obispo', 'movement for life', 'san luis sports therapy'
    ]) and 'foundation' not in bn_lower:
        lead['Sector'] = SECTORS[7]
        continue

    # 11. Charities, Non-Profits, Service Clubs (Rotary, Kiwanis, Elks, CAPSLO, Land Conservancy)
    if any(k in bn_lower for k in [
        'rotary', 'kiwanis', 'elks', 'capslo', 'community action partnership', 'land conservancy',
        'slo food bank', 'united way', 'casa of san luis obispo', 'woods humane society',
        'slo county ymca', 'san luis obispo ymca', 'the community foundation', 'hospital foundation',
        'must! charities', 'transitions-mental health', 'tmha'
    ]):
        lead['Sector'] = SECTORS[11]
        continue

    # 6. Corporate, Professional, Tech, Banking, Chambers of Commerce, Farm Bureau
    if any(k in bn_lower for k in [
        'chamber of commerce', 'chamber', 'farm bureau', 'mindbody', 'glenn burdette',
        'andre, morris', 'ammcg law', 'sesloc', 'coasthills', 'rrm design group', 'rec solar',
        'arris studio', 'delmiaworks', 'ifixit', 'studio design group', 'ten over studio',
        'downtown slo', 'main street', 'travel paso', 'paso robles wine country alliance',
        'trust automation', 'meathead movers - careers'
    ]):
        lead['Sector'] = SECTORS[6]
        continue

    # 14. Wine Tours, Shuttles, Regional Logistics & Aviation
    if any(k in bn_lower for k in [
        'toast tours', 'grapeline wine tours', 'regional transit authority', 'rta',
        'airport', 'aci jet', 'meathead movers'
    ]):
        lead['Sector'] = SECTORS[14]
        continue

    # 9. Auto Dealerships & Service Centers
    if any(k in bn_lower for k in [
        'chevrolet', 'ford', 'honda', 'toyota', 'chrysler', 'dodge', 'jeep', 'ram', 'subaru'
    ]):
        lead['Sector'] = SECTORS[9]
        continue

    # 10. Sports Clubs, Gyms, Golf, Booster Clubs, Youth Sports
    if any(k in bn_lower for k in [
        'booster', 'athletic boost', 'kennedy club fitness', 'central coast gymnastics',
        'central coast united', 'swim club', 'country club', 'golf', 'the pad climbing',
        'performance athletics', 'tennis', 'youth baseball', 'soccer', 'ayso',
        'sports club'
    ]) and not any(k in bn_lower for k in ['cal poly', 'cuesta']):
        lead['Sector'] = SECTORS[10]
        continue

    # 4. Cal Poly & Cuesta Colleges (Academic, Sports Clubs, Student Orgs, ASCE, IEEE, SWE, Teams)
    if 'cal poly' in bn_lower or 'cuesta' in bn_lower:
        lead['Sector'] = SECTORS[4]
        continue

    # 5. K-12 Schools & Districts
    if any(k in bn_lower for k in [
        'school', 'unified', 'elementary', 'middle school', 'high school', 'academy', 'district'
    ]) and not any(k in bn_lower for k in ['community services district', 'csd', 'booster', 'cal poly', 'cuesta', 'harbor']):
        lead['Sector'] = SECTORS[5]
        continue

    # 3. Wedding Venues & Event Ranches
    if any(k in bn_lower for k in [
        'greengate', 'octagon barn', 'villa san-juliette', 'flying caballos', 'higuera ranch',
        'historic santa margarita ranch', 'la lomita ranch', 'oyster ridge', 'rava wines',
        'south county conference & event center', 'spreafico farms', 'terra mia',
        'the backyard on thirteenth', 'the penny', 'white barn', 'all about events',
        'special events'
    ]):
        lead['Sector'] = SECTORS[3]
        continue

    # 2. Hotels & Lodging
    if any(k in bn_lower for k in [
        'hotel', 'inn', 'resort', 'motel', 'suites', 'lofts', 'cass house', 'the cliffs',
        'seacrest oceanfront', 'dolphin bay', 'vespera resort'
    ]):
        lead['Sector'] = SECTORS[2]
        continue

    # 1. Wineries, Breweries, Distilleries, Cideries
    if any(k in bn_lower for k in [
        'winery', 'vineyard', 'cellars', 'brewing', 'brewery', 'brewhouse', 'distillery',
        'cider', 'wines', 'pour house', 'firestone', 'tooth & nail', 'barrelhouse', 'liquid gravity',
        'slo brew', 'there does not exist', 'humdinger', 're:find', 'peachy canyon', 'eberle',
        'robert hall', 'vina robles', 'niner', 'ancient peaks', 'hope family', 'epoch', 'booker',
        'l\'aventure', 'denner', 'herman story', 'daou', 'justin', 'j. lohr', 'tablas creek',
        'tobin james', 'opolo', 'halter ranch', 'sculpterra', 'brecon', 'calcareous', 'grey wolf',
        'biddle ranch', 'tolosa', 'claiborne', 'talley', 'chamisal', 'wolff', 'sextant',
        'shadow run', 'still waters', 'turley', 'lone madrone', 'caliza', 'thacher'
    ]):
        lead['Sector'] = SECTORS[1]
        continue

    # 12. Churches & Religious Communities
    if any(k in bn_lower for k in [
        'church', 'mission', 'parish', 'congregational', 'nazarene', 'lutheran', 'catholic'
    ]):
        lead['Sector'] = SECTORS[12]
        continue

    # 13. Residential Communities & Real Estate
    if any(k in bn_lower for k in [
        'apartments', 'realty', 're/max', 'haven properties', 'sotheby', 'farrell smyth',
        'housing', 'mustang village'
    ]):
        lead['Sector'] = SECTORS[13]
        continue

    # 15. Theaters, Museums, Culture & Arts
    if any(k in bn_lower for k in [
        'museum', 'theatre', 'theater', 'symphony', 'arts', 'aquarium', 'lighthouse', 'festival'
    ]):
        lead['Sector'] = SECTORS[15]
        continue

    # 16. Municipal, Government, CSD, Fire Department, Police
    if any(k in bn_lower for k in [
        'city of', 'county of', 'department of', 'csd', 'services district', 'fire', 'police',
        'caltrans', 'harbor district', 'public works', 'planning & building'
    ]):
        lead['Sector'] = SECTORS[16]
        continue

# Standardize Email_Type and Verification_Status
for lead in leads:
    email = lead['Email'].lower().strip()
    if any(webmail in email for webmail in ['@gmail.com', '@yahoo.com', '@hotmail.com', '@outlook.com', '@aol.com']):
        lead['Email_Type'] = "بريد إلكتروني عام موثّق (Public Webmail Verified)"
    else:
        lead['Email_Type'] = "نطاق مؤسسي رسمي (Official Domain)"

    src = lead.get('Email_Source_URL', '').lower()
    if any(gov in src for gov in ['cde.ca.gov', 'slocoe.org', 'calwarn.com', 'chamber', 'socalswim.org', 'playclubsoccer.org']):
        lead['Verification_Status'] = "موثّق من دليل عام أو سجّل حكومي موثوق"
    else:
        lead['Verification_Status'] = "موثّق من الموقع الرسمي للجهة"

cnt = Counter(l['Sector'] for l in leads)
print("=== FINAL 16 SECTOR DISTRIBUTION (Total: {}) ===".format(len(leads)))
for i in range(1, 17):
    s = SECTORS[i]
    print(f"  {s}: {cnt.get(s, 0)}")

with open('/home/user/ECC/verified_leads.json', 'w', encoding='utf-8') as f:
    json.dump(leads, f, ensure_ascii=False, indent=2)

print("\nSaved verified_leads.json successfully!")
