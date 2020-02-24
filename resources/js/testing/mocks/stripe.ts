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
    elements: jest.fn().mockReturnValue(elementsMock),
    createPaymentMethod: jest.fn(() => Promise.resolve({
      paymentMethod: { id: 'mockStripePaymentMethodId' },
      error: {}
    })),
    createSource: jest.fn(() => Promise.resolve()),
    createToken: jest.fn(() => Promise.resolve()),
  })