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
import { ReleaseNoteComponent } from './release-note/release-note.component';
import { AboutPageComponent } from './about-page/about-page.component';
import { CacheService } from './cache.service';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [LoadingScreenComponent, SpinnerComponent, IcheckComponent],
  declarations: [LoadingScreenComponent, SpinnerComponent, IcheckComponent, ReleaseNoteComponent, AboutPageComponent],
  providers: [LoadingService, ElectronService, PromptInjectorService, StatusBarService, UpdaterService, CacheService]
})
export class InfrastructureModule { }
