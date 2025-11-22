#!/usr/bin/env python3
"""
Export all projects from the database to a README file and then clear the database.
Run with: python manage.py shell < scripts/export_and_clear_projects.py
"""
import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from projects_app.models import Project

def export_projects_to_readme():
    """Export all projects to a README file"""
    projects = Project.objects.all()

    with open('PROJECTS_README.md', 'w') as f:
        f.write('# Exported Projects\n\n')
        f.write(f'Total projects: {projects.count()}\n\n')

        for project in projects:
            f.write(f'## {project.title}\n\n')
            f.write(f'- **ID**: {project.id}\n')
            f.write(f'- **Name**: {project.name}\n')
            f.write(f'- **Slug**: {project.slug}\n')
            f.write(f'- **Description**: {project.description or "N/A"}\n')
            f.write(f'- **Status**: {project.status}\n')
            f.write(f'- **Project Phase**: {project.project_phase}\n')
            f.write(f'- **Budget**: {project.budget}\n')
            f.write(f'- **Start Date**: {project.start_date}\n')
            f.write(f'- **End Date**: {project.end_date}\n')
            f.write(f'- **Is Active**: {project.is_active}\n')
            f.write(f'- **Design Tools**: {project.design_tools}\n')
            f.write(f'- **Client**: {project.client.name if project.client else "N/A"}\n')
            f.write(f'- **Created At**: {project.created_at}\n')
            f.write(f'- **Updated At**: {project.updated_at}\n')
            f.write('\n---\n\n')

    print(f'Exported {projects.count()} projects to PROJECTS_README.md')

def clear_database():
    """Clear all projects from the database"""
    count = Project.objects.count()
    Project.objects.all().delete()
    print(f'Cleared {count} projects from the database')

# Run the functions
export_projects_to_readme()
clear_database()
print('Operation completed successfully!')