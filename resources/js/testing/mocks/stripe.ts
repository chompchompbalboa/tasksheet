//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------
import { IStripeError } from '@desktop/Stripe/StripeErrorMessage'

//-----------------------------------------------------------------------------
// Mocks
//-----------------------------------------------------------------------------
export interface IStripeMock {
  elements(): void
  confirmCardPayment(): void
  confirmCardSetup: jest.Mock<Promise<{ setupIntent: { payment_method: string }, error: IStripeError }>>
  createPaymentMethod: jest.Mock<Promise<{ paymentMethod: { id: string }, error: IStripeError }>>
  createSource(): void
  createToken(): void
}

const elementMock = {
  mount: jest.fn(),
  destroy: jest.fn(),
  on: jest.fn(),
  update: jest.fn(),
}

const elementsMock = {
  create: jest.fn().mockReturnValue(elementMock),
  getElement: jest.fn(() => Promise.resolve())
}

export const stripeMock = jest.fn().mockReturnValue({
  elements: jest.fn().mockReturnValue(elementsMock), // Required to pass isStripe check in @stripe/stripe-js
  confirmCardPayment: jest.fn(() => Promise.resolve()), // Required to pass isStripe check in @stripe/stripe-js
  confirmCardSetup: jest.fn(() => Promise.resolve({
    setupIntent: { paymentMethod: 'mockStripePaymentMethodId' },
    error: null
  })),
  createPaymentMethod: jest.fn(() => Promise.resolve({ // Required to pass isStripe check in @stripe/stripe-js
    paymentMethod: { id: 'mockStripePaymentMethodId' },
    error: null
  })),
  createSource: jest.fn(() => Promise.resolve()),
  createToken: jest.fn(() => Promise.resolve()), // Required to pass isStripe check in @stripe/stripe-js
}) as () => IStripeMock