import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'profileFilter',
    pure: false
})
export class ProfileFilterPipe implements PipeTransform {
    transform(items: any[], filter: { name: string }): any {
        if (!items || !filter) {
            return items;
        }

        return items.filter(item => item.displayName.toUpperCase().indexOf(filter.name.toUpperCase()) !== -1 || item.key.toUpperCase().indexOf(filter.name.toUpperCase()) !== -1);
    }
}
