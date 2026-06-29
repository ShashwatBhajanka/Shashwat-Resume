from django.shortcuts import render

def home_view(request):
    return render(request, 'home.html', {'name': 'Shashwat Bhajanka', 'section': 'home'})

def education_view(request):
    return render(request, 'education.html', {'name': 'Shashwat Bhajanka', 'section': 'education'})

def experience_view(request):
    return render(request, 'experience.html', {'name': 'Shashwat Bhajanka', 'section': 'experience'})

def clubs_view(request):
    return render(request, 'clubs.html', {'name': 'Shashwat Bhajanka', 'section': 'clubs'})

def skills_view(request):
    return render(request, 'skills.html', {'name': 'Shashwat Bhajanka', 'section': 'skills'})

def achievements_view(request):
    return render(request, 'achievements.html', {'name': 'Shashwat Bhajanka', 'section': 'achievements'})
