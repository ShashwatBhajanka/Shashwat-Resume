from pathlib import Path
from django.conf import settings
from django.http import HttpResponse
from django.shortcuts import render

def spa_view(request):
    index_path = Path(settings.STATICFILES_DIRS[0]) / 'index.html'
    if index_path.exists():
        with open(index_path) as f:
            return HttpResponse(f.read())
    return HttpResponse('Frontend not built. Run: cd portfolio-frontend && bun run build', status=503)
