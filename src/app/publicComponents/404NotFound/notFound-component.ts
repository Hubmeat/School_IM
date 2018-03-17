import { Component } from '@angular/core';
import { Location }  from '@angular/common';

@Component({
    selector: 'notFound-component',
    templateUrl: './notFound-component.html',
    styles: [``]
})

export class NotFoundComponent {
    size:string = 'large';

    constructor(private location: Location) {}

    goBack () {
        this.location.back()
    }
}