import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'fileListFilter',
    pure: false
})
export class FileListFilter implements PipeTransform {
    transform(items: any[], filter: FileListFilterMask): any {
        if (!items || !filter) {
            return items;
        }
        return items.filter(item => {
            if (item.isAdded && filter.added) {
                return true;
            } else if (item.isDeleted && filter.deleted) {
                return true;
            } else if (item.isModified && filter.modified) {
                return true;
            } else if (item.isRenamed && filter.renamed) {
                return true;
            } else {
                return false;
            }
        });
    }
}

export class FileListFilterMask {
    added: boolean;
    deleted: boolean;
    modified: boolean;
    renamed: boolean;
    constructor(add, del, modif, rena) {
        this.added = add;
        this.deleted = del;
        this.modified = modif;
        this.renamed = rena;
    }
    showAll(): boolean {
        return this.added && this.deleted && this.modified && this.renamed;
    }
}
