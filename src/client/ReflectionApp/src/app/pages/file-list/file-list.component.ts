import { Component } from '@angular/core';
import {PortalHeaderComponent} from '../../parts/portal-header/portal-header.component';

@Component({
  selector: 'app-file-list',
  standalone: true,
  imports: [PortalHeaderComponent],
  templateUrl: './file-list.component.html',
  styleUrl: './file-list.component.css'
})
export class FileListComponent {

}
