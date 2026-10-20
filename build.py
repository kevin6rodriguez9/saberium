#!/usr/bin/env python3
"""Une css y js en un solo archivo. Genera dist/index.html (completo) y dist/artifact.html (sin html/head/body)."""
import pathlib
root = pathlib.Path(__file__).parent
css = (root / 'css/styles.css').read_text(encoding='utf-8')
order = ['data', 'core', 'progress', 'game', 'screens', 'main']
js = '\n'.join((root / f'js/{n}.js').read_text(encoding='utf-8') for n in order)
fonts = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;600;700;800&family=Unbounded:wght@700;900&display=swap">'
head = f'''<title>Saberium</title>
<meta name="claude:viewport-fit-sides" content="cover">
<meta name="description" content="Saberium: juego educativo de matemáticas, ciencias, sociales, humanidades y artes.">
{fonts}
<style>
{css}
</style>'''
body = f'''<header id="top" hidden></header>
<div id="app" class="screen" tabindex="-1"></div>
<canvas id="fx" aria-hidden="true"></canvas>
<div id="toasts" role="status" aria-live="polite"></div>
<noscript>Saberium necesita JavaScript para funcionar.</noscript>
<script>
{js}
</script>'''
(root / 'dist').mkdir(exist_ok=True)
(root / 'dist/artifact.html').write_text(head + '\n' + body, encoding='utf-8')
full = '<!doctype html>\n<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n' + head + '\n</head><body>\n' + body + '\n</body></html>'
(root / 'dist/index.html').write_text(full, encoding='utf-8')
print('ok', len(full) // 1024, 'KB')
