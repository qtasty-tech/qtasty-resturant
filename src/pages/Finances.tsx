
import { useState } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { CreditCard, Download, Calendar, ChevronDown, ChevronsUpDown, Check, Wallet } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';

const paymentMethods = [
  {
    id: 'bank-transfer',
    name: 'Bank Transfer',
    accountName: 'Restaurant Account',
    accountNumber: '**** 3456',
    default: true
  },
  {
    id: 'paypal',
    name: 'PayPal',
    accountName: 'restaurant@example.com',
    default: false
  }
];

const Finances = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(paymentMethods[0].id);

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Financial Management"
        description="Track your earnings and manage payouts"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle>Total Earnings</CardTitle>
              <CardDescription>Your earnings for May 2025</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Calendar className="mr-2 h-4 w-4" />
                May 2025
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-4">$8,245.80</div>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="text-sm font-medium">Order Revenue</div>
                  <div className="text-sm font-medium">$9,235.00</div>
                </div>
                <Progress value={100} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="text-sm font-medium">Platform Fee (8%)</div>
                  <div className="text-sm font-medium text-red-500">-$738.80</div>
                </div>
                <Progress value={8} className="h-2 bg-gray-100" indicatorClassName="bg-accent" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="text-sm font-medium">Delivery Fee (3%)</div>
                  <div className="text-sm font-medium text-red-500">-$277.05</div>
                </div>
                <Progress value={3} className="h-2 bg-gray-100" indicatorClassName="bg-accent" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="text-sm font-medium">Other Deductions</div>
                  <div className="text-sm font-medium text-red-500">-$73.35</div>
                </div>
                <Progress value={0.8} className="h-2 bg-gray-100" indicatorClassName="bg-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Next Payout</CardTitle>
            <CardDescription>Scheduled for May 31, 2025</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-3 border rounded-lg p-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
              <div className="text-2xl font-bold">$2,158.40</div>
              <div className="text-sm text-muted-foreground">For orders processed between May 16-31</div>
            </div>
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Payment Method:</span>
                <span className="text-sm font-medium">Bank Transfer</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Account:</span>
                <span className="text-sm font-medium">**** 3456</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Processing Time:</span>
                <span className="text-sm font-medium">1-2 Business Days</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">
              View Payout Details
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Tabs defaultValue="payouts">
        <TabsList className="mb-4">
          <TabsTrigger value="payouts">Payout History</TabsTrigger>
          <TabsTrigger value="settings">Payout Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="payouts">
          <Card>
            <CardHeader>
              <CardTitle>Recent Payouts</CardTitle>
              <CardDescription>Your payout history for the last 3 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4">
                  <div className="space-y-1">
                    <div className="font-semibold">April 2025 Payout</div>
                    <div className="text-sm text-muted-foreground">April 30, 2025</div>
                    <div className="text-sm text-muted-foreground">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        Completed
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 sm:mt-0 flex flex-col items-end">
                    <div className="font-bold text-xl">$7,892.45</div>
                    <Button variant="ghost" size="sm" className="mt-1 h-7 px-2">
                      <Download className="mr-1 h-3.5 w-3.5" />
                      <span className="text-xs">Invoice</span>
                    </Button>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4">
                  <div className="space-y-1">
                    <div className="font-semibold">March 2025 Payout</div>
                    <div className="text-sm text-muted-foreground">March 31, 2025</div>
                    <div className="text-sm text-muted-foreground">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        Completed
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 sm:mt-0 flex flex-col items-end">
                    <div className="font-bold text-xl">$8,142.20</div>
                    <Button variant="ghost" size="sm" className="mt-1 h-7 px-2">
                      <Download className="mr-1 h-3.5 w-3.5" />
                      <span className="text-xs">Invoice</span>
                    </Button>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div className="space-y-1">
                    <div className="font-semibold">February 2025 Payout</div>
                    <div className="text-sm text-muted-foreground">February 28, 2025</div>
                    <div className="text-sm text-muted-foreground">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        Completed
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 sm:mt-0 flex flex-col items-end">
                    <div className="font-bold text-xl">$7,235.60</div>
                    <Button variant="ghost" size="sm" className="mt-1 h-7 px-2">
                      <Download className="mr-1 h-3.5 w-3.5" />
                      <span className="text-xs">Invoice</span>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Payouts
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Payout Schedule</CardTitle>
              <CardDescription>Customize when you receive payments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="font-medium">Current Schedule</div>
                <div className="flex items-center gap-2 p-3 border rounded-md bg-gray-50">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <span>Twice Monthly (15th and Last Day)</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="font-medium">Payout Options</div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="bi-monthly"
                      name="schedule"
                      defaultChecked
                      className="h-4 w-4 text-primary"
                    />
                    <label htmlFor="bi-monthly" className="text-sm">
                      Twice Monthly (15th and Last Day)
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="weekly"
                      name="schedule"
                      className="h-4 w-4 text-primary"
                    />
                    <label htmlFor="weekly" className="text-sm">
                      Weekly (Every Monday)
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="monthly"
                      name="schedule"
                      className="h-4 w-4 text-primary"
                    />
                    <label htmlFor="monthly" className="text-sm">
                      Monthly (Last day of month)
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="font-medium">Payment Method</div>
                <div>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                      >
                        {value
                          ? paymentMethods.find((method) => method.id === value)?.name
                          : "Select payment method..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0">
                      <Command>
                        <CommandInput placeholder="Search payment method..." />
                        <CommandEmpty>No payment method found.</CommandEmpty>
                        <CommandGroup>
                          {paymentMethods.map((method) => (
                            <CommandItem
                              key={method.id}
                              value={method.id}
                              onSelect={(currentValue) => {
                                setValue(currentValue === value ? "" : currentValue);
                                setOpen(false);
                              }}
                            >
                              <Check
                                className={`mr-2 h-4 w-4 ${
                                  value === method.id ? "opacity-100" : "opacity-0"
                                }`}
                              />
                              <div className="flex flex-col">
                                <span>{method.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  {method.accountName || method.accountNumber}
                                </span>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <Button variant="outline" className="w-full">
                <CreditCard className="mr-2 h-4 w-4" />
                Add New Payment Method
              </Button>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Save Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Finances;
