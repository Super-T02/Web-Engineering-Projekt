import {Component, Input} from '@angular/core';
import {Observable} from 'rxjs';
import {MEDIA_BREAKPOINTS} from '../../../../environments/constants';
import {FuelCostItem, RepeatingCostItem, SingleCostItem} from '../../../models/cost.model';
import {Router} from '@angular/router';
import {CostService} from '../../../core/services/cost.service';
import {LastRouteService} from '../../../core/services/last-route.service';
import {NzMessageService} from 'ng-zorro-antd/message';
import {UtilService} from '../../../core/services/util.service';
import {ResizeService} from '../../../core/services/resize.service';

@Component({
  selector: 'app-cost-steps',
  templateUrl: './cost-steps.component.html',
  styleUrls: ['./cost-steps.component.less']
})
export class CostStepsComponent {

  @Input() item: Observable<SingleCostItem | FuelCostItem | RepeatingCostItem>;
  @Input() deliverData: boolean = false;
  @Input() vin: string;

  breakPoints = MEDIA_BREAKPOINTS;
  currentStep = 0;
  countdown = 0;
  retries = 0;

  constructor(
    private router: Router,
    public costService: CostService,
    private lastUrl: LastRouteService,
    private message: NzMessageService,
    private util: UtilService,
    public resize: ResizeService
  ) {

  }

  dataSent(value: boolean) {
    if (value) {
      this.currentStep = 1;
      this.countdown = 3;
      let successMessage: string;

      this.deliverData? successMessage='Cost item successfully updated!'
        : successMessage='Cost item successfully created!';
      this.message.success(successMessage, {nzDuration: 3000});

      // Interval for the timer
      setInterval(() => {
        this.countdown > 0 ? this.countdown -- : undefined;
      },1000);

      // Auto redirect
      setTimeout(() => {
        this.router.navigate(['overview/' + this.vin], {queryParams: {selected: this.util.lastCostSelected}}).then();
      },this.countdown * 1000);
    }
  }

}
