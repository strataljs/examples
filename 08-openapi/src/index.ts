import { Stratal } from 'stratal'
import { AppModule } from './app.module'

export default new Stratal({
  module: AppModule,
  versioning: { prefix: 'api/v', defaultVersion: '1' },
})
