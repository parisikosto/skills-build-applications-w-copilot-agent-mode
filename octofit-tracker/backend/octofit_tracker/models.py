from django.db import models
from django.contrib.auth.models import AbstractUser

class Team(models.Model):
    name = models.CharField(max_length=100, unique=True)
    def __str__(self):
        return self.name

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    team = models.ForeignKey(Team, on_delete=models.SET_NULL, null=True, blank=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    def __str__(self):
        return self.email

class Workout(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    def __str__(self):
        return self.name

class Activity(models.Model):
    user = models.ForeignKey('CustomUser', on_delete=models.CASCADE)
    workout = models.ForeignKey(Workout, on_delete=models.CASCADE)
    duration = models.PositiveIntegerField(help_text='Duration in minutes')
    calories = models.PositiveIntegerField(help_text='Calories burned')
    def __str__(self):
        return f"{self.user} - {self.workout}"

class Leaderboard(models.Model):
    user = models.ForeignKey('CustomUser', on_delete=models.CASCADE)
    score = models.IntegerField()
    def __str__(self):
        return f"{self.user} - {self.score}"
