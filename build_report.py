# -*- coding: utf-8 -*-
import json

with open("verified_leads.json", "r", encoding="utf-8") as f:
    leads = json.load(f)

# Sort by Priority:
# Priority A: Paso Robles (93446), San Luis Obispo (93401, 93405, 93407)
# Priority B: Templeton (93465), Atascadero (93422), San Miguel (93451), Creston (93432), Arroyo Grande (93420), Pismo Beach (93449), Morro Bay (93442), Los Osos (93402)
# Priority C: Avila Beach (93424), Grover Beach (93433), Cambria (93428)

paso_leads = [l for l in leads if l["City"] == "Paso Robles"]
slo_leads = [l for l in leads if l["City"] == "San Luis Obispo"]
nearby_cities = ["Templeton", "Atascadero", "San Miguel", "Creston", "Arroyo Grande", "Pismo Beach", "Morro Bay", "Los Osos"]
nearby_leads = [l for l in leads if l["City"] in nearby_cities]
expansion_cities = ["Avila Beach", "Grover Beach", "Cambria"]
expansion_leads = [l for l in leads if l["City"] in expansion_cities]

# Sort each group by sector then business name
def sort_key(item):
    sec_num = int(item["Sector"].split(".")[0])
    return (sec_num, item["Business_Name"], item["Email"])

paso_leads.sort(key=sort_key)
slo_leads.sort(key=sort_key)
nearby_leads.sort(key=lambda x: (x["City"], sort_key(x)))
expansion_leads.sort(key=lambda x: (x["City"], sort_key(x)))

def format_table(lead_list):
    headers = [
        "Business_Name", "City", "ZIP", "Street_Address", "Phone", "Sector",
        "Email", "Email_Function", "Email_Type", "Verification_Status",
        "Organization_Source_URL", "Email_Source_URL", "Search_Date", "Pitch_Hook", "Notes"
    ]
    lines = []
    lines.append("| " + " | ".join(headers) + " |")
    lines.append("| " + " | ".join(["---"] * len(headers)) + " |")
    for item in lead_list:
        row = [
            item["Business_Name"].replace("|", "-"),
            item["City"],
            item["ZIP"],
            item["Street_Address"].replace("|", "-"),
            item["Phone"],
            item["Sector"].replace("|", "-"),
            f"`{item['Email']}`",
            item["Email_Function"].replace("|", "-"),
            item["Email_Type"].replace("|", "-"),
            item["Verification_Status"].replace("|", "-"),
            f"[{item['Business_Name'][:20]}...]({item['Organization_Source_URL']})" if len(item['Business_Name']) > 20 else f"[{item['Business_Name']}]({item['Organization_Source_URL']})",
            f"[رابط المصدر]({item['Email_Source_URL']})",
            item["Search_Date"],
            item["Pitch_Hook"].replace("|", "-"),
            item["Notes"].replace("|", "-")
        ]
        lines.append("| " + " | ".join(row) + " |")
    return "\n".join(lines)

table_paso = format_table(paso_leads)
table_slo = format_table(slo_leads)
table_nearby = format_table(nearby_leads)
table_expansion = format_table(expansion_leads)

# Quick copy emails
unique_emails = sorted(list(set(l["Email"] for l in leads)), key=lambda x: x.lower())
quick_copy_block = ", ".join(unique_emails)

print("Generated markdown tables successfully.")
