import { Card, CardContent } from './ui/Card.jsx';

export function StatCard({ label, value, icon: Icon }) {
  return (
    <Card>
      <CardContent className="p-5 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold text-foreground mt-1">{value}</p>
        </div>
        {Icon && (
          <div className="rounded-full bg-primary/10 p-2.5">
            <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
