import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { MenuController } from 'ionic-angular/components/app/menu-controller';
import { CredenciaisDTO } from '../../models/credenciais.dto';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  creds : CredenciaisDTO = {
    email: "",
    senha: ""
  };

  constructor(
    public navCtrl: NavController, 
    public menu: MenuController,
    public auth: AuthService,
    public storage: StorageService) { 
  } 
 
  ionViewWillEnter() { 
    this.menu.swipeEnable(false); 
  } 

  ionViewDidEnter() { 
    if (this.storage.getLocalUser() !== null) {
    this.auth.refreshToken()
        .subscribe(response => {
        this.auth.successFullLogin(response.headers.get('Authorization'));
          this.navCtrl.setRoot('CategoriasPage');
        },
        error => {});
      }
  } 
 
  ionViewDidLeave() { 
    this.menu.swipeEnable(true); 
  }

  login() {

    this.auth.authenticate(this.creds)
        .subscribe(response => {
        this.auth.successFullLogin(response.headers.get('Authorization'));
          this.navCtrl.setRoot('CategoriasPage');
        },
        error => {});
  }

  signup() {
    this.navCtrl.push('SignupPage');
  }

}
