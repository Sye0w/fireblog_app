import { Routes } from '@angular/router';
import { AuthComponent } from './views/auth/auth/auth.component';
import { LoginComponent } from './views/auth/login/login.component';

export const routes: Routes = [
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },

  {
    path: 'auth',
    component: AuthComponent,
    children: [
      { path: 'login', component: LoginComponent},
      {
        path: 'register',
        loadComponent: () => import('./views/auth/register/register.component')
        .then(mod => mod.RegisterComponent)
      }
    ],
  },

  {
    path: 'fireblog',
    loadComponent:() => import('../app/views/fireblog/fireblog.component')
    .then( mod => mod.FireblogComponent),
    children: [
      {
        path: 'profile',
        loadComponent: () => import('./views/auth/user-profile/user-profile.component')
        .then(mod => mod.UserProfileComponent)
      },
      {
        path:'posts',
        loadComponent: () => import('../app/views/fireblog-page/fireblog-page.component')
        .then(mod => mod.FireblogPageComponent)
      },
      {
        path:'blog-detail',
        loadComponent: () => import('../app/views/fireblog-detail/fireblog-detail.component')
        .then(mod => mod.FireblogDetailComponent)
      }
    ]
  }
];
