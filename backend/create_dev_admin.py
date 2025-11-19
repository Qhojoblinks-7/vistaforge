import secrets
from django.contrib.auth import get_user_model

U = get_user_model()
u = 'dev_admin'
p = secrets.token_urlsafe(12)

if not U.objects.filter(username=u).exists():
    U.objects.create_superuser(u, 'dev_admin@example.local', p)
    print('CREATED', u, p)
else:
    user = U.objects.get(username=u)
    user.set_password(p)
    user.save()
    print('UPDATED', u, p)
