import AxiosMockAdapter from 'axios-mock-adapter'
import axios from '@/api/axios'
export const mockAxios = new AxiosMockAdapter(axios);