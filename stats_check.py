import json

with open("verified_leads.json", "r", encoding="utf-8") as f:
    leads = json.load(f)

# Sort leads by Priority and Sector
# Priority A: Paso Robles, San Luis Obispo
# Priority B: Templeton, Atascadero, San Miguel, Creston, Arroyo Grande, Pismo Beach, Morro Bay, Los Osos
# Priority C: Avila Beach, Grover Beach, Cambria

paso_leads = [l for l in leads if l["City"] == "Paso Robles"]
slo_leads = [l for l in leads if l["City"] == "San Luis Obispo"]
nearby_cities = ["Templeton", "Atascadero", "San Miguel", "Creston", "Arroyo Grande", "Pismo Beach", "Morro Bay", "Los Osos"]
nearby_leads = [l for l in leads if l["City"] in nearby_cities]
expansion_cities = ["Avila Beach", "Grover Beach", "Cambria"]
expansion_leads = [l for l in leads if l["City"] in expansion_cities]

print(f"Paso Robles leads: {len(paso_leads)}")
print(f"San Luis Obispo leads: {len(slo_leads)}")
print(f"Nearby Cities leads: {len(nearby_leads)}")
print(f"Expansion leads: {len(expansion_leads)}")
print(f"Total: {len(paso_leads) + len(slo_leads) + len(nearby_leads) + len(expansion_leads)}")

# Unique emails
all_emails = sorted(list(set(l["Email"] for l in leads)), key=lambda x: x.lower())
print(f"Unique emails count: {len(all_emails)}")

# Email types
official_site = [l for l in leads if l["Verification_Status"] == "موثّق من الموقع الرسمي"]
other_public = [l for l in leads if l["Verification_Status"] == "موثّق من دليل عام موثوق"]
print(f"Official site: {len(official_site)}, Other public source: {len(other_public)}")
