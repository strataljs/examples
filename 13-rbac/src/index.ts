import { Stratal } from 'stratal'
import { AppModule } from './app.module'
import './types/auth'

export default new Stratal({
  module: AppModule,
  versioning: { prefix: 'api/v', defaultVersion: '1' },
})
