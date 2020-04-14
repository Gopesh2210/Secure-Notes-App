import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  canActivate(route: import("@angular/router").ActivatedRouteSnapshot,
    state: import("@angular/router").RouterStateSnapshot)
    : boolean | import("@angular/router").UrlTree |
    import("rxjs").Observable<boolean |
    import("@angular/router").UrlTree> |
    Promise<boolean |
      import("@angular/router").UrlTree> {

    // throw new Error("Method not implemented.");

    const isAuth = this.authService.getisAuthenticatedStatus();
    if(!isAuth){
      this.router.navigate(['/auth/login']);
    }

    return isAuth;
    
  }
}
