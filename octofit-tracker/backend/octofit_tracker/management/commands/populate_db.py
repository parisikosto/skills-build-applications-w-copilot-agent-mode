from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from octofit_tracker.models import Team, Workout, Activity, Leaderboard

class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **options):
        User = get_user_model()
        # Clear all collections
        User.objects.all().delete()
        Team.objects.all().delete()
        Activity.objects.all().delete()
        Leaderboard.objects.all().delete()
        Workout.objects.all().delete()

        # Create Teams
        marvel = Team.objects.create(name='Marvel')
        dc = Team.objects.create(name='DC')

        # Create Users
        users = [
            User(email='tony@stark.com', username='ironman', team=marvel),
            User(email='steve@rogers.com', username='captainamerica', team=marvel),
            User(email='clark@kent.com', username='superman', team=dc),
            User(email='bruce@wayne.com', username='batman', team=dc),
        ]
        for user in users:
            user.set_password('password')
            user.save()

        # Create Workouts
        workout1 = Workout.objects.create(name='Flight Training', description='Aerial maneuvers and endurance')
        workout2 = Workout.objects.create(name='Strength Training', description='Weight lifting and resistance')

        # Create Activities
        Activity.objects.create(user=users[0], workout=workout1, duration=60, calories=500)
        Activity.objects.create(user=users[1], workout=workout2, duration=45, calories=400)
        Activity.objects.create(user=users[2], workout=workout2, duration=50, calories=420)
        Activity.objects.create(user=users[3], workout=workout1, duration=70, calories=600)

        # Create Leaderboard
        Leaderboard.objects.create(user=users[0], score=1500)
        Leaderboard.objects.create(user=users[1], score=1200)
        Leaderboard.objects.create(user=users[2], score=1300)
        Leaderboard.objects.create(user=users[3], score=1400)

        self.stdout.write(self.style.SUCCESS('octofit_db database populated with test data.'))
