#!/usr/bin/env python3
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor, white, black
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, PageBreak, HRFlowable
from reportlab.lib import colors
import os

# Colors
EMBER = HexColor("#E85A2A")
OAK = HexColor("#1A1A1E")
CREAM = HexColor("#FFF8EC")
VINE = HexColor("#5C6B3A")
GOLD = HexColor("#F2B705")
GREY = HexColor("#8A8D93")
LIGHT = HexColor("#FFF8EC")

ROOT = os.path.dirname(os.path.dirname(__file__))  # examples/menu-studio
IMG_DIR = os.path.join(ROOT, "public/img")
OUT = os.path.join(os.path.dirname(__file__), "EMBER46_DoorDash_Menu.pdf")

def img_exists(name):
    if not name:
        return None
    p = os.path.join(IMG_DIR, name)
    return p if os.path.isfile(p) else None

styles = getSampleStyleSheet()
sTitle = ParagraphStyle('title', parent=styles['Heading1'], fontName='Helvetica-Bold', fontSize=28, leading=28, textColor=EMBER, alignment=TA_LEFT)
sTag = ParagraphStyle('tag', parent=styles['Normal'], fontName='Helvetica', fontSize=7, leading=9, textColor=white, alignment=TA_LEFT)
sH2 = ParagraphStyle('h2', parent=styles['Heading2'], fontName='Helvetica-Bold', fontSize=9, leading=11, textColor=EMBER, spaceBefore=8, spaceAfter=4)
sItemName = ParagraphStyle('itemName', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=8, leading=10, textColor=OAK)
sDesc = ParagraphStyle('desc', parent=styles['Normal'], fontName='Helvetica', fontSize=6.5, leading=8, textColor=HexColor("#555555"))
sMeta = ParagraphStyle('meta', parent=styles['Normal'], fontName='Helvetica-Oblique', fontSize=5.5, leading=7, textColor=GREY)
sPrice = ParagraphStyle('price', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=8, leading=10, textColor=OAK, alignment=TA_RIGHT)
sSmall = ParagraphStyle('small', parent=styles['Normal'], fontName='Helvetica', fontSize=6, leading=8, textColor=HexColor("#444444"))
sFooter = ParagraphStyle('footer', parent=styles['Normal'], fontName='Helvetica', fontSize=5.5, leading=7, textColor=HexColor("#AAAAAA"), alignment=TA_CENTER)

def header_canvas(canvas, doc):
    canvas.saveState()
    # top bar
    canvas.setFillColor(OAK)
    canvas.rect(0, doc.pagesize[1]-70, doc.pagesize[0], 70, stroke=0, fill=1)
    # ember accent line
    canvas.setFillColor(EMBER)
    canvas.rect(0, doc.pagesize[1]-70-6, doc.pagesize[0], 6, stroke=0, fill=1)
    canvas.restoreState()

def footer_canvas(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(OAK)
    canvas.rect(0, 0, doc.pagesize[0], 36, stroke=0, fill=1)
    canvas.setFillColor(HexColor("#AAAAAA"))
    canvas.setFont("Helvetica", 5.5)
    canvas.drawCentredString(doc.pagesize[0]/2, 22, "EMBER 46  |  Ghost Kitchen  |  Paso Robles, CA 93446  |  DoorDash Exclusive  |  Prices DoorDash = Dine-in +15%")
    canvas.setFont("Helvetica", 4.5)
    canvas.drawCentredString(doc.pagesize[0]/2, 12, "Images 2048x1152 16:9  |  No text on food photos  |  Centered 60% fill  |  Own all rights  |  Export via reportlab")
    canvas.restoreState()

doc = SimpleDocTemplate(OUT, pagesize=LETTER,
                        leftMargin=0.35*inch, rightMargin=0.35*inch,
                        topMargin=0.85*inch, bottomMargin=0.5*inch,
                        title="EMBER 46 DoorDash Menu", author="EMBER 46")

story = []

# Title block (inside header area, but we add spacer)
story.append(Spacer(1, 0.05*inch))
title_data = [
    [Paragraph('<font color="#E85A2A"><b>EMBER</b></font> <font color="white">46</font>', sTitle),
     Paragraph('<font color="#F2B705"><b>DOORDASH</b></font> <font color="white">EXCLUSIVE</font><br/><font color="white">Daily 11AM — 11PM<br/>Hotline 93446<br/>Wood-fired 650°F</font>', ParagraphStyle('hdr', parent=styles['Normal'], fontName='Helvetica', fontSize=7, leading=9, textColor=white, alignment=TA_RIGHT))]
]
t = Table(title_data, colWidths=[4.2*inch, 2.8*inch])
t.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'MIDDLE'), ('LEFTPADDING', (0,0), (-1,-1), 0), ('RIGHTPADDING', (0,0), (-1,-1), 0)]))
story.append(t)
story.append(Paragraph('<font color="white" size="6">Oak-Fired  ·  Wine Country  ·  Delivered  —  Ghost Kitchen, Paso Robles 93446</font>', sTag))
story.append(Spacer(1, 0.12*inch))

