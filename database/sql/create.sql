-- Created by Vertabelo (http://vertabelo.com)
-- Last modification date: 2024-11-25 02:40:40.155

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE FUNCTION delete_record()
RETURNS TRIGGER
SET search_path = public
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO deleted (table_name, record_id, deleted_at)
  VALUES (TG_TABLE_NAME, OLD.id, now());
  RETURN OLD;
END;
$$ language 'plpgsql';

GRANT USAGE ON SCHEMA "public" TO authenticated;;

-- tables
-- Table: car_maintenance_intervals
CREATE TABLE "car_maintenance_intervals" (
    "id" uuid  NOT NULL,
    "car_id" uuid  NOT NULL,
    "maintenance_type_id" uuid  NOT NULL,
    "miles_between" integer  NULL,
    "weeks_between" integer  NULL,
    "created_by" uuid  NOT NULL DEFAULT auth.uid(),
    "created_at" timestamptz  NOT NULL DEFAULT now(),
    "updated_at" timestamptz  NOT NULL DEFAULT now(),
    CONSTRAINT "car_maintenance_intervals_pk" PRIMARY KEY ("id")
);

CREATE INDEX "car_maintainance_intervals_idx_1" on "car_maintenance_intervals" ("car_id" ASC);

CREATE INDEX "car_maintainance_intervals_idx_2" on "car_maintenance_intervals" ("maintenance_type_id" ASC);

CREATE INDEX "car_maintenance_intervals_idx_3" on "car_maintenance_intervals" ("created_by" ASC);

CREATE OR REPLACE FUNCTION check_select_car_maintenance_intervals(maintenance_records_row "car_maintenance_intervals")
RETURNS BOOLEAN
SET search_path = public
SECURITY DEFINER AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM all_permissions
        WHERE user_id = (SELECT auth.uid())
          AND car_id = maintenance_records_row.car_id
          AND read = TRUE
    );
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION check_insert_car_maintenance_intervals(maintenance_records_row "car_maintenance_intervals")
RETURNS BOOLEAN
SET search_path = public
SECURITY DEFINER AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM all_permissions
        WHERE user_id = (SELECT auth.uid())
          AND car_id = maintenance_records_row.car_id
          AND write = TRUE
    );
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION check_update_car_maintenance_intervals(maintenance_records_row "car_maintenance_intervals")
RETURNS BOOLEAN
SET search_path = public
SECURITY DEFINER AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM all_permissions
        WHERE user_id = (SELECT auth.uid())
          AND car_id = maintenance_records_row.car_id
          AND write = TRUE
    );
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION check_delete_car_maintenance_intervals(maintenance_records_row "car_maintenance_intervals")
RETURNS BOOLEAN
SET search_path = public
SECURITY DEFINER AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM all_permissions
        WHERE user_id = (SELECT auth.uid())
          AND car_id = maintenance_records_row.car_id
          AND write = TRUE
    );
END;
$$ LANGUAGE plpgsql;

ALTER TABLE "car_maintenance_intervals" ENABLE ROW LEVEL SECURITY;

CREATE POLICY car_maintenance_intervals_select_policy ON "car_maintenance_intervals"
    FOR SELECT
   TO authenticated
    USING (check_select_car_maintenance_intervals(car_maintenance_intervals.*));

CREATE POLICY car_maintenance_intervals_insert_policy ON "car_maintenance_intervals"
    FOR INSERT
   TO authenticated
    WITH CHECK (check_insert_car_maintenance_intervals(car_maintenance_intervals.*));

CREATE POLICY car_maintenance_intervals_update_policy ON "car_maintenance_intervals"
    FOR UPDATE
   TO authenticated
    WITH CHECK (check_update_car_maintenance_intervals(car_maintenance_intervals.*));

CREATE POLICY car_maintenance_intervals_delete_policy ON "car_maintenance_intervals"
    FOR DELETE
   TO authenticated
    USING (check_delete_car_maintenance_intervals(car_maintenance_intervals.*));

GRANT SELECT,
  INSERT (id, car_id, maintenance_type_id, miles_between, weeks_between),
    UPDATE (miles_between, weeks_between),
    DELETE ON "car_maintenance_intervals" TO authenticated;

CREATE TRIGGER update_car_maintenance_intervals_updated_at
    BEFORE UPDATE ON "car_maintenance_intervals"
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

