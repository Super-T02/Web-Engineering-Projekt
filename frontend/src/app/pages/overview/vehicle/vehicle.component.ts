import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Vehicle} from '../../../models/vehicle.model';
import {NzModalService} from 'ng-zorro-antd/modal';
import {ApiService} from '../../../core/services/api.service';
import {AuthService} from '../../../core/services/auth.service';
import {NzMessageService} from 'ng-zorro-antd/message';
import {UtilService} from '../../../core/services/util.service';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.less']
})
export class VehicleComponent implements OnInit {

  @Input() vehicle: Vehicle;
  @Output() deleted = new EventEmitter<boolean>()

  year: number;
  url: string;
  query: { selected: number};

  constructor(
    private modal: NzModalService,
    private api: ApiService,
    private auth: AuthService,
    private message: NzMessageService,
    public util: UtilService
              ) { }

  ngOnInit(): void {
    this.url = '/overview/' + this.vehicle.vin;
    this.query = {selected: this.util.lastCostSelected};
    this.vehicle.year? this.year = new Date(this.vehicle.year).getFullYear(): this.year = 0;
  }

  /**
   * Delete a vehicle
   */
  delete(): void {
    this.modal.confirm({
      nzTitle: 'Delete Vehicle?',
      nzContent: `Are you sure to delete the vehicle? <br> Name: ${this.vehicle.name} <br> vin: ${this.vehicle.vin}`,
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzCancelText: 'No',
      nzWidth: 550,
      nzStyle: {top: '25%'},
      nzOnOk: () => {
        this.api.deleteVehicle(this.vehicle.vin, this.auth.username).subscribe( () => {
          this.message.success('Vehicle successfully deleted!', {nzDuration: 3000});
          this.deleted.emit(true);
        });
      }
    });
  }
}