# Notice
notice_style = ParagraphStyle('notice', parent=styles['Normal'], fontName='Helvetica-Bold', fontSize=6, leading=8, textColor=white, alignment=TA_CENTER)
story.append(Table([[Paragraph('DoorDash-first menu  •  16:9 photos  •  No logos on food  •  One item per photo  &nbsp; <font color="#E85A2A"><b>93446</b></font>', notice_style)]], colWidths=[7.5*inch], style=TableStyle([('BACKGROUND', (0,0), (-1,-1), EMBER), ('ROUNDEDCORNERS', [4,4,4,4]), ('TOPPADDING', (0,0), (-1,-1), 6), ('BOTTOMPADDING', (0,0), (-1,-1), 6)])))
story.append(Spacer(1, 0.1*inch))

# Helper to make pizza row
def pizza_row(img_name, name, desc, prices, badge=None):
    img_path = img_exists(img_name)
    if img_path:
        try:
            im = Image(img_path, width=0.62*inch, height=0.46*inch)
            im.hAlign = 'LEFT'
        except:
            im = Paragraph('', sSmall)
    else:
        im = Paragraph(f"<i>{img_name}</i>", sSmall)
    badge_html = f' <font color="#E85A2A"><b>{badge}</b></font>' if badge else ''
    left = [
        [im, Paragraph(f"<b>{name}</b>{badge_html}<br/><font size='6' color='#555555'>{desc}</font>", sSmall)]
    ]
    # need to combine im and text? Use table nested
    # Actually make a table with image and body
    # We'll create an inner table for left part
    inner = Table([[im, Paragraph(f"<b>{name}</b>{badge_html}<br/><font size='6' color='#555555'>{desc}</font>", ParagraphStyle('inner', parent=sSmall, leftIndent=4))]], colWidths=[0.68*inch, 2.0*inch])
    inner.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP'), ('LEFTPADDING', (0,0), (-1,-1), 1), ('RIGHTPADDING', (0,0), (-1,-1), 1)]))
    price_text = f"{prices[0]}<br/><font size='5' color='#8A8D93'>10\"</font>  {prices[1]}<br/><font size='5' color='#8A8D93'>13\"</font>  <font color='#E85A2A'><b>{prices[2]}</b></font><br/><font size='5' color='#8A8D93'>16\"</font>"
    # Use 3-price mini table? Simplify as paragraph with line breaks
    price_para = Paragraph(f"<b>{prices[0]}</b> <font size='5' color='#8A8D93'>10\"</font>  |  <b>{prices[1]}</b> <font size='5' color='#8A8D93'>13\"</font>  |  <font color='#E85A2A'><b>{prices[2]}</b></font> <font size='5' color='#8A8D93'>16\"</font>", ParagraphStyle('pr', parent=sPrice, fontSize=7, leading=9, alignment=TA_RIGHT))
    row = Table([[inner, price_para]], colWidths=[2.75*inch, 1.1*inch])
    row.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'MIDDLE'), ('LEFTPADDING', (0,0), (-1,-1), 2), ('RIGHTPADDING', (0,0), (-1,-1), 2), ('BOTTOMPADDING', (0,0), (-1,-1), 4)]))
    return row

