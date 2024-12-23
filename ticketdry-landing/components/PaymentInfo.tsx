import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { CardCvcElement, CardExpiryElement, CardNumberElement } from "@stripe/react-stripe-js"
import { useFormContext } from "react-hook-form"
import { useState } from "react";
import Image from "next/image";

interface PaymentInfoProps {}

const ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      '::placeholder': {
        color: '#aab7c4',
      },
      border: '1px solid #e2e8f0',
      padding: '10px',
    },
    invalid: {
      color: '#fa755a',
    },
  },
}

function PaymentComponent({}: PaymentInfoProps) {
  const { setValue, trigger, formState: { errors } } = useFormContext();
  const [cardBrand, setCardBrand] = useState('');
  const [cardErrors, setCardErrors] = useState({
    cardNumber: '',
    cardExpiry: '',
    cardCvc: ''
  });

  const handleElementChange = (event: any, fieldName: string) => {
    setValue(fieldName, event.complete ? 'complete' : 'incomplete');
    trigger(fieldName);
    setCardErrors(prev => ({ ...prev, [fieldName]: event.error ? event.error.message : '' }));
    if (fieldName === 'cardNumber' && event.brand) {
      setCardBrand(event.brand);
    }
  };

  // Function to get the card icon URL
  const getCardIcon = (brand: string) => {
    switch (brand) {
      case 'visa':
        return '/visa.png';
      case 'mastercard':
        return '/mastercard.png';
      // Add more brands as needed
      default:
        return '/path/to/default-icon.png';
    }
  };

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Información de pago</h2>
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="card-number">Número de tarjeta</Label>
              <div className="flex items-center border border-gray-300 rounded-lg p-3 shadow-sm focus-within:border-blue-500">
                <CardNumberElement
                  id="card-number"
                  options={ELEMENT_OPTIONS}
                  className="flex-grow"
                  onChange={(event) => handleElementChange(event, 'cardNumber')}
                  onBlur={() => trigger('cardNumber')}
                  onReady={(el) => setValue('cardNumber', el)}
                />
                {cardBrand && cardBrand !== 'unknown' && (
                  <Image
                    src={getCardIcon(cardBrand)}
                    alt={cardBrand}
                    className="ml-2 h-3.5 w-10"
                    width={40}
                    height={40}
                  />
                )}
              </div>
              {(errors.cardNumber || cardErrors.cardNumber) && (
                <p className="text-red-500 text-xs mt-1">
                  {(errors.cardNumber?.message || cardErrors.cardNumber)?.toString()}
                </p>
              )}
            </div>

            <div className="flex space-x-4">
              <div className="w-1/2">
                <Label htmlFor="card-expiry">Fecha de caducidad</Label>
                <div className="border border-gray-300 rounded-lg p-3 shadow-sm focus-within:border-blue-500">
                  <CardExpiryElement
                    id="card-expiry"
                    options={ELEMENT_OPTIONS}
                    className="w-full"
                    onChange={(event) => handleElementChange(event, 'cardExpiry')}
                  />
                </div>
                {(errors.cardExpiry || cardErrors.cardExpiry) && (
                <p className="text-red-500 text-xs mt-1">
                  {(errors.cardExpiry?.message || cardErrors.cardExpiry)?.toString()}
                </p>
              )}
              </div>
              <div className="w-1/2">
                <Label htmlFor="card-cvc">CVC</Label>
                <div className="border border-gray-300 rounded-lg p-3 shadow-sm focus-within:border-blue-500">
                  <CardCvcElement
                    id="card-cvc"
                    options={ELEMENT_OPTIONS}
                    className="w-full"
                    onChange={(event) => handleElementChange(event, 'cardCvc')}
                  />
                </div>
                {(errors.cardCvc || cardErrors.cardCvc) && (
                <p className="text-red-500 text-xs mt-1">
                  {(errors.cardCvc?.message || cardErrors.cardCvc)?.toString()}
                </p>
              )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

export default function PaymentInfo() {
  return (
      <PaymentComponent />
  )
}
