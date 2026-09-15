import sys, re
P="antonias/index.html"; s=open(P,encoding="utf-8").read()

PIES = [
 ("The Cheese Slice","cheese-slice","The classic. Never wrong."),
 ("The Ajarski","ajarski","Dough boat, egg &amp; butter."),
 ("The Supreme","supreme","Sausage, peppers, herbs."),
 ("Garden Veggie","veggie","Loaded with the green stuff."),
 ("BBQ Chicken","bbq-chicken","Smoky, sweet, iconic."),
 ("Pies &amp; Wings","pies-wings","Why choose? Get both."),
 ("Pesto Chicken","supreme","The flavour sleeper hit."),
 ("Gyro Pizza","cheese-slice","Mediterranean, lunch legend."),
]
# NOTE: prize copy is a starting point -- confirm with the owner before launch.
PRIZES = [
 ("Free fountain drink","with any pie",True),
 ("10% off","your whole order",True),
 ("Free garlic knots","with any large pie",True),
 ("Better luck next time","spin again tomorrow",False),
 ("Free extra topping","on any pie",True),
 ("$5 off","a 28&quot; monster pie",True),
 ("Free cannoli","with any order",True),
 ("Better luck next time","spin again tomorrow",False),
]

def seg_labels(items):
    return "\n".join(
      f'            <span class="sw-label" style="--s:{i}">{t}</span>'
      for i,(t,*_) in enumerate(items))

pie_json = ",".join(
  '{"name":"%s","img":"assets/img/wheel/%s.jpg","note":"%s"}' % (n,img,note)
  for n,img,note in PIES)
prize_json = ",".join(
  '{"name":"%s","note":"%s","win":%s}' % (n,note,"true" if win else "false")
  for n,note,win in PRIZES)

section = f'''
    <!-- ============ SPIN TO DECIDE ============ -->
    <section class="section spin-section" id="spin">
      <div class="container">
        <div class="section-head reveal">
          <span class="eyebrow">Can't decide?</span>
          <h2 class="display h-lg">Let the<br><span class="text-outline">wheel decide.</span></h2>
        </div>

        <div class="spin-grid">

          <!-- pizza picker -->
          <div class="spin-card reveal reveal-left">
            <h3 class="spin-title">Pick my pizza</h3>
            <p class="spin-sub">Eight pies. One spin. No more arguing in the car.</p>
            <div class="spin-wheel" data-spin-wheel data-spin-kind="pies"
                 data-spin-items='[{pie_json}]'>
              <div class="sw-pointer" aria-hidden="true"></div>
              <div class="sw-disc">
{seg_labels(PIES)}
              </div>
              <button type="button" class="sw-hub" data-spin-go>
                <span>SPIN</span>
              </button>
            </div>
            <div class="sw-result" data-spin-result role="status" aria-live="polite"></div>
          </div>

          <!-- prize wheel -->
          <div class="spin-card reveal reveal-right">
            <h3 class="spin-title">Spin for a treat</h3>
            <p class="spin-sub">One spin per visit. Show your prize at the counter.</p>
            <div class="spin-wheel spin-wheel--prize" data-spin-wheel data-spin-kind="prizes"
                 data-spin-once="antonias-prize-v1"
                 data-spin-items='[{prize_json}]'>
              <div class="sw-pointer" aria-hidden="true"></div>
              <div class="sw-disc">
{seg_labels(PRIZES)}
              </div>
              <button type="button" class="sw-hub" data-spin-go>
                <span>SPIN</span>
              </button>
            </div>
            <div class="sw-result" data-spin-result role="status" aria-live="polite"></div>
            <p class="sw-fineprint">One spin per visitor. Dine-in &amp; pickup at both locations. Not combinable with other offers.</p>
          </div>

        </div>
      </div>
    </section>
'''

anchor = '    <section class="section feature-paper" id="ajarski">'
if s.count(anchor)!=1: sys.exit(f"ABORT anchor: {s.count(anchor)}")
s = s.replace(anchor, section + "\n" + anchor, 1)
open(P,"w",encoding="utf-8",newline="\n").write(s)
print("  section inserted")
print("  wheels:", s.count('data-spin-wheel'))
print("  labels:", s.count('class="sw-label"'))
