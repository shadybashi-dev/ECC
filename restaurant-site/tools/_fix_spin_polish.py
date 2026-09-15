import sys
C="antonias/css/style.css"; s=open(C,encoding="utf-8").read()
old=".sw-hub:disabled{opacity:.55;cursor:not-allowed}"
new=""".sw-hub:disabled{
  /* Not opacity: a translucent hub lets the segments show through and reads
     as a rendering bug rather than a spent button. */
  cursor:default;background:var(--sky-2);color:var(--navy);
  border-color:var(--navy);box-shadow:none;
}"""
if s.count(old)!=1: sys.exit("ABORT hub")
s=s.replace(old,new,1)
open(C,"w",encoding="utf-8",newline="\n").write(s)
print("  disabled hub restyled")

J="antonias/js/main.js"; j=open(J,encoding="utf-8").read()
o1='''      const k = document.createElement("div");
      k.className = "sw-k";
      k.textContent = replay ? item.name : (win ? item.name : item.name);
      const n = document.createElement("div");
      n.className = "sw-n";
      n.textContent = replay ? "You already spun today — " + (item.note || "") : (item.note || "");'''
n1='''      const k = document.createElement("div");
      k.className = "sw-k";
      k.textContent = item.name;
      const n = document.createElement("div");
      n.className = "sw-n";
      n.textContent = replay
        ? (item.note ? item.note + " · already claimed" : "Already claimed")
        : (item.note || "");'''
if j.count(o1)!=1: sys.exit("ABORT copy")
j=j.replace(o1,n1,1)
open(J,"w",encoding="utf-8",newline="\n").write(j)
print("  replay copy reworded")
