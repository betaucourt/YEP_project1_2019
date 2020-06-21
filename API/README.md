# Requirements

PhP >= 7.3, Apache/httpd, Mysql, (Optional) phpMyAdmin

# install dependencies

`composer install`

# Check ./.env

If it does not exist : `touch .env`
"DATABASE_URL="mysql://db_user:db_password@127.0.0.1:3306/db_name"

# Creating Database

`php bin/console doctrine:database:create`

# Updating Database Schema

`php bin/console doctrine:schema:update --force`

# generating client oauth (Information available in mysql/PhPMyAdmin in "client" )

`php bin/console fos:oauth-server:create-client --grant-type="password"`


# Run server

`php bin/console server:run`
Default url: 127.0.0.1:8000

# Routes list

POST: /api/user
    params = body:{'username', 'email, 'password'}
    return = User créé/non créé



POST: /oauth/v2/token:
    params = body:{'username', 'password', 'client_id', 'client_secret', 'grant_type': 'password'}
    return = Bearer token, expiration (milisecond), refresh_token
POST: /oauth/v2/token:
    params = param:{'username', 'password', 'client_id', 'client_secret', 'grant_type': 'password'}
    return = Bearer token, expiration (milisecond), refresh_token
(Les deux ont les même paramètres/retour, juste type de route différent)

# Important
Every route under this line REQUIRES:
Authorization header with access_token:
(Authorization: {bearer: 'access_token'})
AND header:
{'Content_type' : 'application\json' / 'application\x-www-form-urlencoded'}
# Important

## User

GET: /api/user
    params = Authorization {Bearer: access_token}
    return = User
PUT: /api/user  (each parameters is optional)
    params = name / email / password / favorite(ex: "1,2,3,4", separator = ',')
    return = name/email/password/favorite modified or not modified


## Project
POST: /api/project (where creator is set with authorization access_token):
    params = body('name', 'description')
    return = ok/not ok

GET: /api/project/{id} (where id == project id)
    params = none
    return = Project

PUT: /api/project/{id} (where id == project_id)
    params = body('name', 'description')
    return = modified part/not modified part
DELETE: /api/project/{id} {where id == project_id}
    params = none
    return = project deleted/not deleted

## Ticket

POST: /api/project/{id}/ticket (where id == project_id)
    params = body('name', 'description', 'user_id', 'category')
    return = created/not created

GET: /api/project/{id}/ticket (where id == project_id)
    params = none
    return = All tickets that belong to project

GET: /api/project/{id}/ticket/{ticket_id} (where id == project_id)
    params = none
    return = ticket that match thoses id

DELETE: /api/project/{id}/ticket/{id} {where id == project_id // ticket_id}
    params = none
    return = ticket deleted/not deleted



## List
All routes: /api/doc

# Entities
auth_code / access_token / client : Belong to Oauth service

User (id, username, email, password, favorites)
Project (id, name, description, creation_date, modification_date, users, creator, tickets)
Ticket (id, name, description, project, user, creation_date, modification_date, category)