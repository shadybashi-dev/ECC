#!/usr/bin/env python3
"""Cinematic spot builder: images -> Ken Burns segments -> xfade chain -> VO mux."""
import subprocess, sys, argparse, re, os

FF = subprocess.run([sys.executable, '-c', 'import imageio_ffmpeg;print(imageio_ffmpeg.get_ffmpeg_exe())'],
                    capture_output=True, text=True).stdout.strip()

def run(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        print('CMD FAILED:', ' '.join(cmd)); print(r.stderr[-2500:]); sys.exit(1)

def dur(path):
    r = subprocess.run([FF, '-i', path], capture_output=True, text=True)
    m = re.search(r'Duration: (\d+):(\d+):([\d.]+)', r.stderr)
    if not m: return 0.0
    h, mn, s = m.groups()
    return int(h)*3600 + int(mn)*60 + float(s)

def zoompan(kind, frames):
    c = f'd={frames}:s=1920x1080:fps=25'
    if kind == 'in':   return f"zoompan=z='min(1.0+0.0010*on,1.13)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':{c}"
    if kind == 'out':  return f"zoompan=z='max(1.13-0.0010*on,1.0)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':{c}"
    if kind == 'lr':   return f"zoompan=z='1.10':x='(iw-iw/zoom)*on/{frames-1}':y='(ih-ih/zoom)/2':{c}"
    if kind == 'rl':   return f"zoompan=z='1.10':x='(iw-iw/zoom)*(1-on/{frames-1})':y='(ih-ih/zoom)/2':{c}"
    if kind == 'inslow': return f"zoompan=z='min(1.0+0.00032*on,1.04)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':{c}"

def seg(img, frames, kind, out):
    run([FF, '-y', '-loglevel', 'error', '-i', img, '-filter_complex',
         f"scale=2560:1440:force_original_aspect_ratio=increase:flags=lanczos,crop=2560:1440,{zoompan(kind, frames)},format=yuv420p",
         '-frames:v', str(frames), '-c:v', 'libx264', '-preset', 'superfast', '-crf', '18', out])

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--images', nargs='+', required=True)
    ap.add_argument('--endcard', required=True)
    ap.add_argument('--vo')
    ap.add_argument('--out', required=True)
    ap.add_argument('--seg-sec', type=float, default=4.0)
    ap.add_argument('--fade', type=float, default=0.8)
    ap.add_argument('--tag', default='b')
    a = ap.parse_args()

    os.makedirs('work', exist_ok=True)
    os.makedirs(os.path.dirname(a.out) or '.', exist_ok=True)
    fps = 25
    n = len(a.images)
    kinds = ['in', 'out', 'lr', 'rl']
    vo_d = dur(a.vo) if a.vo else 0.0

    # endcard long enough to cover the VO
    body = n * a.seg_sec - (n - 1) * a.fade          # body duration w/o endcard
    total_wo_end = body + 0 - a.fade                  # endcard joins with one more fade
    want_end = vo_d + 0.6 - total_wo_end if vo_d else a.seg_sec
    end_frames = max(int(a.seg_sec * fps), round(want_end * fps))

    segs = []
    for i, img in enumerate(a.images):
        out = f'work/{a.tag}_{i:02d}.mp4'
        seg(img, int(a.seg_sec * fps), kinds[i % 4], out)
        segs.append(out)
        print(f'  seg {i+1}/{n} OK ({kinds[i%4]})')
    end_out = f'work/{a.tag}_end.mp4'
    seg(a.endcard, end_frames, 'inslow', end_out)
    segs.append(end_out)
    print(f'  endcard OK ({end_frames} frames = {end_frames/fps:.1f}s)')

    durs = [a.seg_sec] * n + [end_frames / fps]
    cur = durs[0]
    lines, inputs = [], []
    for i in range(len(segs)):
        inputs += ['-i', segs[i]]
    for i in range(1, len(segs)):
        off = cur - a.fade
        outl = f'[v{i}]' if i < len(segs) - 1 else '[vout]'
        prev = '[0:v]' if i == 1 else f'[v{i-1}]'
        lines.append(f'{prev}[{i}:v]xfade=transition=fade:duration={a.fade}:offset={off:.3f}{outl}')
        cur = off + durs[i]
    silent = f'work/{a.tag}_silent.mp4'
    run([FF, '-y', '-loglevel', 'error'] + inputs + ['-filter_complex', ';'.join(lines),
         '-map', '[vout]', '-c:v', 'libx264', '-preset', 'superfast', '-crf', '18',
         '-movflags', '+faststart', silent])
    print(f'  silent master: {cur:.1f}s')

    if a.vo:
        run([FF, '-y', '-loglevel', 'error', '-i', silent, '-i', a.vo, '-filter_complex',
             f'[1:a]afade=t=in:st=0:d=0.25,apad=whole_dur={cur:.3f}[a]', '-map', '0:v', '-map', '[a]',
             '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest',
             '-movflags', '+faststart', a.out])
    else:
        run(['cp', silent, a.out])
    print(f'DONE {a.out} -> {dur(a.out):.1f}s (vo {vo_d:.1f}s)')

if __name__ == '__main__':
    main()
