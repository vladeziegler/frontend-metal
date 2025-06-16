'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";

export function UnauthorizedModal() {
  const { signIn } = useAuth();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
      <Card className="w-[380px]">
        <CardHeader>
          <CardTitle>Access Restricted</CardTitle>
          <CardDescription>
            This application is available to authorized users only. Please sign in to continue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={signIn} className="w-full">
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 