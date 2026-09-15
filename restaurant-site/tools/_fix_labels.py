import sys
C="antonias/css/style.css"; s=open(C,encoding="utf-8").read()
old = """.sw-label{
  position:absolute;left:50%;top:50%;
  transform-origin:0 0;
  transform:rotate(calc(var(--s) * var(--seg) + (var(--seg) / 2)))
            translate(0, calc(var(--size) * -0.42));
  width:calc(var(--size) * 0.30);
  margin-left:calc(var(--size) * -0.15);
  font-family:var(--font-display);font-size:clamp(.62rem,1.5vw,.8rem);
  line-height:1.15;text-transform:uppercase;letter-spacing:.02em;
  text-align:center;pointer-events:none;
  color:var(--paper);
  text-shadow:0 1px 3px rgba(0,0,0,.5);
}"""
new = """.sw-label{
  position:absolute;left:50%;top:50%;
  /* Rotate onto the segment's centre line, then push out along it. The inner
     span flips the bottom half back so no label ever reads upside down. */
  transform:rotate(calc(var(--s) * var(--seg) + (var(--seg) / 2)))
            translateY(calc(var(--size) * -0.335));
  transform-origin:0 0;
  width:calc(var(--size) * 0.34);
  margin-left:calc(var(--size) * -0.17);
  font-family:var(--font-display);font-size:clamp(.58rem,1.35vw,.76rem);
  line-height:1.1;text-transform:uppercase;letter-spacing:.02em;
  text-align:center;pointer-events:none;
  overflow-wrap:anywhere;
  color:var(--paper);
  text-shadow:0 1px 3px rgba(0,0,0,.5);
}
/* Segments 2-5 sit on the lower half, where radial text would be upside down. */
.sw-label:nth-child(n+3):nth-child(-n+6){
  transform:rotate(calc(var(--s) * var(--seg) + (var(--seg) / 2) + 180deg))
            translateY(calc(var(--size) * 0.335 * -1));
  margin-left:calc(var(--size) * -0.17);
}"""
c=s.count(old); print("  label rule:", c)
if c!=1: sys.exit("ABORT")
s=s.replace(old,new,1)
open(C,"w",encoding="utf-8",newline="\n").write(s)
print("  labels flipped on the lower half")
