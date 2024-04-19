import { Routes } from '@angular/router';
import {LoginComponent} from "./pages/login/login.component";
import {FileListComponent} from "./pages/file-list/file-list.component";

export const routes: Routes = [
    { path:"login", component:LoginComponent},
    { path:"filelist", component:FileListComponent},

    { path:"**", redirectTo:"login"},
];