CREATE TRIGGER delete_car_maintenance_intervals_record
    BEFORE DELETE ON "car_maintenance_intervals"
    FOR EACH ROW EXECUTE PROCEDURE delete_record();;

-- Table: cars
CREATE TABLE "cars" (
    "id" uuid  NOT NULL,
    "make" text  NULL,
    "model" text  NULL,
    "year" integer  NULL,
    "vin" text  NULL,
    "lpn" text  NULL,
    "nickname" text  NULL,
    "annual_mileage" integer  NULL,
    "created_by" uuid  NOT NULL DEFAULT auth.uid(),
    "created_at" timestamptz  NOT NULL DEFAULT now(),
    "updated_at" timestamptz  NOT NULL DEFAULT now(),
    CONSTRAINT "id" PRIMARY KEY ("id")
);

CREATE INDEX "cars_idx_1" on "cars" ("created_by" ASC);

CREATE OR REPLACE FUNCTION check_select_cars(cars_row "cars")
RETURNS BOOLEAN
SET search_path = public
SECURITY DEFINER AS $$
BEGIN
    RETURN cars_row.created_by = (SELECT auth.uid()) OR EXISTS (
        SELECT 1 FROM all_permissions
        WHERE user_id = (SELECT auth.uid())
          AND car_id = cars_row.id
    );
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION check_update_cars(cars_row "cars")
RETURNS BOOLEAN
SET search_path = public
SECURITY DEFINER AS $$
BEGIN
    RETURN cars_row.created_by = (SELECT auth.uid()) OR EXISTS (
        SELECT 1 FROM all_permissions
        WHERE user_id = (SELECT auth.uid())
          AND car_id = cars_row.id
          AND write = true
    );
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION check_insert_cars(cars_row "cars")
RETURNS BOOLEAN
SET search_path = public
SECURITY DEFINER AS $$
BEGIN
    RETURN cars_row.created_by = (SELECT auth.uid());
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION check_delete_cars(cars_row "cars")
RETURNS BOOLEAN
SET search_path = public
SECURITY DEFINER AS $$
BEGIN
    RETURN cars_row.created_by = (SELECT auth.uid());
END;
$$ LANGUAGE plpgsql;

ALTER TABLE "cars" ENABLE ROW LEVEL SECURITY;

CREATE POLICY cars_select_policy ON "cars"
   FOR SELECT
   TO authenticated
   USING (check_select_cars(cars.*));

CREATE POLICY cars_insert_policy ON "cars"
    FOR INSERT
   TO authenticated
    WITH CHECK (check_insert_cars(cars.*));

CREATE POLICY cars_update_policy ON "cars"
  FOR UPDATE
   TO authenticated
    WITH CHECK (check_update_cars(cars.*));

CREATE POLICY cars_delete_policy ON "cars"
   FOR DELETE
   TO authenticated
    USING (check_delete_cars(cars.*));

GRANT SELECT,
  INSERT (id, make, model, year, vin, lpn, nickname, annual_mileage),
    UPDATE (make, model, year, vin, lpn, nickname, annual_mileage),
    DELETE ON "cars" TO authenticated;

CREATE TRIGGER update_cars_updated_at
    BEFORE UPDATE ON "cars"
   FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

CREATE TRIGGER delete_cars_record
   BEFORE DELETE ON "cars"
    FOR EACH ROW EXECUTE PROCEDURE delete_record();;

-- Table: deleted
CREATE TABLE "deleted" (
    "id" uuid  NOT NULL,
    "source_table" text  NOT NULL,
    "source_id" uuid  NOT NULL,
    "deleted_at" timestamptz  NOT NULL,
    CONSTRAINT "deleted_pk" PRIMARY KEY ("id")
);

CREATE INDEX "deleted_idx_1" on "deleted" ("source_table" ASC,"source_id" ASC);

ALTER TABLE deleted ENABLE ROW LEVEL SECURITY;

CREATE POLICY select_only_authenticated ON "deleted"
 FOR SELECT
 TO authenticated
 USING (true);

GRANT SELECT ON deleted TO authenticated;;

