import { Model, Q } from '@nozbe/watermelondb';
import { field, text, children } from '@nozbe/watermelondb/decorators';

class Car extends Model {
  static table = 'cars';

  static associations = {
    carMaintainanceIntervals: { type: 'has_many', foreignKey: 'car_id' },
    maintainanceRecords: { type: 'has_many', foreignKey: 'car_id' },
    owners: { type: 'has_many', foreignKey: 'car_id' },
  };

  @field('name') name;
  @field('make') make;
  @field('model') model;
  @field('year') year;
  @field('vin') vin;
  @field('license_plate') license_plate;
  @field('annual_mileage') annual_mileage;
  @field('nickname') nickname;
  @field('created_at') created_at;
  @field('updated_at') updated_at;

  @children('car_maintainance_intervals') carMaintainanceIntervals;
  @children('maintainance_records') maintainanceRecords;
  @children('family_members') familyMembers;

  static findByVin(vin) {
    return this.query(Q.where('vin', vin)).fetch();
  }

  static findByLicensePlate(license_plate) {
    return this.query(Q.where('license_plate', license_plate)).fetch();
  }
}

export { Car };
