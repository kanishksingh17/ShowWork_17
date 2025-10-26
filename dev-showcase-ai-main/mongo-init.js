// MongoDB initialization script
db = db.getSiblingDB('showwork');

// Create user for the application
db.createUser({
  user: 'showwork_user',
  pwd: 'showwork_password',
  roles: [
    {
      role: 'readWrite',
      db: 'showwork'
    }
  ]
});

// Create collections
db.createCollection('users');
db.createCollection('skills');
db.createCollection('quizattempts');
db.createCollection('projects');
db.createCollection('reminders');

print('Database initialized successfully');
