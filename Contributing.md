# Contribution Guildlines

## Coding Standards

### Code Placement

This is a React Native **JavaScript** project. This project at the moment is using the [Expo](https://expo.io/) framework.

| Path | Description |
| --- | --- |
| `App.js` | The main entry point of the application. |
| `assets/` | Contains all the graphical assets used in the application. |
| `components/` | Contains all the reusable components used in the application and theming. **ALL** componet imports in views come from [elements.js](components\elements.js). |
| `database/` | Contains all the local database related code. |
| `helpers/` | Contains all the helper functions used in the application. |
| `secrets/` | Contains all the secret keys and tokens used in the application. Everything in here is ignored by git. |
| `supabase/` | Contains all the supabase related migrations. |
| `views/` | Contains all the views of the application. |

### Database

A couple reasons for UUID primary keys:

- UUIDs can be generated on the client side, which is basically required for this offline-first application.
- UUIDs cannot be (easily) guessed, which is a security feature.

The naming conventions are simply to keep things consistent and easy to read. While this is the convention I am used to, I believe this is a common convention.

#### Tables

- Table names should be plural and snake_case.
- Table names should be lowercase.
- Tables that are "intermediary tables" (facilitating many-to-many relationships) should be named after the two tables they are connecting, in alphabetical order, separated by an underscore eg. `first_widgets_second_widgets`.
- Table should have an `id` column with a `uuid` type.
- Forign keys should be named as `table_name_id`.
- Columns should be singular and snake_case.
- Columns should be lowercase.

#### Functions

- Function names should be snake_case.
- Function names should be lowercase.
- Function names should be prefixed with `wdb_`.

##### Good Database Examples

```sql
CREATE TABLE users (
    id uuid PRIMARY KEY,
    name text NOT NULL,
    email text NOT NULL,
    password text NOT NULL
);

CREATE TABLE posts (
    id uuid PRIMARY KEY,
    user_id uuid NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

-- For storing all contributors to a post
CREATE TABLE posts_users (
    post_id uuid NOT NULL,
    user_id uuid NOT NULL,
    FOREIGN KEY (post_id) REFERENCES posts (id),
    FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE OR REPLACE FUNCTION wdb_get_user_by_email(email text)
CREATE OR REPLACE FUNCTION wdb_create_user(name text, email text, password text)
```

###### Bad Database Examples

```sql
CREATE TABLE User (
    user_id int PRIMARY KEY,
    user_name text NOT NULL,
    user_email text NOT NULL,
    user_password text NOT NULL
);

CREATE TABLE Post (
    post_id int PRIMARY KEY,
    user_id int NOT NULL,
    post_title text NOT NULL,
    post_content text NOT NULL,
    FOREIGN KEY (user_id) REFERENCES User (user_id)
);

-- For storing all contributors to a post
CREATE TABLE UserPost (
    post_id int NOT NULL,
    user_id int NOT NULL,
    FOREIGN KEY (post_id) REFERENCES Post (post_id),
    FOREIGN KEY (user_id) REFERENCES User (user_id)
);

CREATE OR REPLACE FUNCTION GetUserByEmail(email text)
CREATE OR REPLACE FUNCTION createUser(name text, email text, password text)
```

## Feature Requests

If you have a feature request, please open an issue and describe the feature you would like to see. Please include a description of how this feature would help an end user, what scenarios it would be used in, and any other ways this feature would be useful. If possilbe, please include a description of what you would expect the application to provide to offer this feature to the end user. If you would like to implement the feature as well, please open a pull request with the feature and it will be reviewed.
