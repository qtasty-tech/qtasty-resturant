
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const formSchema = z.object({
  restaurantName: z.string().min(2, { message: 'Restaurant name is required' }),
  ownerName: z.string().min(2, { message: 'Your name is required' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number' }),
});

const SignUp = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      restaurantName: '',
      ownerName: '',
      email: '',
      password: '',
      phone: '',
    },
  });

  function handleNextStep() {
    if (currentStep === 1) {
      // Validate first step fields
      const stepOneResult = form.trigger(['restaurantName', 'ownerName']);
      stepOneResult.then((isValid) => {
        if (isValid) setCurrentStep(2);
      });
    }
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: 'Registration submitted',
        description: 'Your application is under review. We will notify you once approved.',
      });
      navigate('/auth/verification-pending');
    }, 1500);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="inline-block w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold mb-4">
            Q
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Join Q-Tasty as a Restaurant Partner</h1>
          <p className="text-gray-600 mt-2">Create an account to get started</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Restaurant Registration</CardTitle>
            <CardDescription>
              Fill in your restaurant details to join our platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={currentStep === 1 ? "step1" : "step2"} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="step1" disabled={currentStep !== 1}>Restaurant Info</TabsTrigger>
                <TabsTrigger value="step2" disabled={currentStep !== 2}>Account Setup</TabsTrigger>
              </TabsList>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <TabsContent value="step1" className="space-y-4">
                    <FormField
                      control={form.control}
                      name="restaurantName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Restaurant Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your Restaurant Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="ownerName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Owner/Manager Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your Full Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button onClick={handleNextStep} className="w-full">
                      Continue
                    </Button>
                  </TabsContent>
                  <TabsContent value="step2" className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="your-email@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="******" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="+1 (555) 000-0000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex gap-2">
                      <Button type="button" variant="outline" onClick={() => setCurrentStep(1)} className="flex-1">
                        Back
                      </Button>
                      <Button type="submit" className="flex-1" disabled={isLoading}>
                        {isLoading ? 'Submitting...' : 'Submit Application'}
                      </Button>
                    </div>
                  </TabsContent>
                </form>
              </Form>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="link" onClick={() => navigate('/auth/signin')}>
              Already have an account? Sign in
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
