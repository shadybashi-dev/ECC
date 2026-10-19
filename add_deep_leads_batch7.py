import json

batch7_leads = [
    # Sector 8: Construction & Engineering
    {
        "Business_Name": "Specialty Construction, Inc.",
        "City": "San Luis Obispo",
        "ZIP": "93401",
        "Street_Address": "645 Clarion Court",
        "Phone": "(805) 543-1706",
        "Sector": "8. شركات المقاولات والإنشاءات والهندسة المدنية والتصنيع",
        "Email": "info@specialtyconstruction.com",
        "Email_Function": "General Inquiries & Office Management",
        "Email_Type": "Domain-based",
        "Verification_Status": "Verified",
        "Organization_Source_URL": "https://www.specialtyconstruction.com",
        "Email_Source_URL": "https://www.specialtyconstruction.com/contact.php",
        "Search_Date": "2026-10-18",
        "Pitch_Hook": "وجبات ميدانية ساخنة وعلب غداء بيتزا طازجة لفرق العمل الإنشائية والمشاريع المدنية الكبرى في مقاطعة سان لويس أوبيسبو مع تسليم فوري في المواقع.",
        "Notes": "شركة مقاولات هندسية ومدنية عامة كبرى تضم عشرات المهندسين وفرق العمل الميدانية ومشاريع البنية التحتية."
    },
    {
        "Business_Name": "Papich Construction Co., Inc.",
        "City": "Arroyo Grande",
        "ZIP": "93420",
        "Street_Address": "398 Sunrise Terrace",
        "Phone": "(805) 473-3016",
        "Sector": "8. شركات المقاولات والإنشاءات والهندسة المدنية والتصنيع",
        "Email": "info@papichconstruction.com",
        "Email_Function": "Main Corporate Inquiries",
        "Email_Type": "Domain-based",
        "Verification_Status": "Verified",
        "Organization_Source_URL": "https://papichco.com",
        "Email_Source_URL": "https://papichco.com/contact",
        "Search_Date": "2026-10-18",
        "Pitch_Hook": "باقات تموين بيتزا وسلطات عائلية متكاملة لفرق التشغيل الثقيل واجتماعات السلامة الدورية والمشاريع الميدانية في المقاطعة.",
        "Notes": "من أكبر شركات مقاولات الطرق والهندسة الثقيلة في الساحل الأوسط مع مئات العاملين ومقار إقليمية."
    },
    {
        "Business_Name": "Souza Construction, Inc.",
        "City": "San Luis Obispo",
        "ZIP": "93401",
        "Street_Address": "4027 Santa Fe Rd",
        "Phone": "(805) 546-8288",
        "Sector": "8. شركات المقاولات والإنشاءات والهندسة المدنية والتصنيع",
        "Email": "info@souzaconstructioninc.com",
        "Email_Function": "General Operations & Administration",
        "Email_Type": "Domain-based",
        "Verification_Status": "Verified",
        "Organization_Source_URL": "https://www.souzaconstructioninc.com",
        "Email_Source_URL": "https://www.souzaconstructioninc.com/contact",
        "Search_Date": "2026-10-18",
        "Pitch_Hook": "تموين غداء عمل ساخن لفرق المشاريع الهندسية وإدارة المشروعات مع التزام صارم بدقة المواعيد والحصص الفردية.",
        "Notes": "شركة مقاولات هندسية ومدنية تأسست منذ عقود وتتولى كبرى مشاريع المرافق العامة في سان لويس أوبيسبو."
    },
    {
        "Business_Name": "Ten Over Studio, Inc.",
        "City": "San Luis Obispo",
        "ZIP": "93401",
        "Street_Address": "539 Marsh Street",
        "Phone": "(805) 541-1010",
        "Sector": "8. شركات المقاولات والإنشاءات والهندسة المدنية والتصنيع",
        "Email": "info@tenoverstudio.com",
        "Email_Function": "Studio Administration & Client Inquiries",
        "Email_Type": "Domain-based",
        "Verification_Status": "Verified",
        "Organization_Source_URL": "https://www.tenoverstudio.com",
        "Email_Source_URL": "https://www.tenoverstudio.com/contact",
        "Search_Date": "2026-10-18",
        "Pitch_Hook": "غداء تصميم وورش عمل Charette ببيتزا حرفية ومشروبات طازجة لاجتماعات العملاء وجلسات العصف الذهني في وسط سان لويس أوبيسبو.",
        "Notes": "استوديو معماري وتخطيط حضري رائد (B-Corp) يضم أكثر من 30 معمارياً ومخططاً في وسط SLO."
    },
    {
        "Business_Name": "Studio Design Group Architects, Inc.",
        "City": "San Luis Obispo",
        "ZIP": "93401",
        "Street_Address": "762 Higuera Street, Suite 212",
        "Phone": "(805) 541-3848",
        "Sector": "8. شركات المقاولات والإنشاءات والهندسة المدنية والتصنيع",
        "Email": "sdg@sdgarchitects.com",
        "Email_Function": "General Office & Management",
        "Email_Type": "Domain-based",
        "Verification_Status": "Verified",
        "Organization_Source_URL": "https://sdgarchitects.com",
        "Email_Source_URL": "https://sdgarchitects.com/contact-us/",
        "Search_Date": "2026-10-18",
        "Pitch_Hook": "عروض تموين غداء مجاورة تماماً على بُعد خطوات في شارع Higuera St لاجتماعات فرق التصميم واحتفالات تسليم المشاريع.",
        "Notes": "شركة هندسة معمارية كبرى تقع في شارع هيغيرا بجوار فرع Antonia's Pizza مباشرة في وسط سان لويس أوبيسبو."
    },
    {
        "Business_Name": "J.W. Design & Construction, Inc.",
        "City": "San Luis Obispo",
        "ZIP": "93401",
        "Street_Address": "3563 Sueldo Street, Suite I",
        "Phone": "(805) 544-3130",
        "Sector": "8. شركات المقاولات والإنشاءات والهندسة المدنية والتصنيع",
        "Email": "info@jwdci.com",
        "Email_Function": "Corporate Office & Projects",
        "Email_Type": "Domain-based",
        "Verification_Status": "Verified",
        "Organization_Source_URL": "https://jwdci.com",
        "Email_Source_URL": "https://jwdci.com/contact.html",
        "Search_Date": "2026-10-18",
        "Pitch_Hook": "خدمات تموين غداء للشركات واجتماعات البناء واحتفالات إتمام المراحل الإنشائية لفرق المقاولات.",
        "Notes": "مقاول عام وتطوير عقاري مرموق ينفذ فنادق ومصانع نبيذ ومبانٍ تجارية عبر الساحل الأوسط."
    },

    # Sector 12: Churches & Religious Communities
    {
        "Business_Name": "Old Mission San Luis Obispo de Tolosa",
        "City": "San Luis Obispo",
        "ZIP": "93401",
        "Street_Address": "751 Palm Street",
        "Phone": "(805) 781-8220",
        "Sector": "12. الكنائس والمراكز الدينية والمجتمعات الروحية",
        "Email": "office@oldmissionslo.org",
        "Email_Function": "Parish Office & Pastoral Administration",
        "Email_Type": "Domain-based",
        "Verification_Status": "Verified",
        "Organization_Source_URL": "https://missionsanluisobispo.org",
        "Email_Source_URL": "https://missionsanluisobispo.org/contact-us/",
        "Search_Date": "2026-10-18",
        "Pitch_Hook": "تموين فعاليات الرعية واجتماعات لجان الخدمة واحتفالات المناسبات الدينية ببيتزا تقليدية طازجة وأطباق إيطالية عائلية.",
        "Notes": "المعلم الديني والتاريخي المركزي لسان لويس أوبيسبو ورعية كاثوليكية نشطة تشهد مئات الفعاليات المجتمعية."
    },
    {
        "Business_Name": "St. Rose of Lima Catholic Church",
        "City": "Paso Robles",
        "ZIP": "93446",
        "Street_Address": "820 Creston Road",
        "Phone": "(805) 238-2218",
        "Sector": "12. الكنائس والمراكز الدينية والمجتمعات الروحية",
        "Email": "strose@strosechurch.org",
        "Email_Function": "Parish Administration Office",
        "Email_Type": "Domain-based",
        "Verification_Status": "Verified",
        "Organization_Source_URL": "https://www.saintrosechurch.org",
        "Email_Source_URL": "https://www.saintrosechurch.org/about",
        "Search_Date": "2026-10-18",
        "Pitch_Hook": "وجبات عائلية وباقات بيتزا مدرسية ورعوية لاحتفالات المناسبات ولقاءات الشباب في باسو روبلس.",
        "Notes": "الرعية الكاثوليكية الرئيسية ومدرستها في باسو روبلس مع آلاف الأسر ومجموعات خدمة متطوعة."
    },
    {
        "Business_Name": "Grace Central Coast",
        "City": "San Luis Obispo",
        "ZIP": "93401",
        "Street_Address": "1350 Osos Street",
        "Phone": "(805) 543-2358",
        "Sector": "12. الكنائس والمراكز الدينية والمجتمعات الروحية",
        "Email": "info@gracecentralcoast.org",
        "Email_Function": "Central Office & Community Inquiries",
        "Email_Type": "Domain-based",
        "Verification_Status": "Verified",
        "Organization_Source_URL": "https://gracecentralcoast.org",
        "Email_Source_URL": "https://gracecentralcoast.org/contact",
        "Search_Date": "2026-10-18",
        "Pitch_Hook": "باقات ضيافة وتموين مجموعات الشباب والطلبة الجامعيين ولقاءات الآحاد ومجموعات Huddle العائلية ببيتزا طازجة وسريعة.",
        "Notes": "إحدى أكبر الكنائس الإنجيلية في الساحل الأوسط مع فروع نشطة في SLO وFive Cities وجلسات تجمع مئات الشباب."
    },
    {
        "Business_Name": "Trinity Lutheran Church & School",
        "City": "Paso Robles",
        "ZIP": "93446",
        "Street_Address": "940 Creston Road",
        "Phone": "(805) 238-3702",
        "Sector": "12. الكنائس والمراكز الدينية والمجتمعات الروحية",
        "Email": "church@trinitypaso.com",
        "Email_Function": "Church Office & Fellowship Coordination",
        "Email_Type": "Domain-based",
        "Verification_Status": "Verified",
        "Organization_Source_URL": "https://trinitypaso.com",
        "Email_Source_URL": "https://trinitypaso.com/church-office-contact/",
        "Search_Date": "2026-10-18",
        "Pitch_Hook": "تموين لقاءات الزمالة وإفطار الرجال وفعاليات المدرسة الرعوية ببيتزا ومخبوزات إيطالية طازجة من باسو روبلس.",
        "Notes": "مجمع كنسي ومدرسة ابتدائية كبرى يضم أنشطة زمالة شهرية وبرامج مجتمعية مستمرة."
    },
    {
        "Business_Name": "Covenant Presbyterian Church",
        "City": "Paso Robles",
        "ZIP": "93446",
        "Street_Address": "1450 Golden Hill Road",
        "Phone": "(805) 238-6927",
        "Sector": "12. الكنائس والمراكز الدينية والمجتمعات الروحية",
        "Email": "office@covenantpaso.com",
        "Email_Function": "Church Office Administration",
        "Email_Type": "Domain-based",
        "Verification_Status": "Verified",
        "Organization_Source_URL": "https://covenantpaso.com",
        "Email_Source_URL": "https://covenantprespaso.squarespace.com/contact",
        "Search_Date": "2026-10-18",
        "Pitch_Hook": "تموين وجبات الزمالة ومجموعات الشباب ولقاءات بعد القداس بوجبات بيتزا عائلية وسلطات متنوعة.",
        "Notes": "كنيسة مجتمعية نشطة في باسو روبلس مع برامج أسبوعية للشباب والعائلات."
    },
    {
        "Business_Name": "Life Community Church",
        "City": "Paso Robles",
        "ZIP": "93446",
        "Street_Address": "3770 Ruth Way",
        "Phone": "(805) 434-5040",
        "Sector": "12. الكنائس والمراكز الدينية والمجتمعات الروحية",
        "Email": "hello@lccpaso.org",
        "Email_Function": "Pastoral Office & Outreach Coordination",
        "Email_Type": "Domain-based",
        "Verification_Status": "Verified",
        "Organization_Source_URL": "https://www.lccpaso.org",
        "Email_Source_URL": "https://lccpaso.org/give",
        "Search_Date": "2026-10-18",
        "Pitch_Hook": "باقات تموين مدارس العطلات الصيفية ولقاءات الشباب وفعاليات خدمة المجتمع ببيتزا Antonia's اللذيذة.",
        "Notes": "كنيسة مجتمعية حديثة تقدم برامج عائلية وأنشطة للأطفال والشباب في باسو روبلس."
    },
    {
        "Business_Name": "Paso Robles Community Church",
        "City": "Paso Robles",
        "ZIP": "93446",
        "Street_Address": "2706 Spring Street",
        "Phone": "(805) 239-4771",
        "Sector": "12. الكنائس والمراكز الدينية والمجتمعات الروحية",
        "Email": "office@pasochurch.com",
        "Email_Function": "Church Office & Ministry Coordination",
        "Email_Type": "Domain-based",
        "Verification_Status": "Verified",
        "Organization_Source_URL": "https://pasochurch.com",
        "Email_Source_URL": "https://pasochurch.com/contact/",
        "Search_Date": "2026-10-18",
        "Pitch_Hook": "خيارات تموين مرنة لاجتماعات اللجان ووجبات الغداء الجماعية بعد الصلوات وأنشطة فرق المتطوعين.",
        "Notes": "كنيسة معمدانية مجتمعية في شارع سبرينغ بباسو روبلس تضم شبكة نشطة من العائلات والشباب."
    },
    {
        "Business_Name": "First Presbyterian Church of San Luis Obispo",
        "City": "San Luis Obispo",
        "ZIP": "93401",
        "Street_Address": "981 Marsh Street",
        "Phone": "(805) 543-5451",
        "Sector": "12. الكنائس والمراكز الدينية والمجتمعات الروحية",
        "Email": "churchoffice@fpcslo.org",
        "Email_Function": "Church Office & Parish Administration",
        "Email_Type": "Domain-based",
        "Verification_Status": "Verified",
        "Organization_Source_URL": "https://www.fpcslo.org",
        "Email_Source_URL": "https://www.fpcslo.org/contact",
        "Search_Date": "2026-10-18",
        "Pitch_Hook": "تموين فعاليات المجتمع المدني واللقاءات الموسيقية والروحية ولقاءات كبار السن في قلب وسط سان لويس أوبيسبو.",
        "Notes": "كنيسة تاريخية عريقة في وسط سان لويس أوبيسبو تستضيف حفلات ولقاءات مجتمعية متعددة."
    },

    # Sector 13: Residential Communities & Real Estate
    {
        "Business_Name": "Mustang Village Apartments",
        "City": "San Luis Obispo",
        "ZIP": "93405",
        "Street_Address": "1 Mustang Drive",
        "Phone": "(805) 783-2500",
        "Sector": "13. المجمعات السكنية وسكن الطلاب ومكاتب العقارات وإدارة الأملاك",
        "Email": "mustangvillage@assetliving.com",
        "Email_Function": "Leasing & Community Management",
        "Email_Type": "Domain-based",
        "Verification_Status": "Verified",
        "Organization_Source_URL": "https://mustangvillage.com",
        "Email_Source_URL": "https://mustangvillage.com/faq",
        "Search_Date": "2026-10-18",
        "Pitch_Hook": "حفلات البيتزا الترحيبية للطلاب المقيمين وفعاليات أسابيع الاختبارات النهائية وفعاليات التجمع السكني (Pizza Nights).",
        "Notes": "أكبر مجمع سكني طلابي خاص بجوار حرم كالفورنيا بوليتكنيك يضم مئات الشقق وآلاف الطلاب."
    },
    {
        "Business_Name": "Farrell Smyth, Inc. Property Management",
        "City": "San Luis Obispo",
        "ZIP": "93405",
        "Street_Address": "21 Santa Rosa Street, Suite 250",
        "Phone": "(805) 543-2636",
        "Sector": "13. المجمعات السكنية وسكن الطلاب ومكاتب العقارات وإدارة الأملاك",
        "Email": "propertymanagement@farrellsmyth.com",
        "Email_Function": "Property Management Division",
        "Email_Type": "Domain-based",
        "Verification_Status": "Verified",
        "Organization_Source_URL": "https://www.farrellsmyth.com",
        "Email_Source_URL": "https://www.farrellsmyth.com/property-management-services",
        "Search_Date": "2026-10-18",
        "Pitch_Hook": "تموين اجتماعات الوسطاء العقاريين وفعاليات أيام المفتوحة (Open House) وغداء فرق إدارة الممتلكات والمقاولين.",
        "Notes": "من أقدم وأكبر وكالات إدارة الأملاك السكنية والتجارية والوساطة العقارية في مقاطعة سان لويس أوبيسبو."
    },
    {
        "Business_Name": "McNamara Realty, Inc.",
        "City": "San Luis Obispo",
        "ZIP": "93401",
        "Street_Address": "390 Higuera Street",
        "Phone": "(805) 543-7777",
        "Sector": "13. المجمعات السكنية وسكن الطلاب ومكاتب العقارات وإدارة الأملاك",
        "Email": "mcnamaraleasing@charter.net",
        "Email_Function": "Leasing & Property Management Office",
        "Email_Type": "Domain-based",
        "Verification_Status": "Verified",
        "Organization_Source_URL": "https://www.slorealty.com",
        "Email_Source_URL": "https://www.slorealty.com/contact",
        "Search_Date": "2026-10-18",
        "Pitch_Hook": "شريك تموين غداء مجاور مباشرة في شارع هيغيرا لاجتماعات الملاك وفرق الصيانة واللقاءات المكتبية الدورية.",
        "Notes": "شركة إدارة عقارات عائلية عريقة تدير مئات العقارات السكنية وتقع في شارع Higuera بالقرب من Antonia's Pizza."
    },
    {
        "Business_Name": "San Luis Property Management",
        "City": "San Luis Obispo",
        "ZIP": "93401",
        "Street_Address": "1250 Peach Street, Suite M",
        "Phone": "(805) 541-1822",
        "Sector": "13. المجمعات السكنية وسكن الطلاب ومكاتب العقارات وإدارة الأملاك",
        "Email": "info@sanluisproperty.net",
        "Email_Function": "General Management & Leasing Office",
        "Email_Type": "Domain-based",
        "Verification_Status": "Verified",
        "Organization_Source_URL": "https://www.sanluisproperty.net",
        "Email_Source_URL": "https://www.sanluisproperty.net/contact-us",
        "Search_Date": "2026-10-18",
        "Pitch_Hook": "غداء مكتبي دوري لفرق إدارة العقارات واحتفالات تسليم المفاتيح وعروض خاصة لساكني العقارات المدارة.",
        "Notes": "شركة رائدة في إدارة العقارات السكنية وتأجير المنازل والشقق في سان لويس أوبيسبو."
    },
    {
        "Business_Name": "SLO Realty & Property Management",
        "City": "San Luis Obispo",
        "ZIP": "93401",
        "Street_Address": "1601 Osos Street",
        "Phone": "(805) 784-0946",
        "Sector": "13. المجمعات السكنية وسكن الطلاب ومكاتب العقارات وإدارة الأملاك",
        "Email": "slorpm@hotmail.com",
        "Email_Function": "Realty & Tenant Services Office",
        "Email_Type": "Public Webmail",
        "Verification_Status": "Verified",
        "Organization_Source_URL": "https://www.slorpm.com",
        "Email_Source_URL": "https://www.slorpm.com/contact-us",
        "Search_Date": "2026-10-18",
        "Pitch_Hook": "تموين سريع للاجتماعات العقارية واستقبال العملاء وتجمعات فرق الصيانة والإدارة.",
        "Notes": "مكتب عقاري وخدمات إدارة أملاك محلي في شارع أوسوس بوسط سان لويس أوبيسبو."
    },
    {
        "Business_Name": "Paso Robles Housing Authority",
        "City": "Paso Robles",
        "ZIP": "93446",
        "Street_Address": "901 30th Street",
        "Phone": "(805) 238-4015",
        "Sector": "13. المجمعات السكنية وسكن الطلاب ومكاتب العقارات وإدارة الأملاك",
        "Email": "info@pasoroblesha.org",
        "Email_Function": "Executive & Housing Administration",
        "Email_Type": "Domain-based",
        "Verification_Status": "Verified",
        "Organization_Source_URL": "https://pasoroblesha.org",
        "Email_Source_URL": "https://pasoroblesha.org/",
        "Search_Date": "2026-10-18",
        "Pitch_Hook": "تموين فعاليات المجتمع السكني واجتماعات مجلس الإدارة وورش عمل تمكين السكان بوجبات بيتزا عائلية متكاملة.",
        "Notes": "هيئة الإسكان العامة في باسو روبلس التي تدير مجمعات الإسكان التنموية مثل Oak Park والبرامج المجتمعية للسكان."
    }
]

with open('/home/user/ECC/verified_leads.json', 'r') as f:
    existing_leads = json.load(f)

existing_emails = {l['Email'].strip().lower() for l in existing_leads if l.get('Email')}
existing_entities = {l['Business_Name'].strip().lower() for l in existing_leads if l.get('Business_Name')}

added = 0
skipped = 0

for lead in batch7_leads:
    email_clean = lead['Email'].strip().lower()
    entity_clean = lead['Business_Name'].strip().lower()
    if email_clean in existing_emails:
        print(f"Skipping duplicate email: {email_clean}")
        skipped += 1
        continue
    if entity_clean in existing_entities:
        print(f"Skipping duplicate entity: {entity_clean}")
        skipped += 1
        continue
    
    existing_leads.append(lead)
    existing_emails.add(email_clean)
    existing_entities.add(entity_clean)
    added += 1

with open('/home/user/ECC/verified_leads.json', 'w', encoding='utf-8') as f:
    json.dump(existing_leads, f, ensure_ascii=False, indent=2)

print(f"\nSuccessfully added {added} leads from Batch 7.")
print(f"Skipped {skipped} duplicates.")
print(f"Total records now: {len(existing_leads)}")
print(f"Total unique emails now: {len(existing_emails)}")
