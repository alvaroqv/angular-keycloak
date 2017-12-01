import { selector } from 'rxjs/operator/publish';
import { Component, OnInit } from '@angular/core';
import { Keycloak, KeycloakAuthorization } from '@ebondu/angular2-keycloak';
import { Headers, Http, RequestOptionsArgs } from '@angular/http';

@Component({
  selector: 'ak-root',
  templateUrl:'./app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  public parsedToken: any;
  public isAuthenticated: boolean;
  public profile: any;
  public message:string = "MSG ";

 serviceUrl:string = 'http://localhost:8080/service/';
 errorClass:string = '';


  constructor(private keycloak: Keycloak, private keycloakAuthz: KeycloakAuthorization, private http: Http) {

    Keycloak.authenticatedObs.subscribe(auth => {
      this.isAuthenticated = auth;
      this.parsedToken = this.keycloak.tokenParsed;

      console.info('APP: authentication status changed...');
    });
  }

  ngOnInit() {
    this.keycloak.config = 'assets/keycloak.json';
    this.keycloakAuthz.init();
    this.keycloak.init({
      checkLoginIframe: false
    });
  }

  login() {
    this.keycloak.login({});
  }

  logout() {
    this.keycloak.logout({});
  }

  loadProfile() {
    this.keycloak.loadUserProfile().subscribe(profile => {
      this.profile = profile;
    });
  }

  reloadData() {
    console.log('Reload data called!');

  }

  request(endpoint) {
console.log(this.keycloak.accessToken);
      if (!this.keycloak.accessToken) {
        this.keycloak.login({});
      }

    let headers = new Headers({'Accept' :'application/json'});
    let options: RequestOptionsArgs = { headers: headers};

    options.headers.set('Authorization', 'Bearer ' + this.keycloak.accessToken);

    this.http.get(this.serviceUrl + endpoint,options)
        .subscribe( res => this.handleResponse(res), error => this.handleServiceError(error) );
};


public handleResponse(res) {
  this.errorClass = '';
  this.message = 'Message: ' + res.json().message;
};

public handleServiceError (error) {
  this.errorClass = 'error';
  if (error.status === 0) {
    this.message = 'Request failed';
  }
  else {
    this.message = error.status + ' ' + error.statusText;
  }
};

}
