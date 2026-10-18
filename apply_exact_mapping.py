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

def get_exact_sector(bname):
    bn = bname.strip()
    
    # 1. Wineries, Breweries, Cideries, Distilleries
    if any(k in bn for k in [
        "Firestone Walker", "Tooth & Nail", "BarrelHouse", "Liquid Gravity", "Central Coast Brewing",
        "SLO Brewing", "SLO Brew Rock", "Wild Fields Brewhouse", "There Does Not Exist", "Oak and Otter",
        "Humdinger Brewing", "Tin City Cider", "Tin City Distillery", "RE:FIND Distillery", "Grain + Vine Distillery",
        "The Pour House", "Castoro Cellars", "Peachy Canyon", "Eberle Winery", "Robert Hall", "Vina Robles Vineyards",
        "Niner Wine", "Ancient Peaks Winery", "Hope Family Wines", "Epoch Estate", "Booker Vineyard", "L'Aventure",
        "Denner Vineyards", "Herman Story", "DAOU Vineyards", "JUSTIN Vineyards", "J. Lohr", "Tablas Creek",
        "Tobin James", "Opolo Vineyards", "Halter Ranch", "Sculpterra Winery", "Brecon Estate", "Calcareous",
        "Grey Wolf Cellars", "Biddle Ranch", "Tolosa Winery"
    ]) and not any(k in bn for k in ["Amphitheatre", "Events & Private", "Barrel Room", "Oyster Ridge"]):
        return SECTORS[1]

    # 3. Wedding Venues & Event Ranches
    if any(k in bn for k in [
        "All About Events", "Barrel Room", "Flying Caballos", "Higuera Ranch", "Historic Santa Margarita Ranch",
        "La Lomita Ranch", "Oyster Ridge", "Rava Wines", "South County Conference & Event Center",
        "Spreafico Farms", "Terra Mia", "The Backyard on Thirteenth", "The Penny", "White Barn"
    ]):
        return SECTORS[3]

    # 2. Hotels & Lodging
    if any(k in bn for k in [
        "Hotel Cheval", "Hotel San Luis Obispo", "Granada Hotel", "Madonna Inn", "Apple Farm Inn",
        "Adelaide Inn", "Oxford Suites", "La Bellasera", "Allegretto Vineyard Resort", "Paso Robles Inn",
        "The Piccolo", "SLO Brew Lofts"
    ]):
        return SECTORS[2]

    # 4. Cal Poly & Colleges
    if any(k in bn for k in [
        "Cal Poly Orfalea", "Cal Poly College of Engineering", "Cal Poly Computer Science", "Cal Poly Alumni",
        "Cal Poly Center for Innovation", "Cal Poly Partners", "Cal Poly University Housing", "Cal Poly Associated Students",
        "Cal Poly ASI Club Services", "Cal Poly ASI Events", "Cal Poly ASI Intramurals", "Cal Poly Racing",
        "Cal Poly Society of Women Engineers", "Cal Poly Vines to Wines", "Cal Poly Fraternity",
        "Cuesta College North County", "Cuesta College Admissions", "Cuesta College (San Luis Obispo Campus)",
        "Cuesta College Community Programs", "Cuesta College Student Life"
    ]):
        return SECTORS[4]

    # 5. K-12 Schools & Districts
    if any(k in bn for k in [
        "Paso Robles High School", "Paso Robles Joint Unified", "San Luis Obispo High School", "San Luis Coastal Unified",
        "Atascadero High School", "Atascadero Middle School", "Atascadero Unified", "Templeton High School",
        "Templeton Middle School", "Templeton Unified", "Arroyo Grande High School", "Lucia Mar Unified",
        "Morro Bay High School", "Coast Union High School", "Coast Unified School District", "San Miguel Joint Union",
        "Creston Elementary", "Lewis Flamson", "Laguna Middle", "Old Mission School", "Almond Acres",
        "Coastal Christian School", "North County Christian", "Mission College Preparatory", "Saint Rose Catholic School",
        "San Luis Obispo Classical Academy", "Bellevue-Santa Fe"
    ]):
        return SECTORS[5]

    # 6. Corporate, Professional, Tech, Banking, Chambers
    if any(k in bn for k in [
        "Mindbody", "Glenn Burdette", "Andre, Morris", "AMMCG Law", "SESLOC Federal Credit Union", "CoastHills Credit Union",
        "RRM Design Group", "REC Solar", "Arris Studio Architects", "DELMIAWorks", "iFixit", "Wallace Group",
        "Studio Design Group", "Ten Over Studio", "San Luis Obispo Chamber", "Paso Robles & Templeton Chamber",
        "South County Chambers", "Morro Bay Chamber", "Pismo Beach Chamber", "Downtown SLO", "Paso Robles Main Street",
        "Paso Robles Wine Country Alliance", "Travel Paso"
    ]):
        return SECTORS[6]

    # 7. Healthcare, Hospitals, Senior Living
    if any(k in bn for k in [
        "Adventist Health Twin Cities", "Twin Cities Community Hospital", "Arroyo Grande Community Hospital",
        "French Hospital Medical Center", "Community Health Centers", "Avila Senior Living", "Compass Health",
        "The Oaks at Paso Robles", "The Village at Sydney Creek", "The Villages of San Luis Obispo"
    ]):
        return SECTORS[7]

    # 8. Construction, Contractors, Civil Engineering
    if any(k in bn for k in [
        "Specialty Construction", "JW Design & Construction", "Cannon (CannonCorp)", "Central Pacific Construction",
        "Ward Custom Construction"
    ]):
        return SECTORS[8]

    # 9. Auto Dealerships & Service Centers
    if any(k in bn for k in [
        "Paso Robles Chevrolet", "Paso Robles Ford", "Sunset Honda", "Toyota San Luis Obispo", "Cole Chrysler"
    ]):
        return SECTORS[9]

    # 10. Sports Clubs, Gyms, Golf, Athletics
    if any(k in bn for k in [
        "Cal Poly Athletics", "Cal Poly Baseball", "Cal Poly Club Sports", "Cal Poly Recreation Center",
        "Cuesta College Athletics", "Kennedy Club Fitness", "Central Coast Gymnastics", "Central Coast United",
        "San Luis Obispo Swim Club", "San Luis Obispo Country Club", "Avila Beach Golf Resort",
        "Cypress Ridge Golf", "Monarch Dunes Golf", "Paso Robles Golf Club", "Sea Pines Golf Resort",
        "The Pad Climbing", "Performance Athletics Gymnastics"
    ]):
        return SECTORS[10]

    # 11. Charities, Non-profits, Rotary, Elks
    if any(k in bn for k in [
        "Rotary Club", "Rotaract", "Elks Lodge", "SLO Food Bank", "United Way", "CASA of San Luis Obispo",
        "Woods Humane Society", "SLO County YMCA", "The Community Foundation", "Hospital Foundation"
    ]):
        return SECTORS[11]

    # 12. Churches & Religious Communities
    if any(k in bn for k in [
        "Trinity Lutheran Church", "Grace Central Coast", "Mountainbrook Church", "Paso Church of the Nazarene",
        "Plymouth Congregational Church", "St. Rose of Lima Catholic Church", "Mission San Luis Obispo de Tolosa"
    ]):
        return SECTORS[12]

    # 13. Residential Communities & Real Estate
    if any(k in bn for k in [
        "Mustang Village", "RE/MAX Parkside", "BHGRE Haven Properties", "Richardson Sotheby", "Farrell Smyth",
        "Oak Park Community Apartments"
    ]):
        return SECTORS[13]

    # 14. Wine Tours, Shuttles, Regional Transit, Airport
    if any(k in bn for k in [
        "Toast Tours", "Grapeline Wine Tours", "San Luis Obispo Regional Transit Authority",
        "San Luis Obispo County Regional Airport"
    ]):
        return SECTORS[14]

    # 15. Theaters, Museums, Culture & Arts
    if any(k in bn for k in [
        "Central Coast Aquarium", "Clark Center", "Estrella Warbirds", "Festival Mozaic", "Morro Bay Maritime Museum",
        "Paso Robles Children's Museum", "Paso Robles Youth Arts Center", "Point San Luis Lighthouse",
        "San Luis Obispo Museum of Art", "San Luis Obispo Repertory Theatre", "San Luis Obispo Symphony"
    ]):
        return SECTORS[15]

    # 16. Municipal, Government, CSD, Fire Department, Police
    if any(k in bn for k in [
        "City of Paso Robles", "City of San Luis Obispo", "City of Atascadero", "City of Arroyo Grande",
        "City of Pismo Beach", "City of Morro Bay", "City of Grover Beach", "Cambria Community Services District",
        "Los Osos Community Services District", "San Miguel Community Services District", "Templeton Community Services District",
        "Nipomo Community Services District", "Oceano Community Services District", "Port San Luis Harbor District",
        "Fire and Emergency", "Fire Department", "Police Department", "Parks and Recreation", "Recreation Division",
        "City Library", "Recreation Services"
    ]):
        return SECTORS[16]

    return SECTORS[16]

with open('/home/user/ECC/verified_leads.json', 'r', encoding='utf-8') as f:
    leads = json.load(f)

for l in leads:
    l['Sector'] = get_exact_sector(l['Business_Name'])

cnt = Counter(l['Sector'] for l in leads)
print("=== PRECISE SECTOR COUNTS (Total: {}) ===".format(len(leads)))
for i in range(1, 17):
    s = SECTORS[i]
    print(f"{s}: {cnt.get(s, 0)}")

with open('/home/user/ECC/verified_leads.json', 'w', encoding='utf-8') as f:
    json.dump(leads, f, ensure_ascii=False, indent=2)

print("\nSaved verified_leads.json successfully!")
