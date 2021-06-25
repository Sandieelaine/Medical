import { Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import { LoadingController } from "@ionic/angular";
import { HelpersService } from "../services/helpers.service";

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
    constructor(public loadingCtrl: LoadingController, private helpers: HelpersService) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        alert('Working');
        this.helpers.showLoader();
        return next.handle(req).pipe(
            finalize(() => this.loadingCtrl.dismiss())
        );
    }
}