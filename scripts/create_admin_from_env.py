#!/usr/bin/env python3
"""
Create or update a Django superuser from environment variables.
Intended to be run during deploy as a one-off step, e.g.:

python manage.py shell -c "exec(open('scripts/create_admin_from_env.py').read())"

Environment variables used:
- ADMIN_USER (required)
- ADMIN_EMAIL (required)
- ADMIN_PASSWORD (required)

If any are missing the script exits without making changes.
"""
import os
import sys

ADMIN_USER = os.getenv('ADMIN_USER')
ADMIN_EMAIL = os.getenv('ADMIN_EMAIL')
ADMIN_PASSWORD = os.getenv('ADMIN_PASSWORD')

if not (ADMIN_USER and ADMIN_EMAIL and ADMIN_PASSWORD):
    print('ADMIN_USER/ADMIN_EMAIL/ADMIN_PASSWORD not fully set — skipping admin creation')
    sys.exit(0)

print('Running create_admin_from_env for', ADMIN_USER)

from django.contrib.auth import get_user_model

U = get_user_model()

try:
    user = U.objects.filter(username=ADMIN_USER).first()
    if not user:
        U.objects.create_superuser(ADMIN_USER, ADMIN_EMAIL, ADMIN_PASSWORD)
        print('CREATED', ADMIN_USER)
    else:
        user.email = ADMIN_EMAIL
        user.set_password(ADMIN_PASSWORD)
        user.is_superuser = True
        user.is_staff = True
        user.save()
        print('UPDATED', ADMIN_USER)
except Exception as e:
    print('ERROR creating/updating admin:', e)
    raise
