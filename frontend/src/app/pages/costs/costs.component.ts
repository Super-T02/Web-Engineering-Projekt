import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CostService} from '../../core/services/cost.service';
import {LastRouteService} from '../../core/services/last-route.service';
import {UtilService} from '../../core/services/util.service';

@Component({
  selector: 'app-costs',
  templateUrl: './costs.component.html',
  styleUrls: ['./costs.component.less']
})
export class CostsComponent implements OnInit {

  vin: string;

  constructor(
    private costs: CostService,
    private route: ActivatedRoute,
    private lastUrl: LastRouteService,
    private router: Router,
    public util: UtilService,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.vin = params.vin.toUpperCase();
      this.costs.loadCosts(this.vin);
    });

    this.route.queryParams.subscribe(query => {
      if (query.selected) {
        this.util.lastCostSelected = query.selected;
      }
      this.lastUrl.newUrlString(`/overview/${this.vin}`);
    });
  }

  /**
   * Changes the selected Input and change last URL
   * @param $event
   */
  changedInput($event: number) {
    this.util.lastCostSelected = $event;
    this.lastUrl.query = {selected: this.util.lastCostSelected};
    this.lastUrl.newUrlString(`/overview/${this.vin}`);
  }

  /**
   * Handles the resize
   */
  onResize(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate(['/overview/' + this.vin], {queryParams: {selected: this.util.lastCostSelected}}).then();
  }

}
