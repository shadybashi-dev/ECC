# -*- coding: utf-8 -*-
import json

with open('/home/user/ECC/verified_leads.json', 'r', encoding='utf-8') as f:
    leads = json.load(f)

print(f"Loaded {len(leads)} leads.")

def enrich_lead(l):
    sec = l.get('Sector', '')
    bname = l.get('Business_Name', '').lower()
    city = l.get('City', '')
    func = l.get('Email_Function', '').lower()
    
    # Defaults
    persona = "Office Manager / Event Coordinator"
    occasion = "اجتماعات العمل والفعاليات المؤسسية الدورية"
    headcount = "20 - 45 فرداً"
    frequency = "شهري دوري"
    aov = "$300 - $750"
    tier = "Tier 2: Recurring Core"
    bundle = "باقة Antonia's Executive Lunch (بيتزا متنوعة، سلطات عائلية، خبز بالثوم، ومشروبات)"
    window = "صباح أيام الثلاثاء والأربعاء (9:30 - 11:00 صباحاً)"

    # Sector 1: Wineries & Breweries
    if "1. مصانع النبيذ" in sec:
        if any(w in bname for w in ["brew", "beer", "ale", "cider"]):
            persona = "Taproom Manager / Production Brewmaster"
            occasion = "وجبات طواقم الإنتاج والتخمير، وفعاليات ليالي العاملين بقطاع الضيافة (Industry Nights)"
            headcount = "15 - 35 فرداً"
            frequency = "نصف شهري / شهري"
            aov = "$250 - $650"
            tier = "Tier 2: Recurring Hospitality"
            bundle = "باقة Brewhouse Crew Fuel (بيتزا لحوم غنية، أجنحة دجاج مقرمشة، سلطة سيزر، ومشروبات)"
            window = "صباح أيام الثلاثاء والخميس"
        else:
            persona = "Tasting Room Manager / Hospitality Director / Cellar Master"
            occasion = "وجبات طواقم الحصاد الميداني (Harvest Crew Meals) وعطلات إطلاق نادي النبيذ واجتماعات موظفي الضيافة"
            headcount = "20 - 55 فرداً"
            frequency = "أسبوعي مكثف خلال الحصاد (أغسطس - نوفمبر) / شهري في باقي العام"
            aov = "$350 - $950"
            tier = "Tier 1: VIP Seasonal Surge"
            bundle = "باقة Vineyard Harvest & Tasting Room Feast (بيتزا حرفية غنية، سلطة كابريزي طازجة، سلطات مشكلة، ومياه إيطالية غازية)"
            window = "منتصف يوليو حتى أغسطس (موسم ما قبل الحصاد) وأبريل (عطلات الربيع)"

    # Sector 2: Hotels & Lodging
    elif "2. الفنادق" in sec:
        persona = "Guest Experience Director / Sales & Catering Manager / Concierge Lead"
        occasion = "وجبات تقدير طواقم الفندق الدورية، تموين مجموعات النزلاء الخاصة، وحفلات المسبح وتغطية المناسبات عند انشغال مطابخ الفندق"
        headcount = "25 - 65 فرداً"
        frequency = "شهري دوري / وحسب حجوزات الأفواج السياحية"
        aov = "$400 - $1,250"
        tier = "Tier 1: Strategic Hospitality Partner"
        bundle = "باقة Hospitality Excellence Platter (تشكيلة بيتزا نابولية فاخرة، مقبلات أنتيباستو إيطالية، سلطات موسمية، وحلوى كانولي)"
        window = "صباح أيام الثلاثاء والأربعاء (10:00 - 11:30 صباحاً)"

    # Sector 3: Wedding Venues & Ranches
    elif "3. صالات المناسبات" in sec:
        persona = "Venue Owner / Wedding & Private Event Director"
        occasion = "وجبات طواقم العمل في ليلة العرس (Vendor Meals: المصورين ومنسقي الموسيقى)، وحفلات عشاء البروفة الريفية (Rehearsal Dinners)"
        headcount = "30 - 100 فرد"
        frequency = "أسبوعي خلال ذروة موسم الأعراس (مايو إلى أكتوبر)"
        aov = "$500 - $2,200"
        tier = "Tier 2: High-Value Event Surge"
        bundle = "باقة Rustic Wedding Rehearsal & Vendor Boxes (صناديق بيتزا فردية للطواقم + بوفيه بيتزا فاخر مع سلطات جرجير وبارميزان)"
        window = "يناير إلى مارس (فترة تثبيت حجوزات الموسم) ومساء أيام الاثنين"

    # Sector 4: Cal Poly & Colleges
    elif "4. جامعة كالفورنيا" in sec:
        if any(w in bname for w in ["asi", "associated students", "partners", "union", "alumni", "dean of students", "student affairs", "campus"]):
            persona = "ASI Program Manager / Student Events Director / Auxiliary Coordinator"
            occasion = "حفلات الترحيب بالطلاب الجدد (WOW)، مهرجانات الحرم الجامعي، وليالي تخفيف التوتر في أسابيع الامتحانات النهائية (Finals Pizza Nights)"
            headcount = "80 - 450+ فرد"
            frequency = "دوري مكثف مع أحداث الحرم الكبرى"
            aov = "$900 - $4,500"
            tier = "Tier 1: Massive Institutional Enterprise"
            bundle = "باقة Campus Mega-Social Pack (عشرات علب البيتزا العملاقة المتنوعة مع أجنحة دجاج مقرمشة وخبز بالثوم والجبن)"
            window = "مطلع سبتمبر، ومنتصف كل ربع دراسي أكاديمي"
        elif any(w in bname for w in ["fraternity", "sorority", "interfraternity", "panhellenic", "greek", "sigma", "alpha", "kappa"]):
            persona = "Chapter Social Chair / Philanthropy Director / House Manager"
            occasion = "اجتماعات الفروع الأسبوعية (Chapter Meetings)، حملات جمع التبرعات الخيرية (Philanthropy Nights)، واحتفالات قبول الأعضاء (Bid Day)"
            headcount = "45 - 130 فرداً"
            frequency = "نصف شهري / فصلي"
            aov = "$450 - $1,400"
            tier = "Tier 2: High Volume Social Surge"
            bundle = "باقة Greek Chapter Mega Buffet (تشكيلة ضخمة من البيتزا المحبوبة للشباب مع سلطات جماعية ومشروبات)"
            window = "أسبوع Bid Day (مطلع الخريف والربيع) وأيام الأحد"
        elif any(w in bname for w in ["canoe", "bridge", "racing", "cubesat", "rose float", "swe", "shpe", "ieee", "baja", "formula", "club", "society"]):
            persona = "Club President / Engineering Project Team Lead / Treasurer"
            occasion = "جلسات التصنيع والبناء الليلية المتأخرة، عشاء الرعاة والداعمين، واحتفالات الانتهاء من النماذج الأولية للمسابقات الوطنية"
            headcount = "25 - 75 فرداً"
            frequency = "كل أسبوعين أو شهرياً خلال مواسم التصنيع والتسليم"
            aov = "$250 - $650"
            tier = "Tier 2: High Loyalty Recurring"
            bundle = "باقة Late-Night Build Session Fuel (بيتزا مشبعة بجبن ولحوم مضاعفة، أصابع خبز بالثوم، وصلصات إضافية)"
            window = "بداية كل فصل، ومساء أيام الأربعاء والخميس"
        elif any(w in bname for w in ["athletic", "sports", "coach", "rodeo", "lacrosse", "triathlon", "sailing"]):
            persona = "Athletic Operations Director / Head Coach / Team Travel Coordinator"
            occasion = "وجبات ما بعد المباريات والبطولات، التغذية الرياضية للفرق الزائرة والمضيفة، وحفلات ختام الموسم"
            headcount = "30 - 85 فرداً"
            frequency = "أسبوعي خلال موسم المنافسات الرياضية"
            aov = "$350 - $1,100"
            tier = "Tier 1: High Priority Athletics"
            bundle = "باقة Post-Game Champions Pack (بيتزا عالية البروتين، أجنحة دجاج مشوية، سلطات غنية، ومشروبات ترطيب)"
            window = "أيام الاثنين لتنسيق مباريات نهاية الأسبوع"
        else: # Academic Departments & Dean's Offices
            persona = "Department Administrative Assistant / Academic Program Coordinator"
            occasion = "اجتماعات أعضاء هيئة التدريس الدورية، لجان تحكيم مشاريع التخرج، واستضافة الأساتذة الزوار والمحاضرات العامة"
            headcount = "15 - 40 فرداً"
            frequency = "شهري / فصلي (كل ربع أكاديمي)"
            aov = "$250 - $650"
            tier = "Tier 2: Steady Institutional Account"
            bundle = "باقة Faculty Colloquium & Boardroom Lunch (بيتزا أرقى الأصناف مع خيارات خالية من الغلوتين، سلطات فردية، ومشروبات باردة)"
            window = "الأسبوع الأول من كل فصل دراسي (سبتمبر، يناير، أبريل)"

    # Sector 5: K-12 Schools
    elif "5. المدارس" in sec:
        persona = "School Principal / PTA President / Athletic Booster / Activities Director"
        occasion = "أيام التطوير المهني للمعلمين (Staff In-Service Days)، أسبوع تقدير المعلمين (Teacher Appreciation Week في مايو)، وحفلات نهاية العام الرياضية"
        headcount = "25 - 90 فرداً"
        frequency = "شهري / ربع سنوي + المناسبات المدرسية المحددة"
        aov = "$300 - $950"
        tier = "Tier 2: Reliable Institutional Core"
        bundle = "باقة Educator Appreciation & Faculty Feast (تشكيلة بيتزا غنية تشمل خيارات نباتية وخالية من الغلوتين، سلطات طازجة متنوعة، وعصائر)"
        window = "الأسبوعان الأخيران من أغسطس، مطلع نوفمبر، ومنتصف أبريل"

    # Sector 6: Corporate & Tech
    elif "6. الشركات" in sec:
        persona = "Office Manager / HR Director / Executive Assistant / Operations Lead"
        occasion = "غداء الجمعة المؤسسي (Pizza Friday)، اجتماعات مجلس الإدارة الدورية، ورش العمل التدريبية، وإطلاق البرمجيات والمنتجات (Sprint Launches)"
        headcount = "25 - 120 فرداً"
        frequency = "أسبوعي / نصف شهري / شهري مستمر طوال العام"
        aov = "$350 - $1,650"
        tier = "Tier 1: High-Margin Enterprise Account"
        bundle = "باقة Tech & Corporate Boardroom Buffet (بيتزا رقيقة مقرمشة بأصناف راقية، سلطات فردية صحية، صواني مقبلات إيطالية، ومياه غازية فاخرة)"
        window = "صباح أيام الثلاثاء والأربعاء بين الساعة 9:00 و 10:30 صباحاً"

    # Sector 7: Hospitals & Healthcare
    elif "7. المستشفيات" in sec:
        persona = "Nurse Supervisor / Department Administrator / Physician Relations / Clinic Manager"
        occasion = "احتفالات تغيير المناوبات الطبية، أسبوع التمريض الوطني (Nurses Week)، يوم الطبيب، وتموين وجبات الكوادر الجراحية"
        headcount = "20 - 70 فرداً"
        frequency = "نصف شهري / شهري متكرر"
        aov = "$300 - $900"
        tier = "Tier 1: Essential Healthcare Account"
        bundle = "باقة Healthcare Heroes Individual Box Lunches (صناديق غداء فردية معقمة ومحكمة الإغلاق تضم بيتزا شخصية طازجة وسلطة جانبية لسهولة التناول)"
        window = "منتصف الصباح (10:00 صباحاً) أو فترة ما بعد الظهر (2:00 ظهراً)"

    # Sector 8: Construction & Engineering
    elif "8. شركات المقاولات" in sec:
        persona = "General Superintendent / Safety Director / Project Manager / Office Administrator"
        occasion = "احتفالات إنجاز مراحل البناء (Topping Out Parties)، احتفالات السلامة الخالية من الحوادث (Safety Milestones)، وغداء نهاية الأسبوع الميداني لفرق المشاريع"
        headcount = "30 - 150 فرداً"
        frequency = "شهري / عند تحقيق كل مرحلة إنشائية"
        aov = "$450 - $2,000"
        tier = "Tier 1: Heavy Field Volume Account"
        bundle = "باقة Heavy Civil Field Crew Feast (أحجام بيتزا عملاقة باللحوم المزدوجة، كالزوني محشو، أجنحة دجاج، مشروبات غازية عائلية، وأطباق تقديم متينة)"
        window = "الصباح الباكر جداً بين 7:00 و 8:30 صباحاً، أو صباح أيام الجمعة"

    # Sector 9: Auto Dealerships
    elif "9. وكلاء ومعارض" in sec:
        persona = "Dealership General Manager / Sales Manager / Service Director"
        occasion = "غداء مبيعات السبت الأسبوعي الدائم (Saturday Showroom Lunch لموظفي المبيعات والعملاء)، واحتفالات إغلاق أهداف المبيعات الشهرية"
        headcount = "20 - 55 فرداً"
        frequency = "أسبوعي ثابت كل يوم سبت (52 أسبوعاً سنوياً)"
        aov = "$280 - $680"
        tier = "Tier 1: Consistent High-Frequency Opportunity"
        bundle = "باقة Saturday Sales Accelerator (بيتزا ساخنة سريعة التقديم، أجنحة دجاج حارة، وسلطة مجمعة تصل في تمام الساعة 11:45 صباحاً)"
        window = "صباح يوم الأربعاء لتثبيت جدول توريد السبت الدائم"

    # Sector 10: Sports & Gyms
    elif "10. الأندية والفرق" in sec:
        persona = "Booster Club President / Tournament Director / Head Coach / Athletic Director"
        occasion = "حفلات عشاء ختام الموسم (End-of-Season Sports Banquets)، تغذية الفرق خلال بطولات نهاية الأسبوع، واحتفالات التتويج بالبطولات"
        headcount = "35 - 180 فرداً"
        frequency = "موسمي مكثف (مواسم بطولات الخريف والربيع)"
        aov = "$450 - $2,200"
        tier = "Tier 2: Event Surge Account"
        bundle = "باقة Athletes & Champions Banquet (كميات بيتزا وفيرة بالجبن والبيبروني، باقات أجنحة دجاج عملاقة، سلطات خضراء، ومشروبات باردة)"
        window = "قبل 3 أسابيع من ختام مواسم الدوريات الرياضية"

    # Sector 11: Non-profits & Rotary
    elif "11. الجمعيات الخيرية" in sec:
        persona = "Club President / Executive Director / Program Coordinator"
        occasion = "اجتماعات أندية الخدمة الأسبوعية (Rotary/Kiwanis Luncheons الأسبوعية)، لقاءات شكر المتطوعين، وغداء لجان تنظيم المهرجانات الخيرية"
        headcount = "25 - 85 فرداً"
        frequency = "أسبوعي لنوادي الخدمة / شهري للجمعيات غير الربحية"
        aov = "$280 - $1,100"
        tier = "Tier 1: Recurring Community Anchor" if "rotary" in bname or "kiwanis" in bname or "lions" in bname or "elks" in bname else "Tier 2: Community Non-profit"
        bundle = "باقة Civic Leaders Luncheon (بوفيه بيتزا كلاسيكي وصحي، سلطات عائلية متنوعة، شاي مثلج ومياه منعشة)"
        window = "شهر مايو ويونيو (فترة انتقال الهيئات الإدارية) وصباح أيام الاثنين"

    # Sector 12: Churches
    elif "12. الكنائس" in sec:
        persona = "Parish Administrator / Youth Ministry Director / Fellowship Coordinator"
        occasion = "لقاءات مجموعات الشباب الأسبوعية، مدارس العطلات الصيفية الدينية (VBS)، وجبات الزمالة بعد الصلوات، وموائد لجان الخدمة"
        headcount = "30 - 160 فرداً"
        frequency = "نصف شهري / شهري"
        aov = "$300 - $1,300"
        tier = "Tier 2: Community Faith Account"
        bundle = "باقة Sunday Fellowship & Youth Night (بيتزا عائلية اقتصادية وفيرة، سلطات خضراء، وخبز بالثوم يحبه الأطفال والشباب)"
        window = "صباح أيام الثلاثاء والأربعاء"

    # Sector 13: Residential & Student Housing
    elif "13. المجمعات السكنية" in sec:
        persona = "Property General Manager / Resident Experience Coordinator / Managing Broker"
        occasion = "ليالي بيتزا السكان الدورية (Resident Pizza Parties)، حفلات الترحيب بالطلاب الجدد في بداية الفصول الدراسية، واجتماعات جولات المنازل المفتوحة"
        headcount = "40 - 220 فرداً"
        frequency = "شهري / فصلي دوري"
        aov = "$450 - $2,000"
        tier = "Tier 1: High Density Residential Account" if "apartment" in bname or "village" in bname or "palomar" in bname or "chorro" in bname else "Tier 2: Real Estate Office"
        bundle = "باقة Resident Social & Welcome Bash (صناديق بيتزا متنوعة بأحجام كبيرة، أصابع مقبلات، وصلصات غمس مجمعة لسهولة التوزيع السريع)"
        window = "شهر أغسطس (قبل موسم التسكين) ومطلع يناير وأبريل"

    # Sector 14: Tours, Shuttles, Logistics & Aviation
    elif "14. منظمو جولات النبيذ" in sec:
        persona = "Tour Fleet Director / FBO Operations Manager / Charter Flight Dispatcher"
        occasion = "صناديق غداء تموين نزهات جولات النبيذ الخاصة، وجبات طواقم طائرات رجال الأعمال الخاصة والمسافرين VIP بمطاري SBP وPRB، وغداء مستودعات الشحن اللوجستي"
        headcount = "12 - 40 فرداً"
        frequency = "أسبوعي / عند الطلب الفوري للرحلات الجوية الخاصة"
        aov = "$220 - $850"
        tier = "Tier 2: High-Margin Niche VIP"
        bundle = "باقة Executive In-Flight & Tour Box (علب وجبات فردية فاخرة تشمل ميني بيتزا حرفية، سلطة معكرونة إيطالية، ومشروب سان بيليغرينو)"
        window = "الصباح الباكر أو قبل عطلات نهاية الأسبوع"

    # Sector 15: Theaters, Museums, Culture
    elif "15. المسارح والمتاحف" in sec:
        persona = "Production Manager / Theater Artistic Director / Museum Event Coordinator"
        occasion = "وجبات طواقم الممثلين والفنيين خلال أسابيع البروفات التقنية المكثفة (Tech Week Dinners)، وافتتاحات المعارض الفنية (Exhibition Openings)"
        headcount = "25 - 75 فرداً"
        frequency = "دوري مع كل موسم مسرحي أو معرض (كل 6 - 8 أسابيع)"
        aov = "$300 - $950"
        tier = "Tier 2: Production Cycle Account"
        bundle = "باقة Backstage Cast & Crew Fuel (بيتزا مغذية وسريعة التناول، سلطات خفيفة، ومقبلات دافئة لا تلطخ أزياء الممثلين)"
        window = "أيام الاثنين في بداية أسابيع الإنتاج المسرحي"

    # Sector 16: Municipalities, Fire, CSDs
    elif "16. الهيئات الحكومية" in sec:
        persona = "City Clerk / Parks & Rec Superintendent / Fire Battalion Chief / Department Administrative Officer"
        occasion = "جلسات عمل المجلس البلدي المسائية، دورات تدريب موظفي المقاطعة، وجبات طواقم مراكز الإطفاء، ومخيمات الترويح الصيفية التابعة للمدينة"
        headcount = "15 - 65 فرداً"
        frequency = "نصف شهري / شهري مستقر / وجبات طوارئ ميدانية"
        aov = "$250 - $850"
        tier = "Tier 1: Rock-Solid Public Sector Account"
        bundle = "باقة Civic Services & Emergency Crew Pack (بيتزا طازجة ساخنة، مقبلات خفيفة، وسلطات متوازنة تصل في التوقيت المحدد بدقة عسكرية)"
        window = "صباح أيام الثلاثاء أو قبل مواعيد جلسات المجلس البلدي بأسبوعين"

    l['Decision_Maker_Persona'] = persona
    l['Catering_Occasion'] = occasion
    l['Estimated_Headcount'] = headcount
    l['Order_Frequency'] = frequency
    l['Estimated_AOV_USD'] = aov
    l['Customer_Tier'] = tier
    l['Recommended_Bundle'] = bundle
    l['Best_Contact_Window'] = window
    return l

enriched_leads = [enrich_lead(l) for l in leads]

with open('/home/user/ECC/verified_leads.json', 'w', encoding='utf-8') as f:
    json.dump(enriched_leads, f, ensure_ascii=False, indent=2)

print(f"Successfully enriched all {len(enriched_leads)} leads with 8 commercial customer intelligence fields!")
