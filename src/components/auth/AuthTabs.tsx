
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignInForm } from "./SignInForm";
import { SignUpForm } from "./SignUpForm";
import { ResetPasswordForm } from "./ResetPasswordForm";

interface AuthTabsProps {
  defaultTab?: string;
}

export const AuthTabs = ({ defaultTab = "signin" }: AuthTabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <div className="w-full max-w-md mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signin">Sign In</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        
        <TabsContent value="signin" className="space-y-4">
          <SignInForm onForgotPassword={() => setActiveTab("reset")} />
        </TabsContent>
        
        <TabsContent value="signup" className="space-y-4">
          <SignUpForm />
        </TabsContent>
        
        <TabsContent value="reset" className="space-y-4">
          <ResetPasswordForm onBackToSignIn={() => setActiveTab("signin")} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