def simple_row(img_name, name, desc, price, badge=None):
    img_path = img_exists(img_name)
    if img_path:
        try:
            im = Image(img_path, width=0.55*inch, height=0.42*inch)
        except:
            im = Paragraph('', sSmall)
    else:
        im = Paragraph('', sSmall)
    badge_html = f' <font color="#E85A2A" size="5"><b>{badge}</b></font>' if badge else ''
    inner = Table([[im, Paragraph(f"<b>{name}</b>{badge_html}<br/><font size='6' color='#555555'>{desc}</font>", ParagraphStyle('inner2', parent=sSmall, leftIndent=4, fontSize=6.5))]], colWidths=[0.60*inch, 2.1*inch])
    inner.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP')]))
    price_para = Paragraph(f"<b>{price}</b>", sPrice)
    row = Table([[inner, price_para]], colWidths=[2.75*inch, 0.7*inch])
    row.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'MIDDLE'), ('BOTTOMPADDING', (0,0), (-1,-1), 3)]))
    return row

# Build two-column layout manually by interleaving? Simpler: single column with sections, but we want 2-column feel. We'll do sequential sections and rely on reader.

# Featured Pizzas
story.append(Paragraph("FEATURED PIZZAS  —  Wood-Fired 650° Oak  <font size='6' color='#8A8D93'>10\" / 13\" / 16\"</font>", sH2))
story.append(HRFlowable(width="100%", thickness=1, color=EMBER, spaceBefore=1, spaceAfter=4))
story.append(pizza_row("pizza-truffle-shuffle.jpg", "The 46 Truffle Shuffle", "Wild mushrooms, truffle cream, fontina & taleggio, arugula, lemon.", ["19.95","26.95","32.95"], "CHEF'S · ANCHOR"))
story.append(pizza_row("pizza-cup-char-46.jpg", "Cup & Char 46", "Double cup-and-char beef pepperoni, hot honey, oregano. Best seller.", ["16.95","22.95","27.95"], "★ POPULAR"))
story.append(pizza_row("pizza-margherita.jpg", "Vineyard Margherita", "San Marzano, fior di latte, basil, EVOO, blistered cornicione.", ["14.95","19.95","23.95"], "VEG"))
story.append(pizza_row("pizza-quattro-formaggi-box.jpg", "Quattro Formaggi Oak", "Garlic cream, mozzarella, gorgonzola, taleggio, parmesan.", ["17.95","23.95","28.95"], "VEG"))
story.append(pizza_row("pizza-bourbon-bbq.jpg", "Bourbon BBQ Chicken", "Grilled chicken, bourbon BBQ, smoked gouda, red onion.", ["17.95","23.95","28.95"], None))
story.append(pizza_row("pizza-valley-veggie.jpg", "Valley Veggie Fire", "Charred zucchini, peppers, mushroom, caramelized onion, arugula.", ["15.95","21.95","26.95"], "VEG"))
story.append(pizza_row("pizza-meat-supreme-46.jpg", "Meat Supreme 46", "Pepperoni, fennel sausage, bacon, ground beef, red onion.", ["18.95","25.95","31.95"], None))
story.append(pizza_row("pizza-calabrian-heat.jpg", "Calabrian Heat", "Soppressata, Calabrian chili, mozzarella, hot honey, basil.", ["17.95","23.95","28.95"], "SPICY"))

