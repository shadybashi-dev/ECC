import json

batch3 = [
    {
        "Business_Name": "Trinity Lutheran Church of Paso Robles",
        "City": "Paso Robles",
        "ZIP": "93446",
        "Street_Address": "940 Creston Rd",
        "Phone": "(805) 238-3702",
        "Sector": "12. الكنائس والمراكز الدينية والمجتمعات الروحية",
        "Email": "church@trinitypaso.com",
        "Email_Function": "مكتب الكنيسة والتنسيق الإداري والمجتمعي",
        "Email_Type": "نطاق مؤسسي رسمي (Official Domain)",
        "Verification_Status": "موثّق من الموقع الرسمي للجهة",
        "Organization_Source_URL": "https://trinitypaso.com",
        "Email_Source_URL": "https://trinitypaso.com/church-office-contact/",
        "Search_Date": "2026-10-18",
        "Pitch_Hook": "تموين لقاءات الغداء بعد القداس الأسبوعي والمناسبات العائلية واجتماعات الخدمة الدينية",
        "Notes": "كنيسة ومدرسة عريقة في طريق كريستون بباسو روبلس تضم مجتمعاً كبيراً من العائلات"
    },
    {
        "Business_Name": "Grace Central Coast",
        "City": "San Luis Obispo",
        "ZIP": "93401",
        "Street_Address": "1350 Osos St",
        "Phone": "(805) 543-2358",
        "Sector": "12. الكنائس والمراكز الدينية والمجتمعات الروحية",
        "Email": "info@gracecentralcoast.org",
        "Email_Function": "الاستعلامات العامة وخدمة المصلين والشباب",
        "Email_Type": "نطاق مؤسسي رسمي (Official Domain)",
        "Verification_Status": "موثّق من الموقع الرسمي للجهة",
        "Organization_Source_URL": "https://gracecentralcoast.org",
        "Email_Source_URL": "https://gracecentralcoast.org/",
        "Search_Date": "2026-10-18",
        "Pitch_Hook": "تموين فعاليات مجموعات الشباب الجامعي والعشاء العائلي الأسبوعي",
        "Notes": "من كبرى الكنائس المسيحية في سان لويس أوبيسبو وتخدم آلاف الطلاب والعائلات"
    },
    {
        "Business_Name": "Mountainbrook Church",
        "City": "San Luis Obispo",
        "ZIP": "93405",
        "Street_Address": "1775 Calle Joaquin",
        "Phone": "(805) 543-3162",
        "Sector": "12. الكنائس والمراكز الدينية والمجتمعات الروحية",
        "Email": "info@mountainbrook.net",
        "Email_Function": "مكتب الإدارة وتنسيق الأنشطة المجتمعية",
        "Email_Type": "نطاق مؤسسي رسمي (Official Domain)",
        "Verification_Status": "موثّق من الموقع الرسمي للجهة",
        "Organization_Source_URL": "https://www.mountainbrook.net",
        "Email_Source_URL": "https://www.mountainbrook.net/class",
        "Search_Date": "2026-10-18",
        "Pitch_Hook": "حزم بيتزا جماعية للقاءات الشباب وورش العمل التطوعية ومخيمات الصيف",
        "Notes": "حرم كنسي ضخم على مساحة واسعة في شارع كالي خواكين جنوب سان لويس"
    },
    {
        "Business_Name": "Paso Church of the Nazarene",
        "City": "Paso Robles",
        "ZIP": "93446",
        "Street_Address": "2706 Spring St",
        "Phone": "(805) 239-4771",
        "Sector": "12. الكنائس والمراكز الدينية والمجتمعات الروحية",
        "Email": "office@pasochurch.com",
        "Email_Function": "مكتب الكنيسة والاستعلامات",
        "Email_Type": "نطاق مؤسسي رسمي (Official Domain)",
        "Verification_Status": "موثّق من الموقع الرسمي للجهة",
        "Organization_Source_URL": "https://pasochurch.com",
        "Email_Source_URL": "https://pasochurch.com/contact/",
        "Search_Date": "2026-10-18",
        "Pitch_Hook": "تموين التجمعات الأخوية واحتفالات الأعياد الدينية ولقاءات الآباء",
        "Notes": "كنيسة نشطة في شارع سبرينغ بباسو روبلس تنظم برامج مجتمعية متعددة"
    },
    {
        "Business_Name": "Plymouth Congregational Church",
        "City": "Paso Robles",
        "ZIP": "93446",
        "Street_Address": "1301 Oak St",
        "Phone": "(805) 238-3321",
        "Sector": "12. الكنائس والمراكز الدينية والمجتمعات الروحية",
        "Email": "plymouthchurchpaso@gmail.com",
        "Email_Function": "التواصل العام وأمانة الكنيسة",
        "Email_Type": "بريد إلكتروني عام موثّق (Public Webmail Verified)",
        "Verification_Status": "موثّق من الموقع الرسمي للجهة",
        "Organization_Source_URL": "https://plymouthchurchpaso.com",
        "Email_Source_URL": "https://plymouthchurchpaso.com/contact/",
        "Search_Date": "2026-10-18",
        "Pitch_Hook": "تموين لقاءات اللجان التطوعية وفعاليات الخدمة الاجتماعية في وسط باسو روبلس",
        "Notes": "كنيسة تاريخية عريقة في زاوية شارع 13 وأوك في قلب وسط باسو روبلس"
    },
    {
        "Business_Name": "Central Pacific Construction LLC",
        "City": "Paso Robles",
        "ZIP": "93446",
        "Street_Address": "Paso Robles, CA",
        "Phone": "(805) 471-4749",
        "Sector": "8. شركات المقاولات والإنشاءات والهندسة المدنية والتصنيع",
        "Email": "frank@buildcpconstruction.com",
        "Email_Function": "إدارة المشاريع والتعاقدات الإنشائية",
        "Email_Type": "نطاق مؤسسي رسمي (Official Domain)",
        "Verification_Status": "موثّق من الموقع الرسمي للجهة",
        "Organization_Source_URL": "https://buildcpconstruction.com",
        "Email_Source_URL": "https://buildcpconstruction.com",
        "Search_Date": "2026-10-18",
        "Pitch_Hook": "توصيل وجبات غداء ساخنة وسريعة لطواقم العمل في مواقع البناء والتشطيبات",
        "Notes": "مقاول عام بارز للمشاريع التجارية والسكنية في باسو روبلس وشمال المقاطعة"
    },
    {
        "Business_Name": "Ward Custom Construction Inc",
        "City": "Paso Robles",
        "ZIP": "93446",
        "Street_Address": "1727 Park St",
        "Phone": "(805) 635-8444",
        "Sector": "8. شركات المقاولات والإنشاءات والهندسة المدنية والتصنيع",
        "Email": "harvey@wardconstruction.net",
        "Email_Function": "الرئيس التنفيذي وإدارة العمليات",
        "Email_Type": "نطاق مؤسسي رسمي (Official Domain)",
        "Verification_Status": "موثّق من الموقع الرسمي للجهة",
        "Organization_Source_URL": "https://www.wardcustomconstruction.com",
        "Email_Source_URL": "https://www.wardcustomconstruction.com/contact",
        "Search_Date": "2026-10-18",
        "Pitch_Hook": "تموين اجتماعات مقاولي الباطن والمهندسين وجلسات إنجاز مراحل البناء",
        "Notes": "شركة إنشاءات ومقاولات متخصصة في وسط باسو روبلس بشارع بارك"
    },
    {
        "Business_Name": "Farrell Smyth Property Management",
        "City": "San Luis Obispo",
        "ZIP": "93405",
        "Street_Address": "21 Santa Rosa St, Suite 250",
        "Phone": "(805) 543-2636",
        "Sector": "13. المجمعات السكنية وسكن الطلاب ومكاتب العقارات وإدارة الأملاك",
        "Email": "propertymanagement@farrellsmyth.com",
        "Email_Function": "إدارة الأملاك السكنية والتجارية وتنسيق الصيانة",
        "Email_Type": "نطاق مؤسسي رسمي (Official Domain)",
        "Verification_Status": "موثّق من الموقع الرسمي للجهة",
        "Organization_Source_URL": "https://www.farrellsmyth.com",
        "Email_Source_URL": "https://www.farrellsmyth.com/contact/",
        "Search_Date": "2026-10-18",
        "Pitch_Hook": "تموين لقاءات مديري العقارات وحفلات الترحيب بالمستأجرين الجدد",
        "Notes": "كبرى شركات إدارة العقارات والمجمعات السكنية في سان لويس أوبيسبو"
    },
    {
        "Business_Name": "Oak Park Community Apartments",
        "City": "Paso Robles",
        "ZIP": "93446",
        "Street_Address": "630 Oak Park Rd",
        "Phone": "(805) 369-3396",
        "Sector": "13. المجمعات السكنية وسكن الطلاب ومكاتب العقارات وإدارة الأملاك",
        "Email": "Oakpark1@pasoroblesha.org",
        "Email_Function": "مدير إدارة المجمع السكني وتنسيق فعاليات السكان",
        "Email_Type": "نطاق مؤسسي رسمي (Official Domain)",
        "Verification_Status": "موثّق من الموقع الرسمي للجهة",
        "Organization_Source_URL": "https://pasoroblesha.org",
        "Email_Source_URL": "https://pasoroblesha.org",
        "Search_Date": "2026-10-18",
        "Pitch_Hook": "حزم بيتزا لحفلات المجتمع السكني والمهرجانات العائلية وأيام التجمع الصيفية",
        "Notes": "مجمع سكني عائلي ضخم يتبع لهيئة الإسكان في باسو روبلس ويضم مئات الشقق"
    }
]

with open('/home/user/ECC/verified_leads.json', 'r', encoding='utf-8') as f:
    leads = json.load(f)

existing_pairs = set((l['Business_Name'].strip().lower(), l['Email'].strip().lower()) for l in leads)

added = 0
for b in batch3:
    pair = (b['Business_Name'].strip().lower(), b['Email'].strip().lower())
    if pair not in existing_pairs:
        leads.append(b)
        existing_pairs.add(pair)
        added += 1

print(f"Added {added} new leads. Total: {len(leads)}")

with open('/home/user/ECC/verified_leads.json', 'w', encoding='utf-8') as f:
    json.dump(leads, f, ensure_ascii=False, indent=2)

print("Saved successfully!")
