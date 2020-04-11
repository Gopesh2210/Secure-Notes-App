import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from '../../components/auth/data-type/authdata.model'
import { LoginData } from '../../components/auth/data-type/login.model'
import { Subject } from 'rxjs';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token : string;
  private userName : string;
  isAuthenticated : boolean = false;
  private tokenTimer: any;
  private userId: string;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) { }

  createUser(name: string, email: string, password:string){
    
    const authData : AuthData = {name: name, email: email, password: password};
  
    return this.http.post('http://localhost:3000/api/user/signup', authData)
    .subscribe(responseData => {
      this.router.navigate(['/login']);
    }, error => {
        this.authStatusListener.next(false);
    });
  
  }

  userLogin(email: string, password: string){

    const loginData : LoginData = {email: email, password: password};

    this.http.post<{token: string, userName: string, expiresIn: number, userId: string}>('http://localhost:3000/api/user/login', loginData)
    .subscribe(responseData => {
      // storing the token and username in front end from the back end
      const token = responseData.token
      this.token = token;
      const userName = responseData.userName;
      this.userName = userName;

      if(this.token){
        const expiresInDuration = responseData.expiresIn;
        this.tokenTimer = this.setAuthTimer(expiresInDuration);
        // userId is stored in order to check which user posted which notes
        const userId = responseData.userId
        this.userId = userId;
        this.isAuthenticated = true;
        this.authStatusListener.next(true);
        const timeNow = new Date();
        const expirationDate = new Date(timeNow.getTime() + expiresInDuration * 1000);
        console.log("Date: ",expirationDate);
        this.saveAuthData(token, expirationDate, userName, userId);
        this.router.navigate(['/']);
      }
    }, error => {
      this.authStatusListener.next(false);
    });

  }

  getToken(){
    return this.token;
  }

  getUserName(){
    return this.userName;
  }

  getUserId(){
    return this.userId;
  }

  getAuthStatusListener(){
    return this.authStatusListener.asObservable();
  }

  getisAuthenticatedStatus(){
    return this.isAuthenticated;
  }

  // saves auth data in the local storage for session management for the given duration
  private saveAuthData(token: string, expirationDate: Date, userName: string, userId: string){
    localStorage.setItem('token',token);
    localStorage.setItem('expiration',expirationDate.toISOString());
    localStorage.setItem('userName',userName);
    localStorage.setItem('userId',userId);

  }

  // clear authData ; called on logout()
  private clearAuthData(){
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
  }

  // sets authentication timer for duration
  private setAuthTimer(duration: number){
    setTimeout(() => {
      this.logout();
  }, duration * 1000);
  }

  // checks login session by fetching authData for that session and comparing with current time
   autoAuthUser(){
    const authAutoInfo = this.getAuthData();
    // checks if auth info is available
    if(!authAutoInfo){
      return;
    }

    const timeNow = new Date();
    const expiresIn = authAutoInfo.expirationDate.getTime() - timeNow.getTime() ;
    if(expiresIn > 0){
      this.token = authAutoInfo.token;
      this.userName = authAutoInfo.userName;
      this.userId = authAutoInfo.userId;

      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn/1000);
      this.authStatusListener.next(true);
    }
    

  }

  // returns the authorization data for the given session
  private getAuthData(){
      const token = localStorage.getItem('token');
      const expirationDate = localStorage.getItem('expiration');
      const userName = localStorage.getItem('userName');
      const userId = localStorage.getItem('userId');

      if(!token || !expirationDate){
        return;
      }

      return {
        token : token,
        expirationDate : new Date(expirationDate),
        userName : userName,
        userId: userId
      }
  }

  // handles logout actions
    logout(){
      this.token = null;
      this.isAuthenticated = false;
      this.authStatusListener.next(false);
      this.userId = null;
      clearTimeout(this.tokenTimer);
      this.clearAuthData();
      this.router.navigate(['/login']);
    }

}
