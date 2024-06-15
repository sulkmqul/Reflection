import { Routes } from '@angular/router';
import {LoginComponent} from "./pages/login/login.component";
import {PortalComponent} from "./pages/portal/portal.component";
import {ManagementComponent} from "./pages/management/management.component";
import {FileListComponent} from "./pages/file-list/file-list.component";

export const routes: Routes = [
    { path:"login", component:LoginComponent},
    //{ path:"portal", component:PortalComponent},
    { path:"flist", component:FileListComponent},
    { path:"manage", component:ManagementComponent},

    { path:"**", redirectTo:"login"},
];
