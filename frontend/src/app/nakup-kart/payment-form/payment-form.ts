import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {StripeCardElementOptions, StripeElementsOptions} from "@stripe/stripe-js";
import {StripeCardNumberComponent, StripeService} from "ngx-stripe";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ApiService} from "../../services/api.service";
import {switchMap} from "rxjs";

@Component({
    templateUrl: './payment-form.html',
})

export class PaymentForm implements OnInit {
    @ViewChild(StripeCardNumberComponent) card: StripeCardNumberComponent;

    stripeTest: FormGroup;

    isLoading: boolean = false;
    isSuccess: boolean = false;

    cardOptions: StripeCardElementOptions = {
        style: {
            base: {
                iconColor: '#666EE8',
                color: '#31325F',
                fontWeight: 300,
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSize: '18px',
                '::placeholder': {
                    color: '#aab7c4',
                },
            },
            invalid: {
                iconColor: '#FF0000',
                color: '#FF0000',
            },
        },
    };


    elementsOptions: StripeElementsOptions = {
        locale: 'sl',
    };

    // @ts-ignore
    constructor(
        public dialogRef: MatDialogRef<PaymentForm>,
        private fb: FormBuilder,
        private stripeService: StripeService,
        private apiService: ApiService,
        @Inject(MAT_DIALOG_DATA) public data: { email: string; amount: number; title: string }
    ) {}

    ngOnInit(): void {
        this.stripeTest = this.fb.group({
            name: ['', [Validators.required]],
            email: [this.data.email],
        });
    }

    pay() {
        if (this.stripeTest.valid) {

            this.apiService.createPaymentIntent(this.data.amount)
                .pipe(
                    switchMap((pi) => {
                        this.isLoading = true;
                        return this.stripeService.confirmCardPayment(pi.client_secret as string, {
                            payment_method: {
                                card: this.card.element,
                                billing_details: {
                                    name: this.stripeTest.get('name')?.value,
                                },
                            },
                        });
                    })
                ).subscribe((result) => {
                    if (result.error) {
                        console.log(result.error.message);
                        alert("INSUFFICIENT FUNDS HAHA");
                    } else {
                        if (result.paymentIntent.status === 'succeeded') {
                            this.isSuccess = true;
                            alert("SUCCESS");
                        }
                    }
                });
        } else {
            console.log(this.stripeTest);
        }
    }


    onCancel(): void {
        this.dialogRef.close();
    }
}