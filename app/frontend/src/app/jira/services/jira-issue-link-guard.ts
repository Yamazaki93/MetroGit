import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Injectable } from "@angular/core";
import { JiraIntegrationService } from "./jira-integration.service";

@Injectable()
export class JIRAIssueGuard implements CanActivate {
    constructor(
        private jira: JiraIntegrationService,
    ) {
    }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        this.jira.pushPrevious(route.params.previousKey);
        this.jira.navigateToIssue(route.params.key);
        return false;
    }
}
