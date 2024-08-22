import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {StripeCardElementOptions, StripeElementsOptions} from "@stripe/stripe-js";
import {StripeService} from "ngx-stripe";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
    selector: 'payment-form',
    templateUrl: './payment-form.html',
})

export class PaymentForm {

    onCancel(): void {
        this.dialogRef.close();
    }

    stripeTest: FormGroup;

    cardOptions: StripeCardElementOptions = {
        style: {
            base: {
                iconColor: '#666EE8',
                color: '#31325F',
                lineHeight: '40px',
                fontWeight: 300,
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSize: '18px',
                '::placeholder': {
                    color: '#CFD7E0',
                },
            },
        },
    };

    elementsOptions: StripeElementsOptions = {
        locale: 'en',
    };

    // @ts-ignore
    constructor(
        public dialogRef: MatDialogRef<PaymentForm>,
        private fb: FormBuilder,
        private stripeService: StripeService
    ) {
        this.stripeTest = this.fb.group({
            name: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]]
        });
    }

    createToken() {
        // @ts-ignore
        const name = this.stripeTest.get('name').value;
        // @ts-ignore
        const {value} = this.stripeTest.get('card');
        this.stripeService
            .createToken(value, { name })
            .subscribe((result) => {
                if (result.token) {
                    // Use the token
                    console.log(result.token.id);
                } else if (result.error) {
                    // Error creating the token
                    console.log(result.error.message);
                }
            });
    }
}