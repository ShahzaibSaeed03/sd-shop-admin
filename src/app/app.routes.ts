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

export const routes: Routes = [
    
  { path: '', component: Login },
  { path: 'dashboard', component: Dashboard },
  { path: 'content-management', component: ContentManagement },
  { path: 'img-management', component: ImgManagement },
  { path: 'game-management/:id', component: GameManagement },
  { path: 'pricing', component: Pricing },
  { path: 'order', component: Order },
  { path: 'orders/:id', component: OrderDetails },
  { path: 'coupons', component: Coupons },
  { path: 'payment-stability', component: PaymentStability },
  { path: 'payment-dashboard', component: StabilityDashboard },
  { path: 'user-management', component: UserManagement },
  { path: '**', redirectTo: '' }
  
];
