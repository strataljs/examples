import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Layout from './Layout'

export default function Dashboard({ stats, activeUsers }: DashboardPageProps) {
  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            The props and their types were generated from the controller.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader>
              <CardDescription>Total notes</CardDescription>
              <CardTitle className="text-3xl">{stats.total}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Added recently</CardDescription>
              <CardTitle className="text-3xl">{stats.recent}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Active users</CardDescription>
              <CardTitle className="text-3xl">{activeUsers}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardContent className="pt-6 text-sm text-muted-foreground">
            <code>DashboardPageProps</code> comes from{' '}
            <code>quarry inertia:types</code>, which reads the{' '}
            <code>ctx.inertia()</code> call in the controller.
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
