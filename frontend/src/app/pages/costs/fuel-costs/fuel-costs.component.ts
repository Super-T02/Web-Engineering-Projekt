import { Component, OnInit } from '@angular/core';
import {FuelCostItem} from '../../../models/cost.model';
import {CostService} from '../../../core/services/cost.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NzTableFilterFn, NzTableFilterList, NzTableSortFn, NzTableSortOrder} from 'ng-zorro-antd/table';

interface ColumnItem {
  name: string;
  sortOrder: NzTableSortOrder | null;
  sortFn: NzTableSortFn<FuelCostItem> | null;
  listOfFilter: NzTableFilterList;
  filterFn: NzTableFilterFn<FuelCostItem> | null;
  filterMultiple: boolean;
  sortDirections: NzTableSortOrder[];
}

@Component({
  selector: 'app-fuel-costs',
  templateUrl: './fuel-costs.component.html',
  styleUrls: ['./fuel-costs.component.less']
})
export class FuelCostsComponent implements OnInit {
  listOfColumns: ColumnItem[] = [
    {
      name: 'Price',
      sortOrder: null,
      sortFn: (a: FuelCostItem, b: FuelCostItem) => a.price - b.price,
      sortDirections: ['ascend', 'descend', null],
      listOfFilter: [],
      filterFn: null,
      filterMultiple: null
    },
    {
      name: 'Mileage',
      sortOrder: null,
      sortDirections: ['ascend', 'descend', null],
      sortFn: (a: FuelCostItem, b: FuelCostItem) => a.km - b.km,
      filterMultiple: null,
      listOfFilter: [],
      filterFn: null
    },
    {
      name: 'Volume',
      sortOrder: null,
      sortDirections: ['ascend', 'descend', null],
      sortFn: (a: FuelCostItem, b: FuelCostItem) => a.volume - b.volume,
      filterMultiple: null,
      listOfFilter: [],
      filterFn: null
    },
    {
      name: 'Consumption',
      sortOrder: null,
      sortDirections: ['ascend', 'descend', null],
      sortFn: (a: FuelCostItem, b: FuelCostItem) => a.consumption - b.consumption,
      filterMultiple: null,
      listOfFilter: [],
      filterFn: null
    },
    {
      name: 'Date',
      sortOrder: 'descend',
      sortDirections: ['ascend', 'descend', null],
      sortFn: (a: FuelCostItem, b: FuelCostItem) => a.date.getTime() - b.date.getTime(),
      filterMultiple: null,
      listOfFilter: [],
      filterFn: null
    },
    {
      name: 'Type',
      sortOrder: null,
      sortFn: (a: FuelCostItem, b: FuelCostItem) => a.type.localeCompare(b.type),
      sortDirections: ['ascend', 'descend', null],
      filterMultiple: true,
      listOfFilter: [],
      filterFn: null
    }
  ];
  expandSet = new Set<string>();
  vin: string;

  constructor(
    public costService: CostService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      params => this.vin = params.vin.toUpperCase()
    );
  }

  /**
   * Redirect to addFuelCost
   */
  addFuelCost() {
    this.costService.updateType = 'fuel';
    this.router.navigate(['overview/'+ this.vin +'/addCostItem']).then();
  }

  /**
   * Redirect to updateSingleCost
   */
  updateCost(id: string) {
    this.costService.updateType = 'fuel';
    this.router.navigate(['overview/'+ this.vin +'/updateCostItem/' + id]).then();
  }
}
