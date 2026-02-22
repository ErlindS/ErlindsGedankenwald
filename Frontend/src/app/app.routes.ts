import { Routes } from '@angular/router';
import { Essensplan } from './kochen/essensplan/essensplan';
import { Home } from './home/home';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'kochen/essensplan', component: Essensplan },
];
