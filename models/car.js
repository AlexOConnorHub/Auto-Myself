import { Model, Q } from '@nozbe/watermelondb';
import { date, text, children, writer } from '@nozbe/watermelondb/decorators';
import { tables } from '../database/tables';

export default class Car extends Model {
  static table = tables.cars;
  static associations = {
    carMaintainanceIntervals: { type: 'has_many', foreignKey: 'car_id' },
    maintainanceRecords: { type: 'has_many', foreignKey: 'car_id' },
    owners: { type: 'has_many', foreignKey: 'car_id' },
  };
  @text('make') make;
  @text('model') model;
  @text('year') year;
  @text('vin') vin;
  @text('lpn') lpn;
  @text('nickname') nickname;
  @text('annual_mileage') annualMileage;
  @date('created_at') createdAt;
  @date('updated_at') updatedAt;
  @children(tables.car_maintainance_intervals) carMaintainanceIntervals;
  @children(tables.maintainance_records) maintainanceRecords;
  @children(tables.owners) owners;

  @writer async addCar() {
    return await this.collections.get(this.table).create((car) => {
      car.make = this.make;
      car.model = this.model;
      car.year = this.year;
      car.vin = this.vin;
      car.lpn = this.lpn;
      car.nickname = this.nickname;
      car.annualMileage = this.annualMileage;
    });
  }

  @writer async updateCar(newCar) {
    return await this.update((car) => {
      car.make = newCar.make;
      car.model = newCar.model;
      car.year = newCar.year;
      car.vin = newCar.vin;
      car.lpn = newCar.lpn;
      car.nickname = newCar.nickname;
      car.annualMileage = newCar.annualMileage;
    });
  }

  @writer async deleteCar() {
    return await this.destroyPermanently(); // TODO: Make sure to not actually delete if synced
  }
}
