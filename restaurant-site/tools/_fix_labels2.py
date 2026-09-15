import sys, re
C="antonias/css/style.css"; s=open(C,encoding="utf-8").read()
start = s.index(".sw-label{")
end   = s.index(".sw-label:nth-child(odd)")
new = """.sw-label{
  position:absolute;left:50%;top:50%;
  /* Orbit to the segment's centre line, then un-rotate by the same angle so
     the text always reads horizontally -- radial text goes upside down across
     the bottom half of the disc. */
  transform:translate(-50%,-50%)
            rotate(calc(var(--s) * var(--seg) + (var(--seg) / 2)))
            translateY(calc(var(--size) * -0.335))
            rotate(calc((var(--s) * var(--seg) + (var(--seg) / 2)) * -1));
  width:calc(var(--size) * 0.26);
  font-family:var(--font-display);font-size:clamp(.6rem,1.5vw,.8rem);
  line-height:1.12;text-transform:uppercase;letter-spacing:.02em;
  text-align:center;pointer-events:none;
  color:var(--paper);
  text-shadow:0 1px 3px rgba(0,0,0,.55);
}
"""
s = s[:start] + new + s[end:]
open(C,"w",encoding="utf-8",newline="\n").write(s)
print("  label positioning replaced (upright orbital)")

# Shorter visible labels; the full name still lives in data-spin-items.
P="antonias/index.html"; h=open(P,encoding="utf-8").read()
SHORT = {
 "The Cheese Slice":"Cheese", "The Ajarski":"Ajarski", "The Supreme":"Supreme",
 "Garden Veggie":"Veggie", "BBQ Chicken":"BBQ", "Pies &amp; Wings":"Pies + Wings",
 "Pesto Chicken":"Pesto", "Gyro Pizza":"Gyro",
 "Free fountain drink":"Free drink", "10% off":"10% off",
 "Free garlic knots":"Garlic knots", "Better luck next time":"Try again",
 "Free extra topping":"Free topping", "$5 off":"$5 off", "Free cannoli":"Cannoli",
}
n=0
def sub(m):
    global n
    inner=m.group(2)
    if inner in SHORT and SHORT[inner]!=inner:
        n+=1
        return m.group(1)+SHORT[inner]+m.group(3)
    return m.group(0)
h=re.sub(r'(<span class="sw-label" style="--s:\d+">)(.*?)(</span>)', sub, h)
open(P,"w",encoding="utf-8",newline="\n").write(h)
print(f"  wheel labels shortened: {n}")
