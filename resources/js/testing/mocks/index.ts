//-----------------------------------------------------------------------------
// Imports
//-----------------------------------------------------------------------------

//-----------------------------------------------------------------------------
// Exports
//-----------------------------------------------------------------------------
export { 
  appState as mockAppState, 
  appStateFactory as mockAppStateFactory,
  appStateFactoryColumns as mockAppStateColumnTypes, 
  getCellAndCellProps, 
  getMockAppState,
  getMockAppStateByTasksheetSubscriptionType,
  getMockAppStateByUsersFilePermissionRole,
  IAppStateFactoryInput as IMockAppStateFactoryInput,
  IGetCellAndCellProps 
} from '@/testing/mocks/appState'

export { createMockStore } from '@/testing/mocks/createMockStore'

export const mockEnvironment = {
  assetUrl: 'testAssetUrl',
  s3Bucket: 'testS3Bucket',
  stripeKey: 'pk_test_8At8pLHxkRH0MLAwBVTtT5eW00maMxOdQH'
}

export { stripeMock } from '@/testing/mocks/stripe'
export const stripeCardNumbers = {
  TEST: '4242 4242 4242 4242'
}
