import { Routes } from '@angular/router';
import { Woche1 } from './kochen/woche1/woche1';
import { Home } from './home/home';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'kochen/woche1', component: Woche1 },
];
