import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToggleService {
  isSidebarOpen =  new BehaviorSubject<boolean>(false);
  isCreatPostOpen = new BehaviorSubject<boolean>(false);
  createPostOpen$ = this.isCreatPostOpen.asObservable();
  sidebarOpen$ = this.isSidebarOpen.asObservable();
  constructor() { }

  toggleSidebar() {
    this.isSidebarOpen.next(!this.isSidebarOpen.value);
  }

  toggleCreatePost(){
    this.isCreatPostOpen.next(!this.isCreatPostOpen.value);
  }
}