-- Table: maintenance_records
CREATE TABLE "maintenance_records" (
    "id" uuid  NOT NULL,
    "odometer" integer  NULL,
    "timestamp" timestamp  NULL,
    "notes" text  NULL,
    "car_id" uuid  NOT NULL,
    "maintenance_type_id" uuid  NOT NULL,
    "created_by" uuid  NOT NULL DEFAULT auth.uid(),
    "created_at" timestamptz  NOT NULL DEFAULT now(),
    "updated_at" timestamptz  NOT NULL DEFAULT now(),
    CONSTRAINT "maintenance_records_pk" PRIMARY KEY ("id")
);

CREATE INDEX "maintainance_records_idx_1" on "maintenance_records" ("car_id" ASC);

CREATE INDEX "maintainance_records_idx_2" on "maintenance_records" ("maintenance_type_id" ASC);

CREATE INDEX "maintenance_records_idx_3" on "maintenance_records" ("created_by" ASC);

CREATE OR REPLACE FUNCTION check_select_maintenance_records(maintenance_records_row "maintenance_records")
RETURNS BOOLEAN
SET search_path = public
SECURITY DEFINER AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM all_permissions
        WHERE user_id = (SELECT auth.uid())
          AND car_id = maintenance_records_row.car_id
    );
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION check_insert_maintenance_records(maintenance_records_row "maintenance_records")
RETURNS BOOLEAN
SET search_path = public
SECURITY DEFINER AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM all_permissions
        WHERE user_id = (SELECT auth.uid())
          AND car_id = maintenance_records_row.car_id
          AND write = TRUE
    );
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION check_update_maintenance_records(maintenance_records_row "maintenance_records")
RETURNS BOOLEAN
SET search_path = public
SECURITY DEFINER AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM all_permissions
        WHERE user_id = (SELECT auth.uid())
          AND car_id = maintenance_records_row.car_id
          AND write = TRUE
    );
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION check_delete_maintenance_records(maintenance_records_row "maintenance_records")
RETURNS BOOLEAN
SET search_path = public
SECURITY DEFINER AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM all_permissions
        WHERE user_id = (SELECT auth.uid())
          AND car_id = maintenance_records_row.car_id
          AND write = TRUE
    );
END;
$$ LANGUAGE plpgsql;

ALTER TABLE "maintenance_records" ENABLE ROW LEVEL SECURITY;

CREATE POLICY maintenance_records_select_policy ON "maintenance_records"
    FOR SELECT
   TO authenticated
    USING (check_select_maintenance_records(maintenance_records.*));

CREATE POLICY maintenance_records_insert_policy ON "maintenance_records"
    FOR INSERT
   TO authenticated
    WITH CHECK (check_insert_maintenance_records(maintenance_records.*));

CREATE POLICY maintenance_records_update_policy ON "maintenance_records"
    FOR UPDATE
   TO authenticated
    WITH CHECK (check_update_maintenance_records(maintenance_records.*));

CREATE POLICY maintenance_records_delete_policy ON "maintenance_records"
    FOR DELETE
   TO authenticated
    USING (check_delete_maintenance_records(maintenance_records.*));

GRANT SELECT,
  INSERT (id, odometer, timestamp, notes, car_id, maintenance_type_id),
    UPDATE (odometer, timestamp, notes),
    DELETE ON "maintenance_records" TO authenticated;

CREATE TRIGGER update_maintenance_records_updated_at
   BEFORE UPDATE ON "maintenance_records"
   FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

CREATE TRIGGER delete_maintenance_records_record
    BEFORE DELETE ON "maintenance_records"
    FOR EACH ROW EXECUTE PROCEDURE delete_record();;

-- Table: maintenance_types
CREATE TABLE "maintenance_types" (
    "id" uuid  NOT NULL,
    "name" text  NOT NULL,
    "created_by" uuid  NOT NULL DEFAULT auth.uid(),
    "created_at" timestamptz  NOT NULL DEFAULT now(),
    "updated_at" timestamptz  NOT NULL DEFAULT now(),
    CONSTRAINT "maintenance_types_pk" PRIMARY KEY ("id")
);

CREATE INDEX "maintenance_types_idx_1" on "maintenance_types" ("created_by" ASC);

