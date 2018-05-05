import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingScreenComponent } from './loading-screen/loading-screen.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { LoadingService } from './loading-service.service';
import { ElectronService } from './electron.service';
import { IcheckComponent } from './icheck/icheck.component';
import { PromptInjectorService } from './prompt-injector.service';
import { StatusBarService } from './status-bar.service';
import { UpdaterService } from './updater.service';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [LoadingScreenComponent, SpinnerComponent, IcheckComponent],
  declarations: [LoadingScreenComponent, SpinnerComponent, IcheckComponent],
  providers: [LoadingService, ElectronService, PromptInjectorService, StatusBarService, UpdaterService]
})
export class InfrastructureModule { }
