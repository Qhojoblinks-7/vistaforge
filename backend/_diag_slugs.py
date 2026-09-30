import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from projects_app.models import Project

rows = list(Project.objects.values_list("id", "title", "slug", "is_active", "user__username"))
print("projects in db:", len(rows))
for r in rows:
    print("  ", r)

slugs = {r[2] for r in rows}
expected = {"payflow", "agriconnect", "medlink", "edusmart", "shoplocal", "logichain"}
print()
print("testimonial slugs present:", sorted(expected & slugs))
print("testimonial slugs MISSING:", sorted(expected - slugs))