CREATE OR REPLACE FUNCTION check_select_maintenance_types(maintenance_types_row "maintenance_types")
RETURNS BOOLEAN
SET search_path = public
SECURITY DEFINER AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM car_maintenance_intervals
        JOIN all_permissions ON car_maintenance_intervals.car_id = all_permissions.car_id
        WHERE all_permissions.user_id = (SELECT auth.uid())
          AND car_maintenance_intervals.maintenance_type_id = maintenance_types_row.id
    ) OR EXISTS (
        SELECT 1
        FROM maintenance_records
        JOIN all_permissions ON maintenance_records.car_id = all_permissions.car_id
        WHERE all_permissions.user_id = (SELECT auth.uid())
          AND maintenance_records.maintenance_type_id = maintenance_types_row.id
    ) OR maintenance_types_row.created_by = (SELECT auth.uid());
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION check_insert_maintenance_types(maintenance_types_row "maintenance_types")
RETURNS BOOLEAN
SET search_path = public
SECURITY DEFINER AS $$
BEGIN
    RETURN maintenance_types_row.created_by = (SELECT auth.uid());
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION check_update_maintenance_types(maintenance_types_row "maintenance_types")
RETURNS BOOLEAN
SET search_path = public
SECURITY DEFINER AS $$
BEGIN
    RETURN maintenance_types_row.created_by = (SELECT auth.uid());
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION check_delete_maintenance_types(maintenance_types_row "maintenance_types")
RETURNS BOOLEAN
SET search_path = public
SECURITY DEFINER AS $$
BEGIN
    RETURN maintenance_types_row.created_by = (SELECT auth.uid());
END;
$$ LANGUAGE plpgsql;

ALTER TABLE "maintenance_types" ENABLE ROW LEVEL SECURITY;

CREATE POLICY maintenance_types_select_policy ON "maintenance_types"
    FOR SELECT
   TO authenticated
    USING (check_select_maintenance_types(maintenance_types.*));

CREATE POLICY maintenance_types_insert_policy ON "maintenance_types"
    FOR INSERT
   TO authenticated
    WITH CHECK (check_insert_maintenance_types(maintenance_types.*));

CREATE POLICY maintenance_types_update_policy ON "maintenance_types"
    FOR UPDATE
   TO authenticated
    WITH CHECK (check_update_maintenance_types(maintenance_types.*));

CREATE POLICY maintenance_types_delete_policy ON "maintenance_types"
    FOR DELETE
   TO authenticated
    USING (check_delete_maintenance_types(maintenance_types.*));

GRANT SELECT,
  INSERT (id, name),
    UPDATE (name),
    DELETE ON "maintenance_types" TO authenticated;

CREATE TRIGGER update_maintenance_types_updated_at
  BEFORE UPDATE ON "maintenance_types"
   FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

CREATE TRIGGER delete_maintenance_types_record
    BEFORE DELETE ON "maintenance_types"
    FOR EACH ROW EXECUTE PROCEDURE delete_record();;

-- Table: permissions
CREATE TABLE "permissions" (
    "id" uuid  NOT NULL,
    "user_id" uuid  NOT NULL,
    "car_id" uuid  NOT NULL,
    "write" boolean  NOT NULL,
    "share" boolean  NOT NULL,
    "created_by" uuid  NOT NULL DEFAULT auth.uid(),
    "created_at" timestamptz  NOT NULL DEFAULT now(),
    "updated_at" timestamptz  NOT NULL DEFAULT now(),
    CONSTRAINT "permissions_pk" PRIMARY KEY ("id")
);

CREATE INDEX "permissions_idx_1" on "permissions" ("car_id" ASC);

CREATE INDEX "permissions_idx_2" on "permissions" ("user_id" ASC);

CREATE INDEX "permissions_idx_3" on "permissions" ("created_by" ASC);

