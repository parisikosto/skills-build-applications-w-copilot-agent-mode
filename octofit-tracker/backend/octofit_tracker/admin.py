
from django.contrib import admin
from .models import CustomUser, Team, Workout, Activity, Leaderboard

admin.site.register(CustomUser)
admin.site.register(Team)
admin.site.register(Workout)
admin.site.register(Activity)
admin.site.register(Leaderboard)
