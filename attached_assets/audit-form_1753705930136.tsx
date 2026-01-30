import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Globe, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { auditRequestSchema, type AuditRequest, type AuditResults } from "@shared/schema";

interface AuditFormProps {
  onAuditStart: () => void;
  onAuditComplete: (results: AuditResults) => void;
}

export default function AuditForm({ onAuditStart, onAuditComplete }: AuditFormProps) {
  const { toast } = useToast();
  
  const form = useForm<AuditRequest>({
    resolver: zodResolver(auditRequestSchema),
    defaultValues: {
      websiteUrl: "",
      conversionGoal: "",
      businessType: "",
    },
  });

  const auditMutation = useMutation({
    mutationFn: async (data: AuditRequest) => {
      const response = await apiRequest("POST", "/api/audits", data);
      return response.json();
    },
    onSuccess: (results: AuditResults) => {
      onAuditComplete(results);
      toast({
        title: "Audit Complete",
        description: "Your website audit has been completed successfully!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Audit Failed",
        description: error.message || "Failed to complete the audit. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: AuditRequest) => {
    onAuditStart();
    auditMutation.mutate(data);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 mb-12 max-w-4xl mx-auto">
      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">Start Your Free CRO Audit</h3>
        <p className="text-gray-600">Enter your website details below to receive a comprehensive conversion rate optimization audit.</p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="websiteUrl" className="text-sm font-medium text-gray-700 mb-2">
              Website URL <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="websiteUrl"
                type="text"
                placeholder="yourwebsite.com"
                className="pl-10"
                {...form.register("websiteUrl")}
              />
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            <p className="mt-1 text-sm text-gray-500">Enter your website URL (we'll add https:// automatically)</p>
            {form.formState.errors.websiteUrl && (
              <p className="mt-1 text-sm text-red-600">{form.formState.errors.websiteUrl.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="conversionGoal" className="text-sm font-medium text-gray-700 mb-2">
              Primary Conversion Goal <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="conversionGoal"
                placeholder="e.g., Sign Up, Buy Now, Get Quote"
                className="pl-10"
                {...form.register("conversionGoal")}
              />
              <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            <p className="mt-1 text-sm text-gray-500">What action do you want visitors to take?</p>
            {form.formState.errors.conversionGoal && (
              <p className="mt-1 text-sm text-red-600">{form.formState.errors.conversionGoal.message}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="businessType" className="text-sm font-medium text-gray-700 mb-2">
            Business Type (Optional)
          </Label>
          <Select onValueChange={(value) => form.setValue("businessType", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select your business type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ecommerce">E-commerce</SelectItem>
              <SelectItem value="saas">SaaS</SelectItem>
              <SelectItem value="service">Service Business</SelectItem>
              <SelectItem value="agency">Agency</SelectItem>
              <SelectItem value="nonprofit">Non-profit</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          <p className="mt-1 text-sm text-gray-500">Helps us provide more targeted recommendations</p>
        </div>

        <div className="flex items-center space-x-2 pt-6">
          <Checkbox id="terms" required />
          <Label htmlFor="terms" className="text-sm text-gray-900">
            I agree to the{" "}
            <a href="#" className="text-primary hover:text-primary/80">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-primary hover:text-primary/80">
              Privacy Policy
            </a>
          </Label>
        </div>

        <Button 
          type="submit" 
          className="w-full py-4 text-lg font-semibold"
          disabled={auditMutation.isPending}
        >
          {auditMutation.isPending ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Running Audit...
            </>
          ) : (
            <>
              <Globe className="mr-2 h-4 w-4" />
              Start Free CRO Audit
            </>
          )}
        </Button>
      </form>
    </div>
  );
}