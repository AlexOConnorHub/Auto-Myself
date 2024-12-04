-- Created by Vertabelo (http://vertabelo.com)
-- Last modification date: 2024-11-25 02:40:40.155

DROP FUNCTION handle_new_user CASCADE;

-- views
DROP VIEW "all_permissions" CASCADE;

-- foreign keys
ALTER TABLE "car_maintenance_intervals"
    DROP CONSTRAINT "car_maintenance_intervals_users";

ALTER TABLE "car_maintenance_intervals"
    DROP CONSTRAINT "cars_maintainance_types_cars";

ALTER TABLE "car_maintenance_intervals"
    DROP CONSTRAINT "cars_maintainance_types_maintainance_types";

ALTER TABLE "permissions"
    DROP CONSTRAINT "cars_permissions";

ALTER TABLE "cars"
    DROP CONSTRAINT "cars_users";

ALTER TABLE "maintenance_records"
    DROP CONSTRAINT "maintainance_records_cars";

ALTER TABLE "maintenance_records"
    DROP CONSTRAINT "maintainance_records_maintainance_types";

ALTER TABLE "maintenance_records"
    DROP CONSTRAINT "maintenance_records_users";

ALTER TABLE "maintenance_types"
    DROP CONSTRAINT "maintenance_types_users";

ALTER TABLE "permissions"
    DROP CONSTRAINT "permissions_users";

ALTER TABLE "permissions"
    DROP CONSTRAINT "permissions_users_created";

-- tables
DROP TABLE "car_maintenance_intervals" CASCADE;

DROP TABLE "cars" CASCADE;

DROP TABLE "deleted" CASCADE;

DROP TABLE "maintenance_records" CASCADE;

DROP TABLE "maintenance_types" CASCADE;

DROP TABLE "permissions" CASCADE;

DROP TABLE "users" CASCADE;

DROP FUNCTION update_updated_at CASCADE;
DROP FUNCTION delete_record CASCADE;

-- End of file.

