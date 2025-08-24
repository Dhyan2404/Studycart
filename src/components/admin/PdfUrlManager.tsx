
'use client';

import * as React from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { updatePdfUrl, type PdfUrlState } from '@/lib/actions';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, Save, Link as LinkIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />}
      {pending ? 'Saving...' : 'Save URL'}
    </Button>
  );
}

export function PdfUrlManager() {
  const { toast } = useToast();
  const initialState: PdfUrlState = { message: null, errors: {}, success: false };
  const [currentUrl, setCurrentUrl] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    async function fetchUrl() {
      setLoading(true);
      try {
        const docRef = doc(db, "pdfConfig", "main");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const url = docSnap.data().url || '';
          setCurrentUrl(url);
          // Also set the value in the form input
          if (formRef.current) {
            (formRef.current.elements.namedItem('pdfUrl') as HTMLInputElement).value = url;
          }
        }
      } catch (e) {
        console.error("Failed to fetch PDF URL", e);
        toast({
            title: 'Error',
            description: 'Could not fetch the current PDF URL.',
            variant: 'destructive'
        })
      }
      setLoading(false);
    }
    fetchUrl();
  }, [toast]);

  const handleAction = async (prevState: PdfUrlState, formData: FormData): Promise<PdfUrlState> => {
    const result = await updatePdfUrl(prevState, formData);
    if (result.success) {
      toast({ title: 'Success!', description: result.message });
      setCurrentUrl(formData.get('pdfUrl') as string);
    } else {
      toast({ title: 'Error', description: result.message || 'An unknown error occurred.', variant: 'destructive' });
    }
    return result;
  };
  
  const [state, dispatch] = useActionState(handleAction, initialState);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Manage PDF URL</CardTitle>
          <CardDescription>Loading configuration...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-10 w-full bg-muted animate-pulse rounded-md" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage PDF URL</CardTitle>
        <CardDescription>
          Update the Google Drive link for the PDF that users will see after payment.
          Please use the shareable link.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={dispatch} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pdfUrl">Google Drive PDF URL</Label>
            <div className="flex items-center gap-2">
                <LinkIcon className="text-muted-foreground" />
                <Input
                    id="pdfUrl"
                    name="pdfUrl"
                    type="url"
                    placeholder="https://drive.google.com/file/d/..."
                    defaultValue={currentUrl}
                    required
                />
            </div>
            {state?.errors?.url && <p className="text-sm text-destructive">{state.errors.url[0]}</p>}
             {state && !state.success && state.message && !state.errors?.url && (
              <p className="text-sm text-destructive">{state.message}</p>
            )}
          </div>
          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  );
}