CREATE OR REPLACE FUNCTION check_select_permissions(permissions_row "permissions")
RETURNS BOOLEAN
SET search_path = public
SECURITY DEFINER AS $$
BEGIN
    RETURN
        permissions_row.user_id = (SELECT auth.uid())
        OR permissions_row.car_id IN (
            SELECT car_id
            FROM all_permissions
            WHERE user_id = (SELECT auth.uid())
              AND share = TRUE
        );
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION check_insert_permissions(permissions_row "permissions")
RETURNS BOOLEAN
SET search_path = public
SECURITY DEFINER AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM all_permissions
        WHERE user_id = (SELECT auth.uid())
          AND car_id = permissions_row.car_id
          AND share = TRUE
    );
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION check_update_permissions(permissions_row "permissions")
RETURNS BOOLEAN
SET search_path = public
SECURITY DEFINER AS $$
BEGIN
    RETURN
        (permissions_row.user_id = (SELECT auth.uid())
          AND permissions_row.share = TRUE)
        OR permissions_row.car_id IN (
            SELECT car_id
            FROM all_permissions
            WHERE user_id = (SELECT auth.uid())
              AND share = TRUE
        );
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION check_delete_permissions(permissions_row "permissions")
RETURNS BOOLEAN
SET search_path = public
SECURITY DEFINER AS $$
BEGIN
    RETURN
        permissions_row.user_id = (SELECT auth.uid())
        OR EXISTS (
            SELECT 1
            FROM all_permissions
            WHERE user_id = (SELECT auth.uid())
              AND car_id = row.car_id
              AND share = TRUE
        );
END;
$$ LANGUAGE plpgsql;

ALTER TABLE "permissions" ENABLE ROW LEVEL SECURITY;

CREATE POLICY permissions_select_policy ON "permissions"
   FOR SELECT
   TO authenticated
    USING (check_select_permissions(permissions.*));

CREATE POLICY permissions_insert_policy ON "permissions"
    FOR INSERT
   TO authenticated
    WITH CHECK (check_insert_permissions(permissions.*));

CREATE POLICY permissions_update_policy ON "permissions"
   FOR UPDATE
   TO authenticated
   WITH CHECK (check_update_permissions(permissions.*));

CREATE POLICY permissions_delete_policy ON "permissions"
    FOR DELETE
   TO authenticated
   USING (check_delete_permissions(permissions.*));

GRANT SELECT,
  INSERT (user_id, car_id, write, "share"),
    UPDATE (write, "share"),
    DELETE ON "permissions" TO authenticated;

CREATE TRIGGER update_permissions_updated_at
   BEFORE UPDATE ON "permissions"
   FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

CREATE TRIGGER delete_permissions_record
    BEFORE DELETE ON "permissions"
   FOR EACH ROW EXECUTE PROCEDURE delete_record();;

-- Table: users
CREATE TABLE "users" (
    "id" uuid  NOT NULL DEFAULT auth.uid(),
    "name" text  NULL,
    "created_at" timestamptz  NOT NULL DEFAULT now(),
    "updated_at" timestamptz  NOT NULL DEFAULT now(),
    CONSTRAINT "users_pk" PRIMARY KEY ("id")
);

CREATE OR REPLACE FUNCTION check_select_users(users_row "users")
RETURNS BOOLEAN
SET search_path = public
SECURITY DEFINER AS $$
BEGIN
    RETURN
        users_row.id = (SELECT auth.uid())
        OR EXISTS (
            SELECT 1
            FROM permissions
            WHERE car_id IN (
                SELECT car_id
                FROM all_permissions
                WHERE user_id = (SELECT auth.uid())
            )
            AND user_id = users_row.id
            AND write = TRUE
        );
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION check_insert_users(users_row "users")
RETURNS BOOLEAN
SET search_path = public
SECURITY DEFINER AS $$
BEGIN
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION check_update_users(users_row "users")
RETURNS BOOLEAN
SET search_path = public
SECURITY DEFINER AS $$
BEGIN
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION check_delete_users(users_row "users")
RETURNS BOOLEAN
SET search_path = public
SECURITY DEFINER AS $$
BEGIN
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;

CREATE POLICY users_select_policy ON "users"
   FOR SELECT
   TO authenticated
  USING (check_select_users(users.*));

CREATE POLICY users_insert_policy ON "users"
   FOR INSERT
   TO authenticated
    WITH CHECK (check_insert_users(users.*));

CREATE POLICY users_update_policy ON "users"
   FOR UPDATE
   TO authenticated
    WITH CHECK (check_update_users(users.*));

CREATE POLICY users_delete_policy ON "users"
   FOR DELETE
   TO authenticated
    USING (check_delete_users(users.*));

GRANT SELECT,
  INSERT (first_name, last_name),
    UPDATE (first_name, last_name),
    DELETE ON "users" TO authenticated;

CREATE TRIGGER update_users_updated_at
   BEFORE UPDATE ON "users"
   FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

CREATE TRIGGER delete_users_record
   BEFORE DELETE ON "users"
   FOR EACH ROW EXECUTE PROCEDURE delete_record();;

