'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { login, type AuthState } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, LogIn } from 'lucide-react';

function LoginButton() {
  const { pending } = useFormStatus();
  return (
    <Button className="w-full text-lg py-6" disabled={pending}>
       <LogIn className="mr-2 h-5 w-5" />
      {pending ? 'Signing In...' : 'Sign In'}
    </Button>
  );
}

export default function LoginPage() {
  const initialState: AuthState = { message: null };
  const [state, dispatch] = useActionState(login, initialState);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-secondary/30 p-4">
      <Card className="mx-auto max-w-sm w-full bg-card/80 backdrop-blur-sm border-primary/20 animate-aura-pulse">
        <CardHeader className="text-center space-y-4">
            <div className="mx-auto bg-primary/10 p-4 rounded-full border-2 border-primary/30">
               <Lock className="h-8 w-8 text-primary" />
            </div>
          <CardTitle className="text-3xl font-headline tracking-tight">Admin Portal</CardTitle>
          <CardDescription>Enter your password to access the dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={dispatch} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                required
                placeholder="••••••••"
                className="text-center text-lg"
              />
            </div>
            {state?.message && (
              <p className="text-sm text-center font-medium text-destructive">{state.message}</p>
            )}
            <LoginButton />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
