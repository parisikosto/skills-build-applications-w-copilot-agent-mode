
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from .models import Team, CustomUser, Workout, Activity, Leaderboard

class BasicModelTest(TestCase):
	def test_team_creation(self):
		team = Team.objects.create(name="Test Team")
		self.assertEqual(str(team), "Test Team")

	def test_user_creation(self):
		team = Team.objects.create(name="Test Team")
		user = CustomUser.objects.create_user(email="test@example.com", username="testuser", password="pass", team=team)
		self.assertEqual(str(user), "test@example.com")

	def test_workout_creation(self):
		workout = Workout.objects.create(name="Pushups", description="Pushup workout")
		self.assertEqual(str(workout), "Pushups")

	def test_activity_creation(self):
		team = Team.objects.create(name="Test Team")
		user = CustomUser.objects.create_user(email="test@example.com", username="testuser", password="pass", team=team)
		workout = Workout.objects.create(name="Pushups", description="Pushup workout")
		activity = Activity.objects.create(user=user, workout=workout, duration=30, calories=100)
		self.assertIn("test@example.com", str(activity))

	def test_leaderboard_creation(self):
		team = Team.objects.create(name="Test Team")
		user = CustomUser.objects.create_user(email="test@example.com", username="testuser", password="pass", team=team)
		leaderboard = Leaderboard.objects.create(user=user, score=100)
		self.assertIn("test@example.com", str(leaderboard))

class APIRootTest(TestCase):
	def setUp(self):
		self.client = APIClient()

	def test_api_root(self):
		response = self.client.get(reverse('api-root'))
		self.assertEqual(response.status_code, 200)
