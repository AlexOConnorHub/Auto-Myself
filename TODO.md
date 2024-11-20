# MyCar-TotalControl

This is a mobile app written in React Native for taking control of vehicle maintainance.

## Build

- `npm install`
- `npx expo prebuild`
- `npx expo run:android`

## TODO

### Car

- [ ] Make inclusive dropdown for "Make" and "Model"
- [ ] Form validation (content and length)
- [ ] Ability to change ownership of a car
- [ ] Ability to add a picture of the car

### Maintainance

- [ ] Form validation (content and length)
- [ ] Add notifications for upcoming maintainance
- [ ] Critique "est. annual usage" based on reported OD
- [ ] Pics of receipts
- [ ] Specify date of maintainance

### Families

- [ ] Add family members
- [ ] Add family cars

### Other

- [ ] Make a view to see upcoming/anticipated maintainance
- [ ] Automated Tests
- [ ] Sync WatermelonDB => Supabase
- [ ] Import/Export data
- [ ] Pop-up menu for cards
  - [ ] On long press themed
  - [ ] Consistant for cars and maintainaces
  - [ ] Assets: make look better
- [ ] Drop users table
- [ ] Remove created_at and updated_at fileds (as we only trust server, and client doesn't need this info)
- [ ] Add QR code generator/reader for UUID sharing related events (families and cars)
- [ ] Authentication
  - [X] Add captcha
  - [ ] Add "forgot password"
  - [ ] Add "change password"
  - [ ] Add "change email"
  - [X] Add Make password fields password type
