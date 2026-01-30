import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Clock, Search, Target, Navigation, FileText } from "lucide-react";
import { useState, useEffect } from "react";

const ANALYSIS_STEPS = [
  { icon: Search, label: "Fetching website content", duration: 2000 },
  { icon: Target, label: "Analyzing above-fold elements", duration: 3000 },
  { icon: Navigation, label: "Evaluating CTAs and navigation", duration: 4000 },
  { icon: FileText, label: "Assessing content structure", duration: 5000 },
  { icon: CheckCircle, label: "Generating recommendations", duration: 6000 },
];

export default function LoadingState() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        const next = prev + 1;
        if (next < ANALYSIS_STEPS.length) {
          // Mark previous step as completed
          if (prev >= 0) {
            setCompletedSteps((completed) => [...completed, prev]);
          }
          return next;
        }
        return prev;
      });
    }, 1200);

    return () => clearInterval(timer);
  }, []);

  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="pt-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Analyzing Your Website
          </h2>
          <p className="text-gray-600">
            This usually takes 15-30 seconds. We're performing a comprehensive audit of your conversion elements.
          </p>
        </div>

        <div className="space-y-4">
          {ANALYSIS_STEPS.map((step, index) => {
            const isCompleted = completedSteps.includes(index);
            const isCurrent = currentStep === index;
            const isPending = index > currentStep;

            return (
              <div
                key={index}
                className={`flex items-center p-4 rounded-lg transition-all duration-300 ${
                  isCompleted
                    ? "bg-green-50 border border-green-200"
                    : isCurrent
                    ? "bg-blue-50 border border-blue-200"
                    : "bg-gray-50 border border-gray-200"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${
                    isCompleted
                      ? "bg-green-100"
                      : isCurrent
                      ? "bg-blue-100"
                      : "bg-gray-100"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : isCurrent ? (
                    <div className="animate-pulse">
                      <step.icon className="h-5 w-5 text-blue-600" />
                    </div>
                  ) : (
                    <Clock className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                <span
                  className={`font-medium ${
                    isCompleted
                      ? "text-green-700"
                      : isCurrent
                      ? "text-blue-700"
                      : "text-gray-500"
                  }`}
                >
                  {step.label}
                </span>
                {isCurrent && (
                  <div className="ml-auto">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700 text-center">
            💡 <strong>Pro Tip:</strong> While you wait, think about your main conversion goals. 
            Are visitors finding what they need quickly? Is your value proposition clear?
          </p>
        </div>
      </CardContent>
    </Card>
  );
}