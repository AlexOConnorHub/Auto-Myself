# MyCar-TotalControl

This is a mobile app written in React Native for taking control of vehicle maintainance.

## Build

- `npm install`
- `npx expo prebuild`
- `npx expo run:android`

## TODO

- [ ] Add sync from WatermelonDB to Supabase
  - [ ] Write Postgres functions to sync data. While it's more work, I believe it would be more secure. This should also make supporting family accounts easier/safer.
- [ ] Make/Model
  - [ ] Make dropdown
- [ ] Pop-up menu
  - [ ] On long press themed
  - [ ] Consistant for cars and maintainaces
- [X] Car
  - [X] estimated annual "mileage" should be changed
    - [X] Utilize km/mi setting
    - [X] Remeber to store as Miles only
- [ ] Maintainance
  - [ ] Add list of pre-loaded Maintainance Types
- [X] Defaults to "mi" for new users
  - [X] Change to "Miles" like it should be
