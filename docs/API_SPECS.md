# process-api-habits



# Base URL


| URL | Description |
|-----|-------------|


# Authentication



## Security Schemes

| Name              | Type              | Description              | Scheme              | Bearer Format             |
|-------------------|-------------------|--------------------------|---------------------|---------------------------|
| OAuth2PasswordBearer | oauth2 |  |  |  |

# APIs

## GET /api/v1/habits/

Read Habits





### Responses

#### 200


Successful Response


array







## POST /api/v1/habits/

Create Habit





### Request Body

[HabitCreate](#habitcreate)







### Responses

#### 200


Successful Response


[Habit](#habit)







#### 422


Validation Error


[HTTPValidationError](#httpvalidationerror)







## GET /api/v1/habits/{id}

Read Habit



### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | string | True |  |


### Responses

#### 200


Successful Response


[Habit](#habit)







#### 422


Validation Error


[HTTPValidationError](#httpvalidationerror)







## DELETE /api/v1/habits/{id}

Delete Habit



### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | string | True |  |


### Responses

#### 200


Successful Response


[Habit](#habit)







#### 422


Validation Error


[HTTPValidationError](#httpvalidationerror)







## PUT /api/v1/habits/{id}

Update Habit



### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | string | True |  |


### Request Body

[HabitUpdate](#habitupdate)







### Responses

#### 200


Successful Response


[Habit](#habit)







#### 422


Validation Error


[HTTPValidationError](#httpvalidationerror)







## GET /api/v1/entries/

Read Habit Entries



### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| date |  | False |  |


### Responses

#### 200


Successful Response


array







#### 422


Validation Error


[HTTPValidationError](#httpvalidationerror)







## POST /api/v1/entries/

Create Habit Entry





### Request Body

[HabitEntryBase](#habitentrybase)







### Responses

#### 200


Successful Response


[HabitEntry](#habitentry)







#### 422


Validation Error


[HTTPValidationError](#httpvalidationerror)







## PUT /api/v1/entries/{id}

Update Habit Entry



### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| id | string | True |  |


### Request Body

[HabitEntryUpdate](#habitentryupdate)







### Responses

#### 200


Successful Response


[HabitEntry](#habitentry)







#### 422


Validation Error


[HTTPValidationError](#httpvalidationerror)







## GET /api/v1/entries/today

Get Todays Entries



### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| selected_date |  | False |  |


### Responses

#### 200


Successful Response


array







#### 422


Validation Error


[HTTPValidationError](#httpvalidationerror)







## GET /api/v1/entries/calendar

Get Calendar Entries



### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| start_date |  | False |  |
| end_date |  | False |  |


### Responses

#### 200


Successful Response


array







#### 422


Validation Error


[HTTPValidationError](#httpvalidationerror)







## POST /api/v1/auth/register

Register



### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| username | string | True |  |
| password | string | True |  |


### Responses

#### 200


Successful Response








#### 422


Validation Error


[HTTPValidationError](#httpvalidationerror)







## POST /api/v1/auth/login

Login





### Request Body

[Body_login_api_v1_auth_login_post](#body_login_api_v1_auth_login_post)







### Responses

#### 200


Successful Response








#### 422


Validation Error


[HTTPValidationError](#httpvalidationerror)







## POST /api/v1/auth/refresh

Refresh





### Responses

#### 200


Successful Response








## GET /api/v1/auth/me

Get Me





### Responses

#### 200


Successful Response








## GET /

Read Root





### Responses

#### 200


Successful Response








# Components



## Body_login_api_v1_auth_login_post



| Field | Type | Description |
|-------|------|-------------|
| grant_type |  |  |
| username | string |  |
| password | string |  |
| scope | string |  |
| client_id |  |  |
| client_secret |  |  |


## CalendarHabitEntry



| Field | Type | Description |
|-------|------|-------------|
| log_date | string |  |
| completion_percentage | integer |  |


## HTTPValidationError



| Field | Type | Description |
|-------|------|-------------|
| detail | array |  |


## Habit



| Field | Type | Description |
|-------|------|-------------|
| name | string |  |
| description |  |  |
| current_target_value | integer |  |
| frequency | string |  |
| unit |  |  |
| id | string |  |
| user_id | string |  |
| created_at | string |  |


## HabitCreate



| Field | Type | Description |
|-------|------|-------------|
| name | string |  |
| description |  |  |
| current_target_value | integer |  |
| frequency | string |  |
| unit |  |  |


## HabitEntry



| Field | Type | Description |
|-------|------|-------------|
| habit_id | string |  |
| log_date | string |  |
| value | integer |  |
| target_snapshot | integer |  |
| notes |  |  |
| id | string |  |
| user_id | string |  |
| created_at | string |  |


## HabitEntryBase



| Field | Type | Description |
|-------|------|-------------|
| habit_id | string |  |
| log_date | string |  |
| value | integer |  |
| target_snapshot | integer |  |
| notes |  |  |


## HabitEntryUpdate



| Field | Type | Description |
|-------|------|-------------|
| log_date |  |  |
| value |  |  |
| target_snapshot |  |  |
| notes |  |  |
| completed_at |  |  |


## HabitTodayEntry



| Field | Type | Description |
|-------|------|-------------|
| habit_id | string |  |
| log_date | string |  |
| value | integer |  |
| target_snapshot | integer |  |
| notes |  |  |
| habit |  |  |
| id | string |  |
| user_id | string |  |
| created_at | string |  |


## HabitUpdate



| Field | Type | Description |
|-------|------|-------------|
| name |  |  |
| description |  |  |
| target_value |  |  |
| frequency |  |  |
| unit |  |  |


## ValidationError



| Field | Type | Description |
|-------|------|-------------|
| loc | array |  |
| msg | string |  |
| type | string |  |
