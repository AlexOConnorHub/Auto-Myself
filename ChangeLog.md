# Change Log

## 2.0.0

- Photos can now be added to maintenance records!
- When photos are not attached to a record, the settings page will have an "Abandoned Photos" section to view, download, and delete these items.
- Exported data is now in `.zip` format. Photos are located in the contained `files` directory and `data.json` contains all the data for vehicles and maintenance records, with references to the photo files.
- Improved UX for adding items not preexisting in dropdowns by adding "New Item" option, which when selected toggles the "Manual Entry" button and pre-fills the text input with the data from the search text input.

## 1.3.4

- Improved date handling in forms
- When dropdowns change to text inputs, the keyboard pops up and it is focused
- Lists no longer push buttons out of view

## 1.0.1

Initial Release!

Functionality:

- CRUD for cars and maintenance records
- Dark and Light mode
- WatermelonDB for offline storage
- Database stores distances in Miles, but setting for display of distances in Kilometers

## 1.0.2

- Removed KeyboardAvoidingView, as it was causing crashing bug (Discoverd by Google)
- Added some common maintenance types to the database
