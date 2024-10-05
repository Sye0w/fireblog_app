import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FireblogPageComponent } from "../../components/fireblog-page/fireblog-page.component";
import { ProfileAvatarComponent } from "../../components/profile-avatar/profile-avatar.component";

@Component({
  selector: 'app-fireblog',
  standalone: true,
  imports: [RouterModule, FireblogPageComponent, ProfileAvatarComponent],
  templateUrl: './fireblog.component.html',
  styleUrl: './fireblog.component.scss'
})

export class FireblogComponent {

}
