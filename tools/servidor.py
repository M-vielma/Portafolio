"""Servidor local para desarrollo, sin cache.

El servidor que trae Python cachea los archivos, asi que al editar el CSS o
el JS el navegador sigue mostrando la version vieja y uno cree que el cambio
no funciono. Este manda cabeceras que lo prohiben.

    python tools/servidor.py [puerto]
"""

import sys
from functools import partial
from http.server import HTTPServer, SimpleHTTPRequestHandler
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent


class SinCache(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def log_message(self, formato, *args):
        # Silencia una linea por cada archivo: solo interesan los errores.
        if args and str(args[1]).startswith(("4", "5")):
            super().log_message(formato, *args)


def main():
    puerto = int(sys.argv[1]) if len(sys.argv) > 1 else 8081
    manejador = partial(SinCache, directory=str(RAIZ))
    servidor = HTTPServer(("127.0.0.1", puerto), manejador)
    print(f"Sirviendo {RAIZ} en http://127.0.0.1:{puerto}  (sin cache)")
    servidor.serve_forever()


if __name__ == "__main__":
    main()
