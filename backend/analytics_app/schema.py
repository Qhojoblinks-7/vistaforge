import graphene
from django.db.models import Sum, Count, Avg, F, Q
from django.db.models.functions import TruncMonth, ExtractMonth, ExtractYear
from django.utils import timezone
from datetime import timedelta
from projects_app.models import Project, UserGoals
from time_logs_app.models import TimeLog
from invoices_app.models import Invoice
from clients_app.models import Client


class AnalyticsQuery(graphene.ObjectType):
    business_analytics = graphene.Field(graphene.JSONString)

    @staticmethod
    def resolve_business_analytics(root, info):
        if not info.context.user or not info.context.user.is_authenticated:
            return {}

        user = info.context.user
        now = timezone.now()
        this_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        last_month = (this_month - timedelta(days=1)).replace(day=1)

        # Get all projects for this user
        projects = Project.objects.filter(user=user)

        # Calculate total revenue (from paid invoices)
        total_revenue = Invoice.objects.filter(
            project__user=user,
            status='PAID'
        ).aggregate(total=Sum('total'))['total'] or 0

        # Calculate total hours logged
        total_hours = TimeLog.objects.filter(
            client__user=user
        ).aggregate(total=Sum('duration_minutes'))['total'] or 0
        total_hours = round(total_hours / 60, 1)  # Convert to hours

        # Calculate average rate
        if total_hours > 0:
            average_rate = round(total_revenue / total_hours, 2)
        else:
            average_rate = 0

        # Calculate monthly growth
        this_month_revenue = Invoice.objects.filter(
            project__user=user,
            status='PAID',
            issue_date__gte=this_month
        ).aggregate(total=Sum('total'))['total'] or 0

        last_month_revenue = Invoice.objects.filter(
            project__user=user,
            status='PAID',
            issue_date__gte=last_month,
            issue_date__lt=this_month
        ).aggregate(total=Sum('total'))['total'] or 0

        if last_month_revenue > 0:
            monthly_growth = round(((this_month_revenue - last_month_revenue) / last_month_revenue) * 100, 1)
        else:
            monthly_growth = 0

        # Monthly revenue trend (last 6 months)
        six_months_ago = now - timedelta(days=180)
        monthly_revenue = Invoice.objects.filter(
            project__user=user,
            status='PAID',
            issue_date__gte=six_months_ago
        ).annotate(
            month=TruncMonth('issue_date')
        ).values('month').annotate(
            amount=Sum('total')
        ).order_by('month')

        monthly_revenue_data = []
        for item in monthly_revenue:
            monthly_revenue_data.append({
                'month': item['month'].strftime('%b'),
                'amount': float(item['amount'])
            })

        # Top performing clients - calculate revenue separately due to complex relationships
        clients = Client.objects.filter(user=user)
        top_clients_data = []

        for client in clients:
            # Calculate revenue for this client
            client_revenue = Invoice.objects.filter(
                client=client,
                status='PAID'
            ).aggregate(total=Sum('total'))['total'] or 0

            # Calculate billable hours for this client
            client_hours = TimeLog.objects.filter(
                client=client,
                is_billable=True
            ).aggregate(total=Sum('duration_minutes'))['total'] or 0
            client_hours = round(client_hours / 60, 1)  # Convert to hours

            if client_revenue > 0:  # Only include clients with revenue
                top_clients_data.append({
                    'name': client.name,
                    'revenue': f"${float(client_revenue):,.0f}",
                    'hours': f"{client_hours:.0f}h",
                    'revenue_value': client_revenue  # For sorting
                })

        # Sort by revenue and take top 3
        top_clients_data.sort(key=lambda x: x['revenue_value'], reverse=True)
        top_clients_data = top_clients_data[:3]

        # Remove the sorting key before returning
        for client in top_clients_data:
            del client['revenue_value']

        # Project performance
        completed_projects = projects.filter(status='COMPLETED').count()
        active_projects = projects.filter(status='IN_PROGRESS').count()
        total_projects_count = projects.count()

        if total_projects_count > 0:
            avg_project_value = total_revenue / total_projects_count
        else:
            avg_project_value = 0

        # Time tracking summary
        this_week_start = now - timedelta(days=now.weekday())
        this_week_start = this_week_start.replace(hour=0, minute=0, second=0, microsecond=0)

        this_month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)

        week_hours = TimeLog.objects.filter(
            client__user=user,
            start_time__gte=this_week_start
        ).aggregate(total=Sum('duration_minutes'))['total'] or 0
        week_hours = round(week_hours / 60, 1)

        month_hours = TimeLog.objects.filter(
            client__user=user,
            start_time__gte=this_month_start
        ).aggregate(total=Sum('duration_minutes'))['total'] or 0
        month_hours = round(month_hours / 60, 1)

        billable_hours = TimeLog.objects.filter(
            client__user=user,
            is_billable=True
        ).aggregate(total=Sum('duration_minutes'))['total'] or 0

        total_hours_all = TimeLog.objects.filter(
            client__user=user
        ).aggregate(total=Sum('duration_minutes'))['total'] or 0

        if total_hours_all > 0:
            billable_rate = round((billable_hours / total_hours_all) * 100)
        else:
            billable_rate = 0

        # Get user goals
        try:
            user_goals = UserGoals.objects.get(user=user)
            goals_data = {
                'monthlyRevenueGoal': {
                    'current': this_month_revenue,
                    'target': float(user_goals.monthly_revenue_target) if user_goals.monthly_revenue_target else None
                },
                'clientSatisfaction': {
                    'current': float(user_goals.current_client_satisfaction) if user_goals.current_client_satisfaction else None,
                    'target': float(user_goals.client_satisfaction_target) if user_goals.client_satisfaction_target else None
                }
            }
        except UserGoals.DoesNotExist:
            goals_data = {
                'monthlyRevenueGoal': {'current': this_month_revenue, 'target': None},
                'clientSatisfaction': {'current': None, 'target': None}
            }

        return {
            'totalRevenue': f"${total_revenue:,.0f}",
            'totalHours': f"{total_hours:.1f}",
            'averageRate': f"${average_rate:.0f}/hr",
            'monthlyGrowth': f"{monthly_growth:+.1f}%",
            'monthlyRevenue': monthly_revenue_data,
            'topClients': top_clients_data,
            'projectPerformance': {
                'completedProjects': completed_projects,
                'activeProjects': active_projects,
                'averageProjectValue': f"${avg_project_value:,.0f}"
            },
            'timeTracking': {
                'thisWeek': f"{week_hours:.1f}h",
                'thisMonth': f"{month_hours:.1f}h",
                'billableRate': f"{billable_rate}%"
            },
            'goals': goals_data
        }


class AnalyticsMutation(graphene.ObjectType):
    pass


analytics_schema = graphene.Schema(
    query=AnalyticsQuery,
    mutation=AnalyticsMutation
)