story.append(Spacer(1, 0.08*inch))
# BYO Box
byo_data = [
    [Paragraph("<b>BUILD YOUR OWN — Start with Cheese</b><br/><font size='6' color='#555555'>12.95 / 16.95 / 20.95 — then add crust / sauce / toppings. Max 5 toppings for travel.</font>", sSmall)]
]
t = Table(byo_data, colWidths=[7.5*inch])
t.setStyle(TableStyle([('BACKGROUND', (0,0), (-1,-1), CREAM), ('BOX', (0,0), (-1,-1), 0.5, HexColor("#E8D9B8")), ('TOPPADDING', (0,0), (-1,-1), 6), ('BOTTOMPADDING', (0,0), (-1,-1), 6), ('LEFTPADDING', (0,0), (-1,-1), 8)]))
story.append(t)
story.append(Spacer(1, 0.04*inch))
mod_data = [
    [Paragraph("<b>MODIFIER GROUPS (DoorDash)</b><br/>"
               "<b>Size*:</b> 10\" / 13\" / 16\" &nbsp;|&nbsp; <b>Crust*:</b> Classic / Thin +$2 / Cauliflower GF +$4 / Stuffed +$5<br/>"
               "<b>Sauce:</b> Red / White +$1 / BBQ +$1 / Pesto +$1.5 &nbsp;|&nbsp; <b>Cheese:</b> Light / Regular / Extra +$2<br/>"
               "<b>Meats +$2/3/3.5:</b> Pepperoni, Sausage, Bacon, Chicken, Soppressata &nbsp;|&nbsp; <b>Veg +$1.5/2/2.5:</b> Mushroom, Onion, Peppers, Zucchini, Olives, Arugula<br/>"
               "<b>Premium +$2.5/3/3.5:</b> Truffle cream, Hot honey, Burrata &nbsp;|&nbsp; <b>Cut & Bake:</b> Triangle / Square / No Cut · Normal / Well-Done",
               ParagraphStyle('mod', parent=sSmall, fontSize=6, leading=8, textColor=HexColor("#444444")))]
]
t2 = Table(mod_data, colWidths=[7.5*inch])
t2.setStyle(TableStyle([('BACKGROUND', (0,0), (-1,-1), HexColor("#FFF8EC")), ('BOX', (0,0), (-1,-1), 0.5, HexColor("#E8D9B8")), ('TOPPADDING', (0,0), (-1,-1), 6), ('BOTTOMPADDING', (0,0), (-1,-1), 6), ('LEFTPADDING', (0,0), (-1,-1), 8)]))
story.append(t2)
story.append(Spacer(1, 0.12*inch))

# Sides / Salads / Desserts / Drinks — grouped in two columns using Table
story.append(Paragraph("EMBER SIDES", sH2))
story.append(HRFlowable(width="100%", thickness=1, color=EMBER, spaceBefore=1, spaceAfter=4))
story.append(simple_row("mozzarella-sticks.jpg", "Mozzarella Sticks (6)", "Panko-crisp, house marinara.", "9.95", "VEG"))
story.append(simple_row("buffalo-wings.jpg", "Buffalo Wings (8)", "Glossy buffalo, ranch, celery. Vented box.", "12.95", "SPICY"))
story.append(simple_row("garlic-bread.jpg", "Oak Garlic Bread", "Ciabatta, garlic butter, melted mozz.", "8.95", None))
story.append(simple_row("loaded-fries.jpg", "Loaded Ember Fries", "Cheddar, scallions, ranch, bacon.", "9.95", None))

story.append(Paragraph("SALADS", sH2))
story.append(HRFlowable(width="100%", thickness=1, color=EMBER, spaceBefore=1, spaceAfter=4))
story.append(simple_row("caesar-salad.jpg", "Chicken Caesar", "Romaine, grilled chicken, parmesan, croutons.", "11.95", None))
story.append(simple_row("caprese-salad.jpg", "Caprese", "Tomato, mozzarella, basil, balsamic glaze. Veg GF.", "10.95", "VEG"))

story.append(Paragraph("DOLCI", sH2))
story.append(HRFlowable(width="100%", thickness=1, color=EMBER, spaceBefore=1, spaceAfter=4))
story.append(simple_row("cheesecake.jpg", "NY Cheesecake", "Biscuit base, Paso berry coulis.", "7.95", None))
story.append(simple_row("lava-brownie.jpg", "Lava Brownie + Gelato", "Warm brownie, molten core, gelato separate cup.", "8.95", None))

story.append(Paragraph("DRINKS  <font size='6' color='#8A8D93'>Generic names — DoorDash safe, no trademarks</font>", sH2))
story.append(HRFlowable(width="100%", thickness=1, color=EMBER, spaceBefore=1, spaceAfter=4))
drinks = [
    ["House Mint Lemonade 16oz", "4.95"],
    ["Cola 330ml Can", "2.95"],
    ["Lemon-Lime Soda 330ml", "2.95"],
    ["Sparkling Water 355ml", "3.50"],
    ["Cold Brew — Paso Roast 16oz", "4.95"],
    ["Wine Country Grape Sparkler 12oz", "5.95"],
]
for name, price in drinks:
    # try to include image for lemonade
    img = "mint-lemonade.jpg" if "Lemonade" in name else None
    story.append(simple_row(img if img else "", name, "", price, None))

