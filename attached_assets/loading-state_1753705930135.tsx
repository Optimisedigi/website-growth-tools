import { useEffect, useState } from "react";
import { Check, Clock, Loader2 } from "lucide-react";

const steps = [
  { id: 1, text: "Capturing website structure", delay: 0 },
  { id: 2, text: "Analyzing above-the-fold content", delay: 2000 },
  { id: 3, text: "Evaluating CTA effectiveness", delay: 4000 },
  { id: 4, text: "Generating recommendations", delay: 6000 },
];

export default function LoadingState() {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    // Mark first step as completed immediately
    setCompletedSteps([1]);

    steps.forEach((step, index) => {
      if (step.delay > 0) {
        setTimeout(() => {
          setCurrentStep(step.id);
          if (index < steps.length - 1) {
            setCompletedSteps(prev => [...prev, step.id]);
          }
        }, step.delay);
      }
    });
  }, []);

  const getStepIcon = (stepId: number) => {
    if (completedSteps.includes(stepId)) {
      return <Check className="h-4 w-4 text-green-500" />;
    } else if (currentStep === stepId) {
      return <Loader2 className="h-4 w-4 animate-spin text-primary" />;
    } else {
      return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStepTextColor = (stepId: number) => {
    if (completedSteps.includes(stepId)) {
      return "text-green-600";
    } else if (currentStep === stepId) {
      return "text-gray-900";
    } else {
      return "text-gray-500";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 mb-12 max-w-4xl mx-auto">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Analyzing Your Website</h3>
        <p className="text-gray-600 mb-6">Our AI is examining your website's conversion potential...</p>
        
        <div className="max-w-md mx-auto">
          <div className="space-y-3">
            {steps.map((step) => (
              <div key={step.id} className={`flex items-center text-sm ${getStepTextColor(step.id)}`}>
                {getStepIcon(step.id)}
                <span className="ml-2">{step.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}