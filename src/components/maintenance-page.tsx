import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wrench, Clock, Mail } from 'lucide-react';

export default function MaintenancePage() {
  const message = process.env.MAINTENANCE_MESSAGE || 'AdvocatePro is temporarily down for improvements. We\'ll be back soon!';
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Wrench className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Under Maintenance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            {message}
          </p>
          
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>Expected downtime: 1-2 hours</span>
          </div>
          
          <div className="pt-4 border-t">
            <p className="text-sm text-gray-500 mb-3">
              Need immediate assistance?
            </p>
            <Button variant="outline" className="w-full">
              <Mail className="h-4 w-4 mr-2" />
              Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
