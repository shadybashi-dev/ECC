def lum(h):
    h = h.lstrip('#')
    r, g, b = [int(h[i:i+2], 16) / 255 for i in (0, 2, 4)]
    f = lambda c: c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
    r, g, b = f(r), f(g), f(b)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b

def ratio(a, b):
    l1, l2 = sorted([lum(a), lum(b)], reverse=True)
    return (l1 + 0.05) / (l2 + 0.05)

navy, paper, sun, red = "#0e3a52", "#fffdf7", "#ffd23f", "#e2492f"
for label, fg, bg in [("navy on sun", navy, sun),
                      ("paper on navy", paper, navy),
                      ("navy on red  <-- prize wheel", navy, red),
                      ("paper on red", paper, red)]:
    r = ratio(fg, bg)
    print(f"  {label:32} {r:5.2f}  {'PASS' if r >= 3.0 else 'FAIL'} (large-text AA needs 3.0)")
