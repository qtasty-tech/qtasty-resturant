
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, TrendingUp, ExternalLink } from 'lucide-react';

const Marketing = () => {
  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Marketing & Engagement"
        description="Increase your restaurant's visibility and customer engagement"
      />

      <Tabs defaultValue="promotions" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="promotions">Promotions</TabsTrigger>
          <TabsTrigger value="notifications">Push Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="promotions">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Featured Restaurant</CardTitle>
                <CardDescription>
                  Get prime placement in the Q-Tasty app for maximum visibility
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-lg overflow-hidden h-40 bg-gray-100">
                    <img 
                      src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" 
                      alt="Featured restaurant promotion"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Price:</div>
                    <div className="font-bold text-lg">$49.99 / week</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="text-green-600 h-5 w-5" />
                    <span className="text-sm text-muted-foreground">
                      Avg. 42% increase in orders
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  Boost Your Restaurant
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Happy Hour Special</CardTitle>
                <CardDescription>
                  Promote your special discounts during off-peak hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-lg overflow-hidden h-40 bg-gray-100">
                    <img 
                      src="https://images.unsplash.com/photo-1600353565336-5b17e0bdecb3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" 
                      alt="Happy hour promotion"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Price:</div>
                    <div className="font-bold text-lg">$29.99 / week</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="text-green-600 h-5 w-5" />
                    <span className="text-sm text-muted-foreground">
                      Target slow business hours
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  Create Happy Hour Deal
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>New Customer Discount</CardTitle>
                <CardDescription>
                  Attract first-time customers with a special offer
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-lg overflow-hidden h-40 bg-gray-100">
                    <img 
                      src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" 
                      alt="New customer discount"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="font-medium">Price:</div>
                    <div className="font-bold text-lg">$19.99 / week</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="text-green-600 h-5 w-5" />
                    <span className="text-sm text-muted-foreground">
                      Avg. 20 new customers per week
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  Start New Customer Campaign
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Push Notifications</CardTitle>
              <CardDescription>
                Send targeted notifications to your customers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="font-medium">Special Offers</div>
                    <div className="text-sm text-muted-foreground">
                      Notify customers about limited-time promotions and discounts
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="font-medium">New Menu Items</div>
                    <div className="text-sm text-muted-foreground">
                      Alert customers when you add new items to your menu
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="font-medium">Welcome Back</div>
                    <div className="text-sm text-muted-foreground">
                      Re-engage customers who haven't ordered in 30+ days
                    </div>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="font-medium">Order Status Updates</div>
                    <div className="text-sm text-muted-foreground">
                      Keep customers informed about their order progress
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">
                Notification History
              </Button>
              <Button>
                Create Custom Notification
              </Button>
            </CardFooter>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Schedule Notifications</CardTitle>
              <CardDescription>
                Plan notifications in advance for maximum impact
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Bell className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Weekend Special: 15% Off</h4>
                      <p className="text-sm text-muted-foreground">Scheduled for Friday, 2:00 PM</p>
                      <p className="text-sm text-muted-foreground mt-1">Target: All customers within 5 miles</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Edit</Button>
                </div>
                
                <div className="p-4 border rounded-lg flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Bell className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Try Our New Summer Menu</h4>
                      <p className="text-sm text-muted-foreground">Scheduled for Monday, 11:00 AM</p>
                      <p className="text-sm text-muted-foreground mt-1">Target: Previous customers</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Edit</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Marketing;
