import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { MemberEditComponent } from '../Members/MemberEdit/MemberEdit.component';
import { MemberDetailResolver } from '../_Resolvers/MemberDetailResolver';
@Injectable()
export class PreventUnsavedChanges implements CanDeactivate<MemberEditComponent>{

    canDeactivate(component: MemberEditComponent) {
        if (component.editForm.dirty) {
            return confirm('Are you sure you want to continue? any unsaved changes will be lost ');
        }
        return true;
    }
}
