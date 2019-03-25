import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { PlacesService } from '../../places.service';
import { Place } from '../../place.model';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit, OnDestroy {
  place: Place;
  placeId: string;
  form: FormGroup;
  private placeSub: Subscription;
  isLoading = false;

  constructor(private route: ActivatedRoute,
    private navCtrl: NavController,
    private placesService: PlacesService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController) { }

    ngOnInit() {
      this.route.paramMap.subscribe(paramMap => {
        if (!paramMap.has('placeId')) {
          this.navCtrl.navigateBack('/places/tabs/offers');
          return;
        }
        this.placeId = paramMap.get('placeId');
        this.isLoading = true;
        this.placeSub = this.placesService.getPlace(paramMap.get('placeId')).subscribe(place => {
          this.place = place;
          this.form = new FormGroup({
            title: new FormControl(this.place.title, {
              updateOn: 'blur',
              validators: [Validators.required]
            }),
            description: new FormControl(this.place.description, {
              updateOn: 'blur',
              validators: [Validators.required]
            }),
          });
          this.isLoading = false;
        }, error => {
            this.alertCtrl.create(
              {
                header: 'Error occured',
                message: 'Place could not be fetched',
                buttons: [{text: 'Ok', handler: () => {
                  this.router.navigate(['/places/tabs/offers']);
                }}]
              }).then(alertEl => {
                alertEl.present();
              });
        });
      });
    }

    ngOnDestroy() {
      if (this.placeSub) {
        this.placeSub.unsubscribe();
      }
    }

    onUpdateOffer() {
      if (!this.form.valid) {
        return;
      }
      this.loadingCtrl.create({
        message: 'Updating offer...'
      }).then(loadingEl => {
        loadingEl.present();
        this.placesService.updatePlace(
          this.place.id,
          this.form.value.title,
          this.form.value.description
          ).subscribe(() => {
            loadingEl.dismiss();
            this.form.reset();
            this.router.navigate(['/places/tabs/offers']);
          });
      });
    }

}
