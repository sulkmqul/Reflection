import { Routes } from '@angular/router';
import {LoginComponent} from "./pages/login/login.component";
import {PortalComponent} from "./pages/portal/portal.component";

export const routes: Routes = [
    { path:"login", component:LoginComponent},
    { path:"portal", component:PortalComponent},

    { path:"**", redirectTo:"portal"},
];
