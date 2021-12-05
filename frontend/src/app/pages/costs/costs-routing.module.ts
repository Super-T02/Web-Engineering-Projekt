import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CostsComponent } from './costs.component';

const routes: Routes = [
  {
    path: '',
    component: CostsComponent
  },
  {
    path: 'addCostItem',
    loadChildren: () => import('../add-cost-item/add-cost-item.module').then(m => m.AddCostItemModule)
  },
  {
    path: 'updateCostItem/:id',
    loadChildren: () => import('../update-cost-item/update-cost-item.module').then(m => m.UpdateCostItemModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CostsRoutingModule { }