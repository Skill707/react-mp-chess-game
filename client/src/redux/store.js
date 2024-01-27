import { configureStore } from '@reduxjs/toolkit'
import testReducer from './testSlice.js'

export default configureStore({
  reducer: {
    test: testReducer,
  },
})