import { StorageService } from './../services/storage.service';
import { Observable } from 'rxjs/Rx';
import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AlertController } from 'ionic-angular';
  
  @Injectable()
  export class ErrorInterceptor implements HttpInterceptor {
    
    constructor(public storage: StorageService, public alertCtrl : AlertController) {

    }


    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
     
        return next.handle(req)
        .catch((error, caught) => {
            let errorObj = error;
            if (errorObj.error) {
                errorObj = errorObj.error;                
            }
            if (!errorObj.status) {
                errorObj = JSON.parse(errorObj);
            }

            console.log("Erro detectado pelo Interceptor:");
            console.log(errorObj);

            switch(errorObj.status) {
                case 401:
                    this.handle401();    

                case 403:
                    this.handle403();

                default:
                    this.handleDefaultError(errorObj);
            }

            return Observable.throw(errorObj);	 
       }) as any;
    }

    handle403() {
        this.storage.setLocalUser(null);
    }

    handle401() {
        let alert = this.alertCtrl.create({
            title: 'Erro 401: falha de autenticação',
            message: 'E-mail ou senha incorretos',
            enableBackdropDismiss: false,
            buttons: [
                {
                    text: 'OK'}
            ]
        });
        alert.present();
    }

    handleDefaultError(errorObj) {
        let alert = this.alertCtrl.create({
            title: 'Erro ' + errorObj.status + ': ' + errorObj.error,
            message: errorObj.message,
            enableBackdropDismiss: false,
            buttons: [
                {
                    text: 'OK'}
            ]
        });
        alert.present();
    }

  }


  export const ErrorInterceptorProvider = {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
  }