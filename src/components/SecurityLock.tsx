
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PinInput, PinInputGroup, PinInputSlot } from "@/components/ui/input-otp";
import { toast } from "@/hooks/use-toast";
import { Lock, Unlock, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SecurityLockProps {
  onUnlock: () => void;
  title?: string;
  description?: string;
  pinLength?: number;
  correctPin?: string;
  maxAttempts?: number;
}

export function SecurityLock({
  onUnlock,
  title = "Security Check",
  description = "Enter your PIN to continue",
  pinLength = 4,
  correctPin = "1234", // In a real app, this would be stored securely or validated on the server
  maxAttempts = 3
}: SecurityLockProps) {
  const [pin, setPin] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    let interval: number | undefined;
    
    if (locked && lockTimer > 0) {
      interval = setInterval(() => {
        setLockTimer((prev) => prev - 1);
      }, 1000) as unknown as number;
    } else if (locked && lockTimer === 0) {
      setLocked(false);
      setAttempts(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [locked, lockTimer]);

  const handlePinComplete = (value: string) => {
    if (value === correctPin) {
      setShowSuccess(true);
      
      // Show success animation briefly before unlocking
      setTimeout(() => {
        onUnlock();
        setPin("");
        setAttempts(0);
      }, 1500);
      
      toast({
        title: "Access Granted",
        description: "You have successfully authenticated",
      });
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setPin("");
      
      if (newAttempts >= maxAttempts) {
        setLocked(true);
        setLockTimer(30); // Lock for 30 seconds
        toast({
          title: "Too Many Failed Attempts",
          description: `Please wait ${lockTimer} seconds before trying again`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Incorrect PIN",
          description: `${maxAttempts - newAttempts} attempts remaining`,
          variant: "destructive",
        });
      }
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-center min-h-[300px] w-full"
      >
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              {locked ? (
                <ShieldAlert className="h-5 w-5 text-destructive" />
              ) : showSuccess ? (
                <Unlock className="h-5 w-5 text-primary" />
              ) : (
                <Lock className="h-5 w-5" />
              )}
              <CardTitle>{title}</CardTitle>
            </div>
            <CardDescription>
              {locked
                ? `Too many failed attempts. Please wait ${lockTimer} seconds.`
                : description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-6">
              {showSuccess ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center"
                >
                  <Unlock className="h-8 w-8" />
                </motion.div>
              ) : (
                <PinInput
                  maxLength={pinLength}
                  value={pin}
                  onChange={setPin}
                  onComplete={handlePinComplete}
                  disabled={locked}
                  className="mx-auto"
                >
                  <PinInputGroup className="gap-3">
                    {Array.from({ length: pinLength }).map((_, index) => (
                      <PinInputSlot key={index} index={index} />
                    ))}
                  </PinInputGroup>
                </PinInput>
              )}
              
              {!locked && !showSuccess && (
                <p className="text-sm text-muted-foreground">
                  Enter your {pinLength}-digit PIN to access your financial data
                </p>
              )}
              
              {locked && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-destructive font-medium"
                >
                  Account temporarily locked for {lockTimer} seconds
                </motion.div>
              )}
              
              {showSuccess && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-primary font-medium"
                >
                  Authentication successful!
                </motion.p>
              )}
            </div>
          </CardContent>
          <CardFooter className="justify-between">
            <p className="text-xs text-muted-foreground">
              {!locked && !showSuccess && `${maxAttempts - attempts} attempts remaining`}
            </p>
            {!showSuccess && (
              <Button
                variant="link"
                size="sm"
                disabled={locked}
                onClick={() => setPin("")}
              >
                Clear
              </Button>
            )}
          </CardFooter>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}

export default SecurityLock;
