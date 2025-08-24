
'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, Sparkles, Wand2, Copy, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function CodeManager() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [customCode, setCustomCode] = useState('');
    const [generatedCode, setGeneratedCode] = useState('');
    const [showCodeDialog, setShowCodeDialog] = useState(false);

    const handleCopyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast({ title: 'Copied to clipboard!', description: `Code is ready to paste.` });
    };

    const codeExists = async (code: string): Promise<boolean> => {
        const q = query(collection(db, "accessCodes"), where("code", "==", code));
        const querySnapshot = await getDocs(q);
        return !querySnapshot.empty;
    }

    const generateRandomCode = async () => {
        setLoading(true);
        try {
            const newCode = `SC${Date.now().toString().slice(-6)}${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
            await addDoc(collection(db, 'accessCodes'), {
                code: newCode,
                used: false,
                createdAt: serverTimestamp()
            });
            setGeneratedCode(newCode);
            setShowCodeDialog(true);
            toast({ title: 'Code Generated!', description: 'A new random access code has been created.' });
        } catch (error) {
            console.error("Error generating random code:", error);
            toast({ title: 'Error', description: 'Could not generate access code.', variant: 'destructive' });
        } finally {
            setLoading(false);
        }
    };

    const createCustomCode = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!customCode.trim()) {
            toast({ title: 'Error', description: 'Custom code cannot be empty.', variant: 'destructive' });
            return;
        }

        setLoading(true);

        // Check if code already exists
        if (await codeExists(customCode.trim())) {
            toast({ title: 'Error', description: 'This code already exists. Please choose a unique one.', variant: 'destructive' });
            setLoading(false);
            return;
        }

        try {
            await addDoc(collection(db, 'accessCodes'), {
                code: customCode.trim(),
                used: false,
                createdAt: serverTimestamp()
            });
            setGeneratedCode(customCode.trim());
            setShowCodeDialog(true);
            toast({ title: 'Custom Code Created!', description: `Code "${customCode.trim()}" is now active.` });
            setCustomCode(''); // Reset input
        } catch (error) {
            console.error("Error creating custom code:", error);
            toast({ title: 'Error', description: 'Could not create custom code.', variant: 'destructive' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
        <Card>
            <CardHeader>
                <CardTitle>Code Manager</CardTitle>
                <CardDescription>
                Generate random codes or create custom one-time access codes for your customers.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label>Generate a Random Code</Label>
                    <Button onClick={generateRandomCode} disabled={loading} className="w-full">
                        {loading ? <Loader2 className="animate-spin mr-2"/> : <Sparkles className="mr-2" />}
                        Generate Random Code
                    </Button>
                </div>
                <form onSubmit={createCustomCode} className="space-y-2">
                    <Label htmlFor="customCode">Create a Custom Code</Label>
                    <div className="flex gap-2">
                        <Input 
                            id="customCode"
                            placeholder="e.g., JOHNDOE123"
                            value={customCode}
                            onChange={(e) => setCustomCode(e.target.value)}
                            disabled={loading}
                        />
                        <Button type="submit" disabled={loading}>
                           {loading ? <Loader2 className="animate-spin mr-2"/> : <Wand2 className="mr-2" />}
                            Create
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
        <AlertDialog open={showCodeDialog} onOpenChange={setShowCodeDialog}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Access Code Ready!</AlertDialogTitle>
                    <AlertDialogDescription>
                        Share this one-time code with the customer. They can use it at the `/pdf` page to unlock the file.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div 
                className="my-4 p-4 bg-muted rounded-md font-mono text-center text-lg tracking-widest font-bold cursor-pointer"
                onClick={() => handleCopyToClipboard(generatedCode)}
                >
                {generatedCode}
                <Copy className="inline-block ml-2 h-4 w-4" />
                </div>
                <div className="bg-destructive/10 border-l-4 border-destructive text-destructive-foreground p-3 text-left rounded-r-lg text-sm">
                    <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    <p className="font-bold">This code is valid for one use only.</p>
                    </div>
                </div>
                <AlertDialogFooter>
                    <AlertDialogAction onClick={() => setShowCodeDialog(false)}>Close</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
