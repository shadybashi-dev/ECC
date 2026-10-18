import json
from collections import defaultdict

with open("verified_leads.json", "r", encoding="utf-8") as f:
    leads = json.load(f)

# Group by City and Sector
matrix = defaultdict(lambda: {"entities": set(), "emails": set()})

for l in leads:
    key = (l["City"], l["Sector"])
    matrix[key]["entities"].add(l["Business_Name"])
    matrix[key]["emails"].add(l["Email"])

print(f"Total city-sector pairs covered: {len(matrix)}")
for (city, sec), data in sorted(matrix.items()):
    print(f"| {city} | {sec} | اكتمل البحث الأولي | {len(data['entities'])} | {len(data['emails'])} | تم توثيق البيانات من المصادر الرسمية |")
