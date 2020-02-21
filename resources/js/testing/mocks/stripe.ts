  const elementMock = {
    mount: jest.fn(),
    destroy: jest.fn(),
    on: jest.fn(),
    update: jest.fn(),
  }

  const elementsMock = {
    create: jest.fn().mockReturnValue(elementMock),
  }

  export const stripeMock = jest.fn().mockReturnValue({
    elements: jest.fn().mockReturnValue(elementsMock),
    createToken: jest.fn(() => Promise.resolve()),
    createSource: jest.fn(() => Promise.resolve()),
  })