-- views
-- View: all_permissions
CREATE VIEW "all_permissions" AS
SELECT user_id, car_id, write, share
FROM permissions
UNION ALL
SELECT created_by, id, true, true
FROM cars;

-- foreign keys
-- Reference: car_maintenance_intervals_users (table: car_maintenance_intervals)
ALTER TABLE "car_maintenance_intervals" ADD CONSTRAINT "car_maintenance_intervals_users"
    FOREIGN KEY ("created_by")
    REFERENCES "users" ("id")
    NOT DEFERRABLE
    INITIALLY IMMEDIATE
;

-- Reference: cars_maintainance_types_cars (table: car_maintenance_intervals)
ALTER TABLE "car_maintenance_intervals" ADD CONSTRAINT "cars_maintainance_types_cars"
    FOREIGN KEY ("car_id")
    REFERENCES "cars" ("id")
    ON DELETE  CASCADE
    NOT DEFERRABLE
    INITIALLY IMMEDIATE
;

-- Reference: cars_maintainance_types_maintainance_types (table: car_maintenance_intervals)
ALTER TABLE "car_maintenance_intervals" ADD CONSTRAINT "cars_maintainance_types_maintainance_types"
    FOREIGN KEY ("maintenance_type_id")
    REFERENCES "maintenance_types" ("id")
    ON DELETE  CASCADE
    NOT DEFERRABLE
    INITIALLY IMMEDIATE
;

-- Reference: cars_permissions (table: permissions)
ALTER TABLE "permissions" ADD CONSTRAINT "cars_permissions"
    FOREIGN KEY ("car_id")
    REFERENCES "cars" ("id")
    ON DELETE  CASCADE
    NOT DEFERRABLE
    INITIALLY IMMEDIATE
;

-- Reference: cars_users (table: cars)
ALTER TABLE "cars" ADD CONSTRAINT "cars_users"
    FOREIGN KEY ("created_by")
    REFERENCES "users" ("id")
    ON DELETE  CASCADE
    NOT DEFERRABLE
    INITIALLY IMMEDIATE
;

-- Reference: maintainance_records_cars (table: maintenance_records)
ALTER TABLE "maintenance_records" ADD CONSTRAINT "maintainance_records_cars"
    FOREIGN KEY ("car_id")
    REFERENCES "cars" ("id")
    ON DELETE  CASCADE
    NOT DEFERRABLE
    INITIALLY IMMEDIATE
;

-- Reference: maintainance_records_maintainance_types (table: maintenance_records)
ALTER TABLE "maintenance_records" ADD CONSTRAINT "maintainance_records_maintainance_types"
    FOREIGN KEY ("maintenance_type_id")
    REFERENCES "maintenance_types" ("id")
    NOT DEFERRABLE
    INITIALLY IMMEDIATE
;

-- Reference: maintenance_records_users (table: maintenance_records)
ALTER TABLE "maintenance_records" ADD CONSTRAINT "maintenance_records_users"
    FOREIGN KEY ("created_by")
    REFERENCES "users" ("id")
    NOT DEFERRABLE
    INITIALLY IMMEDIATE
;

-- Reference: maintenance_types_users (table: maintenance_types)
ALTER TABLE "maintenance_types" ADD CONSTRAINT "maintenance_types_users"
    FOREIGN KEY ("created_by")
    REFERENCES "users" ("id")
    NOT DEFERRABLE
    INITIALLY IMMEDIATE
;

-- Reference: permissions_users (table: permissions)
ALTER TABLE "permissions" ADD CONSTRAINT "permissions_users"
    FOREIGN KEY ("user_id")
    REFERENCES "users" ("id")
    ON DELETE  CASCADE
    NOT DEFERRABLE
    INITIALLY IMMEDIATE
;

-- Reference: permissions_users_created (table: permissions)
ALTER TABLE "permissions" ADD CONSTRAINT "permissions_users_created"
    FOREIGN KEY ("created_by")
    REFERENCES "users" ("id")
    ON DELETE  CASCADE
    NOT DEFERRABLE
    INITIALLY IMMEDIATE
;

create function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = "public"
as $$
begin
  insert into users (id, name)
  values (new.id, substring(new.email from 1 for position('@' in new.email) - 1));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();;

-- End of file.

