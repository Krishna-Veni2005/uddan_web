"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import toast from "react-hot-toast";
import { auth } from "@/lib/firebase";
import { updateDocument } from "@/lib/firestore";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Sparkles, ArrowRight, Target, BookMarked } from "lucide-react";

/** Standard subjects available for matching */
const SUBJECTS = [
  { id: "math", label: "Mathematics" },
  { id: "science", label: "Science" },
  { id: "english", label: "English" },
  { id: "social", label: "Social Studies" },
  { id: "computer", label: "Computer Science" },
  { id: "languages", label: "Regional Languages" }
];

const onboardingSchema = z.object({
  subjects: z.array(z.string()).min(1, "Please select at least one subject you need help with."),
  curiosities: z.string().min(5, "Tell us a bit more so we can find the perfect match!"),
  learningPace: z.string().refine((val) => ["slow", "medium", "fast"].includes(val), {
    message: "Please select your preferred learning pace.",
  }),
});

type OnboardingValues = z.infer<typeof onboardingSchema>;

export default function StudentOnboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<OnboardingValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      subjects: [],
      curiosities: "",
      learningPace: "medium",
    },
  });

  async function onSubmit(data: OnboardingValues) {
    if (!auth.currentUser) {
      toast.error("Authentication session lost. Please login again.");
      router.push("/auth/login");
      return;
    }

    setIsSubmitting(true);
    try {
      // Split curiosities string into an array of keywords automatically
      const curiositiesArray = data.curiosities
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      const updateData = {
        subjects: data.subjects,
        curiosities: curiositiesArray,
        learningPace: data.learningPace,
        status: "active", // Activate the profile!
      };

      await updateDocument("students", auth.currentUser.uid, updateData);
      
      toast.success("Profile setup complete!");
      // Redirect to the main dashboard
      router.push("/dashboard/student");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Failed to save profile settings.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <div className="max-w-xl w-full">
        {/* Progress indicator */}
        <div className="mb-8 flex items-center justify-center gap-2">
           <div className={`h-2 w-16 rounded-full ${step >= 1 ? "bg-primary" : "bg-slate-200"}`}/>
           <div className={`h-2 w-16 rounded-full ${step >= 2 ? "bg-primary" : "bg-slate-200"}`}/>
        </div>

        <Card className="w-full shadow-lg border-primary/10">
          <CardHeader className="text-center space-y-2 pb-6">
            <div className="mx-auto w-12 h-12 bg-primary/10 flex items-center justify-center rounded-full mb-2">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">
              {step === 1 ? "What do you want to learn?" : "Let's personalize your journey"}
            </CardTitle>
            <CardDescription className="text-base">
              {step === 1 
                ? "Select the subjects you'd like our college mentors to help you with." 
                : "Help us match you with the perfect volunteer tutor! 🚀"
              }
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                {step === 1 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <FormField
                      control={form.control}
                      name="subjects"
                      render={() => (
                        <FormItem>
                          <div className="mb-4">
                            <FormLabel className="text-base">Academic Subjects</FormLabel>
                            <FormDescription>
                              Select multiple if needed.
                            </FormDescription>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            {SUBJECTS.map((subject) => (
                              <FormField
                                key={subject.id}
                                control={form.control}
                                name="subjects"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={subject.id}
                                      className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 hover:bg-slate-50 transition-colors"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(subject.id)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value, subject.id])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) => value !== subject.id
                                                  )
                                                )
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal cursor-pointer w-full">
                                        {subject.label}
                                      </FormLabel>
                                    </FormItem>
                                  )
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                    <FormField
                      control={form.control}
                      name="learningPace"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Preferred Learning Pace</FormLabel>
                          <FormControl>
                            <div className="grid grid-cols-3 gap-3">
                              {["slow", "medium", "fast"].map((pace) => (
                                <label 
                                  key={pace} 
                                  className={`
                                    cursor-pointer border rounded-lg p-3 text-center transition-all
                                    ${field.value === pace ? "border-primary bg-primary/5 text-primary" : "border-slate-200 hover:border-slate-300 text-slate-600"}
                                  `}
                                >
                                  <input 
                                    type="radio" 
                                    className="sr-only"
                                    value={pace}
                                    checked={field.value === pace}
                                    onChange={() => field.onChange(pace)}
                                  />
                                  <span className="capitalize font-medium text-sm">{pace}</span>
                                </label>
                              ))}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="curiosities"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Interests & Hobbies</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Space, Drawing, Web Development, Comics..." {...field} />
                          </FormControl>
                          <FormDescription>
                            We use AI to match you with a college volunteer who shares your interests! Separate with commas.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                <div className="flex justify-between pt-4 pb-2">
                  {step === 2 && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setStep(1)}
                    >
                      Back
                    </Button>
                  )}
                  {step === 1 ? (
                    <Button 
                      type="button" 
                      className={step === 1 ? "w-full" : ""}
                      onClick={async () => {
                        // Trigger validation for step 1
                        const isValid = await form.trigger("subjects");
                        if (isValid) setStep(2);
                      }}
                    >
                      Next Step <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button type="submit" disabled={isSubmitting} className="w-full ml-auto sm:w-auto">
                      {isSubmitting ? "Saving Profile..." : "Complete Setup"} 
                      {!isSubmitting && <Target className="w-4 h-4 ml-2" />}
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
