"""servir.py — servidor local de revisão, SEM CACHE.

Por que existe: em 02/Ago o founder reprovou três coisas que já estavam corrigidas em disco
(vídeo, aba de integrações, imagens em inglês). Estava vendo a versão em cache — os arquivos
mantêm o mesmo nome a cada build, então o Chrome não busca de novo. Um servidor de revisão
que responde 200 com cache é uma armadilha: faz revisar o passado.

Uso:  python servir.py            (porta 3021, serve a pasta 05-build)
      python servir.py 3030       (outra porta)
"""
import http.server
import socketserver
import os
import sys

PORTA = int(sys.argv[1]) if len(sys.argv) > 1 else 3021
RAIZ = os.path.dirname(os.path.abspath(__file__))


class SemCache(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=RAIZ, **kw)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def send_header(self, key, value):
        # descarta o validador que faria o navegador responder 304
        if key.lower() in ('last-modified', 'etag'):
            return
        super().send_header(key, value)

    def log_message(self, fmt, *args):
        pass  # silencia o log de acesso


class Reusavel(socketserver.TCPServer):
    allow_reuse_address = True


if __name__ == '__main__':
    with Reusavel(('127.0.0.1', PORTA), SemCache) as s:
        print(f'sem cache em http://127.0.0.1:{PORTA}/talos-site/index.html  (raiz: {RAIZ})')
        s.serve_forever()
