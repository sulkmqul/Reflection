import { Component } from '@angular/core';
import {PortalHeaderComponent} from '../../parts/portal-header/portal-header.component';
import {MatTabsModule} from "@angular/material/tabs";
import {UserManagementComponent} from "./user-management/user-management.component";
import {InfoEditComponent} from "./info-edit/info-edit.component";
@Component({
  selector: 'app-management',
  standalone: true,
  imports: [PortalHeaderComponent, UserManagementComponent, InfoEditComponent, MatTabsModule],
  templateUrl: './management.component.html',
  styleUrl: './management.component.css'
})
export class ManagementComponent {

}