story.append(Paragraph("DIPS & SAUCES  <font size='6' color='#8A8D93'>$1.50 each · 3 for $3.95</font>", sH2))
story.append(HRFlowable(width="100%", thickness=1, color=EMBER, spaceBefore=1, spaceAfter=4))
dips_para = Paragraph("Ranch &nbsp;|&nbsp; Garlic Whip &nbsp;|&nbsp; Marinara &nbsp;|&nbsp; Hot Honey &nbsp;|&nbsp; Calabrian Mayo &nbsp;|&nbsp; Balsamic Glaze", ParagraphStyle('dips', parent=sSmall, alignment=TA_CENTER, fontSize=7))
story.append(dips_para)
story.append(Spacer(1, 0.12*inch))

# Combo bundle
combo_data = [
    [Paragraph('<b><font color="#F2B705" size="12">FAMILY EMBER BUNDLE</font></b><br/><font color="white" size="7">2 × 16\" Pizzas + 2 Sides + 4 Drinks — Feeds 4–5</font><br/><font color="white" size="16"><b>74.95</b></font><br/><font color="#E85A2A" size="6"><b>Save $18 vs separate — #1 Upsell</b></font>', ParagraphStyle('combo', parent=styles['Normal'], alignment=TA_CENTER, textColor=white, leading=12))]
]
t = Table(combo_data, colWidths=[7.5*inch])
t.setStyle(TableStyle([('BACKGROUND', (0,0), (-1,-1), EMBER), ('ROUNDEDCORNERS', [8,8,8,8]), ('TOPPADDING', (0,0), (-1,-1), 10), ('BOTTOMPADDING', (0,0), (-1,-1), 10)]))
story.append(t)
story.append(Spacer(1, 0.08*inch))

# Upsell engine
upsell = [
    [Paragraph("<b>UPSELL ENGINE — Auto Prompts</b><br/>After pizza select → <b>Add a Dip? +$1.50</b> &nbsp;|&nbsp; Cart → <b>Make it a Combo +$8.95</b><br/>On Cup & Char → <b>Double Pepperoni? +$3</b> &nbsp;|&nbsp; Before checkout → <b>Add Dessert? from 7.95</b>", ParagraphStyle('ups', parent=sSmall, textColor=white, alignment=TA_CENTER, fontSize=6.5, leading=9))]
]
t = Table(upsell, colWidths=[7.5*inch])
t.setStyle(TableStyle([('BACKGROUND', (0,0), (-1,-1), OAK), ('ROUNDEDCORNERS', [8,8,8,8]), ('TOPPADDING', (0,0), (-1,-1), 8), ('BOTTOMPADDING', (0,0), (-1,-1), 8)]))
story.append(t)
story.append(Spacer(1, 0.1*inch))

psy = Paragraph('<b>Psychology in this menu:</b> Anchor (Truffle $32.95) makes $27.95 feel value · Decoy 13\"→16\" only +$5 pushes Large · Charm .95 pricing · Descriptive labels +27% sales · Golden triangle: best sellers top-left.', ParagraphStyle('psy', parent=sSmall, fontSize=5.5, leading=7, textColor=HexColor("#666666"), borderColor=HexColor("#E8D9B8"), borderWidth=0.5, borderPadding=(6,6,6)))
# wrap in table for border
t = Table([[psy]], colWidths=[7.5*inch])
t.setStyle(TableStyle([('BACKGROUND', (0,0), (-1,-1), HexColor("#FFF8EC")), ('ROUNDEDCORNERS', [6,6,6,6]), ('BOX', (0,0), (-1,-1), 0.5, HexColor("#E8D9B8"))]))
story.append(t)

doc.build(story, onFirstPage=lambda c,d: (header_canvas(c,d), footer_canvas(c,d)), onLaterPages=lambda c,d: (header_canvas(c,d), footer_canvas(c,d)))
print(f"PDF generated: {OUT} ({os.path.getsize(OUT)} bytes)")
