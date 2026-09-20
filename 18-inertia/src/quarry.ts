import { InertiaQuarryModule } from '@stratal/inertia/quarry'
import { QuarryRunner } from 'stratal/quarry/runner'
import { AppModule } from './app.module'

export default QuarryRunner.run({
  imports: [AppModule, InertiaQuarryModule],
})
