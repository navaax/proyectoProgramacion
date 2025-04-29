import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  {
    path: 'files',
    loadComponent: () => import('./components/file/file-explorer/file-explorer.component')
      .then(m => m.FileExplorerComponent),
    canActivate: [authGuard]
  },
  {
    path: 'files/:id',
    loadComponent: () => import('./components/file/file-detail/file-detail.component')
      .then(m => m.FileDetailComponent),
    canActivate: [authGuard]
  },
  {
    path: 'files/upload',
    loadComponent: () => import('./components/file/file-upload/file-upload.component')
      .then(m => m.FileUploadComponent),
    canActivate: [authGuard]
  },
  {
    path: 'folders/:id',
    loadComponent: () => import('./components/folder/folder-detail/folder-detail.component')
      .then(m => m.FolderDetailComponent),
    canActivate: [authGuard]
  },
  {
    path: 'folders/new',
    loadComponent: () => import('./components/folder/folder-create/folder-create.component')
      .then(m => m.FolderCreateComponent),
    canActivate: [authGuard]
  },
  {
    path: 'shared',
    loadComponent: () => import('./components/shared/shared-files/shared-files.component')
      .then(m => m.SharedFilesComponent),
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    loadComponent: () => import('./components/user/profile/profile.component')
      .then(m => m.ProfileComponent),
    canActivate: [authGuard]
  },
  {
    path: 'share/:id',
    loadComponent: () => import('./components/shared/shared-view/shared-view.component')
      .then(m => m.SharedViewComponent)
  },
  { path: '**', redirectTo: '/dashboard' }
];