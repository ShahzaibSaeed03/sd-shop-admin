import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Dashboard } from './components/dashboard/dashboard';
import { ContentManagement } from './components/content-management/content-management';
import { ImgManagement } from './components/img-management/img-management';
import { GameManagement } from './components/game-management/game-management';
import { Pricing } from './components/pricing/pricing';
import { Coupons } from './components/coupons/coupons';
import { PaymentStability } from './components/payment-stability/payment-stability';
import { StabilityDashboard } from './components/stability-dashboard/stability-dashboard';
import { Order } from './components/order/order';
import { OrderDetails } from './components/order-details/order-details';
import { UserManagement } from './components/user-management/user-management';
import { GameContent } from './components/game-content/game-content';
import { SupplierSync } from './components/supplier-sync/supplier-sync';
import { BundleManagment } from './components/bundle-managment/bundle-managment';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  { path: '', component: Login },

  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard],
  },

  {
    path: 'content-management',
    component: ContentManagement,
    canActivate: [authGuard],
  },

  {
    path: 'img-management',
    component: ImgManagement,
    canActivate: [authGuard],
  },

  {
    path: 'game-management/:id',
    component: GameManagement,
    canActivate: [authGuard],
  },

  {
    path: 'pricing',
    component: Pricing,
    canActivate: [authGuard],
  },

  {
    path: 'order',
    component: Order,
    canActivate: [authGuard],
  },

  {
    path: 'orders/:id',
    component: OrderDetails,
    canActivate: [authGuard],
  },

  {
    path: 'coupons',
    component: Coupons,
    canActivate: [authGuard],
  },

  {
    path: 'payment-stability',
    component: PaymentStability,
    canActivate: [authGuard],
  },

  {
    path: 'payment-dashboard',
    component: StabilityDashboard,
    canActivate: [authGuard],
  },

  {
    path: 'user-management',
    component: UserManagement,
    canActivate: [authGuard],
  },

  {
    path: 'game-content',
    component: GameContent,
    canActivate: [authGuard],
  },

  {
    path: 'supplier-sync',
    component: SupplierSync,
    canActivate: [authGuard],
  },

  {
    path: 'bundle-management',
    component: BundleManagment,
    canActivate: [authGuard],
  },

  { path: '**', redirectTo: '' },
];
