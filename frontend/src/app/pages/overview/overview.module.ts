import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverviewRoutingModule } from './overview-routing.module';
import { OverviewComponent } from './overview.component';
import {NzBreadCrumbModule} from 'ng-zorro-antd/breadcrumb';
import { VehicleComponent } from './vehicle/vehicle.component';
import {NzCardModule} from 'ng-zorro-antd/card';
import {NzStatisticModule} from 'ng-zorro-antd/statistic';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzToolTipModule} from 'ng-zorro-antd/tooltip';
import {NzEmptyModule} from 'ng-zorro-antd/empty';
import {NzDividerModule} from 'ng-zorro-antd/divider';
import {NzSpinModule} from 'ng-zorro-antd/spin';


@NgModule({
  declarations: [
    OverviewComponent,
    VehicleComponent
  ],
    imports: [
        CommonModule,
        OverviewRoutingModule,
        NzBreadCrumbModule,
        NzCardModule,
        NzStatisticModule,
        NzIconModule,
        NzButtonModule,
        NzToolTipModule,
        NzEmptyModule,
        NzDividerModule,
        NzSpinModule
    ]
})
export class OverviewModule { }
