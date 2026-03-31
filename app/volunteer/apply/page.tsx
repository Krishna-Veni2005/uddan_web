"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { setDocument, addDocument } from "@/lib/firestore";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { CheckCircle2, ChevronLeft, ChevronRight, Loader2, BookOpen } from "lucide-react";

// --- VALIDATION SCHEMAS PER STEP ---
const step1Schema = z.object({
  fullName: z.string().min(2, "Name is required"),
  age: z.coerce.number().min(16).max(70),
  gender: z.enum(["Male", "Female", "Other"]),
  mobile: z.string().regex(/^[0-9]{10}$/, "10 digit mobile number"),
  whatsappSameAsMobile: z.boolean().default(false),
  whatsapp: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(6),
  state: z.string().min(2),
  city: z.string().min(2),
  languages: z.array(z.string()).min(1, "Select at least one language")
}).superRefine((val, ctx) => {
  if (!val.whatsappSameAsMobile && (!val.whatsapp || !/^[0-9]{10}$/.test(val.whatsapp))) {
    ctx.addIssue({ path: ["whatsapp"], code: z.ZodIssueCode.custom, message: "Valid 10 digit WhatsApp required" });
  }
});

const step2Schema = z.object({
  currentStatus: z.enum(["Studying", "Working", "Other"]),
  institutionName: z.string().optional(),
  courseStream: z.string().optional(),
  yearSem: z.string().optional(),
  profession: z.string().optional(),
  organizationName: z.string().optional(),
  highestQualification: z.enum(["10th", "Intermediate", "UG", "PG", "Other"]),
  bio: z.string().max(300).min(10)
}).superRefine((val, ctx) => {
  if (val.currentStatus === "Studying" && !val.institutionName) {
    ctx.addIssue({ path: ["institutionName"], code: z.ZodIssueCode.custom, message: "Required for students" });
  }
  if (val.currentStatus === "Working" && !val.profession) {
    ctx.addIssue({ path: ["profession"], code: z.ZodIssueCode.custom, message: "Required for professionals" });
  }
});

const step3Schema = z.object({
  priority: z.enum(["Academic Support", "Skill Workshops", "Both", "One-time Workshop"]),
  subjects: z.array(z.string()).optional(),
  grades: z.array(z.string()).optional(),
  teachingStyle: z.string().optional(),
  skills: z.array(z.string()).optional(),
  format: z.string().optional(),
  sessionDuration: z.string().optional(),
  oneTimeTopic: z.string().optional(),
  proposedDate: z.string().optional(),
});

const step4Schema = z.object({
  days: z.array(z.string()).min(1, "Select at least one day"),
  slots: z.array(z.string()).min(1, "Select at least one time slot"),
  hoursPerWeek: z.enum(["1-2hrs", "3-5hrs", "5+hrs"]),
  mode: z.enum(["Online", "In-person", "Both"]),
  locality: z.string().optional(),
}).superRefine((val, ctx) => {
  if ((val.mode === "In-person" || val.mode === "Both") && !val.locality) {
    ctx.addIssue({ path: ["locality"], code: z.ZodIssueCode.custom, message: "Locality required for in-person" });
  }
});

const step5Schema = z.object({
  whyVolunteer: z.string().min(50, "Minimum 50 characters"),
  volunteeredBefore: z.enum(["Yes", "No"]),
  volunteerDetails: z.string().optional(),
  teachingExperience: z.enum(["Yes", "No"]),
  teachingDetails: z.string().optional(),
  studentGains: z.string().min(10, "Required"),
}).superRefine((val, ctx) => {
  if (val.volunteeredBefore === "Yes" && !val.volunteerDetails) {
    ctx.addIssue({ path: ["volunteerDetails"], code: z.ZodIssueCode.custom, message: "Please provide details" });
  }
  if (val.teachingExperience === "Yes" && !val.teachingDetails) {
    ctx.addIssue({ path: ["teachingDetails"], code: z.ZodIssueCode.custom, message: "Please provide details" });
  }
});

const step6Schema = z.object({
  idProof: z.string().min(5, "Link or text required"),
  linkedinUrl: z.string().optional(),
  githubUrl: z.string().optional(),
  emergencyName: z.string().min(2),
  emergencyNumber: z.string().regex(/^[0-9]{10}$/, "10 digit mobile number"),
  emergencyRelation: z.string().min(2),
  agreeCodeOfConduct: z.boolean().refine(val => val === true, "Must agree"),
  confirmAccurate: z.boolean().refine(val => val === true, "Must confirm"),
});

const formSchema = z.object({
  step1: step1Schema,
  step2: step2Schema,
  step3: step3Schema,
  step4: step4Schema,
  step5: step5Schema,
  step6: step6Schema,
});
type FormValues = z.infer<typeof formSchema>;

const LANGUAGES = ["Telugu", "Hindi", "English", "Tamil", "Kannada", "Other"];
const SUBJECTS = ["Math", "Science", "English", "Social", "Telugu", "Hindi", "Computer", "Other"];
const GRADES = ["Grade 1-5", "Grade 6-8", "Grade 9-10", "Intermediate"];
const SKILLS = ["Coding", "Web Dev", "App Dev", "Design", "Public Speaking", "Financial Literacy", "Music", "Art", "Robotics", "Career Guidance"];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const SLOTS = ["Morning 8am-12pm", "Afternoon 12pm-4pm", "Evening 4pm-7pm", "Night 7pm-9pm"];

// Chip Component for multi-select
function ChipSelect({ options, selected, onChange }: { options: string[], selected: string[], onChange: (val: string[]) => void }) {
  const toggle = (opt: string) => {
    if (selected.includes(opt)) onChange(selected.filter(o => o !== opt));
    else onChange([...selected, opt]);
  };
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {options.map(opt => (
        <button
          key={opt}
          type="button"
          onClick={() => toggle(opt)}
          className={`px-3 py-1.5 text-sm rounded-full border transition-all ${
            selected.includes(opt) ? "bg-primary text-white border-primary" : "bg-white text-slate-600 border-slate-200 hover:border-primary/50"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

export default function VolunteerApplyPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      step1: { gender: "Male", languages: [] },
      step2: { currentStatus: "Studying", highestQualification: "UG" },
      step3: { priority: "Academic Support", subjects: [], grades: [], skills: [] },
      step4: { days: [], slots: [], hoursPerWeek: "3-5hrs", mode: "Online" },
      step5: { volunteeredBefore: "No", teachingExperience: "No" },
      step6: { agreeCodeOfConduct: undefined, confirmAccurate: undefined }
    } as any
  });

  const { register, trigger, watch, formState: { errors }, handleSubmit, setValue } = methods;

  const handleNext = async () => {
    let isValid = false;
    if (step === 1) isValid = await trigger("step1");
    if (step === 2) isValid = await trigger("step2");
    if (step === 3) isValid = await trigger("step3");
    if (step === 4) isValid = await trigger("step4");
    if (step === 5) isValid = await trigger("step5");

    if (isValid) {
      setStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      toast.error("Please fill all required fields correctly.");
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const { step1, step2, step3, step4, step5, step6 } = data;

      // 1. Core Auth
      const userCred = await createUserWithEmailAndPassword(auth, step1.email, step1.password);
      const user = userCred.user;
      const idToken = await user.getIdToken();

      // 2. Draft Applications JSON
      const appPayload = {
        uid: user.uid,
        status: "pending",
        personalInfo: { ...step1 },
        qualification: { ...step2 },
        deliveryType: step3.priority,
        academic: { subjects: step3.subjects, grades: step3.grades, teachingStyle: step3.teachingStyle },
        skills: { skills: step3.skills, format: step3.format, duration: step3.sessionDuration },
        availability: { ...step4 },
        motivation: { ...step5 },
        verification: { ...step6 },
        submittedAt: new Date().toISOString(),
      };
      // Clean undefined values which cause Firestore to crash
      const cleanAppPayload = JSON.parse(JSON.stringify(appPayload));
      const applicationId = await addDocument("volunteer_applications", cleanAppPayload);

      // 3. Draft Volunteer Account
      const volProfile = {
        uid: user.uid,
        name: step1.fullName,
        email: step1.email,
        role: "volunteer",
        applicationId: applicationId.id,
        deliveryType: step3.priority,
        subjects: step3.subjects || [],
        skills: step3.skills || [],
        availability: step4,
        impactScore: 0,
        sessionsCompleted: 0,
        workshopsHosted: 0,
        studentsAssigned: [],
        status: "pending",
        approvedAt: "",
      };
      
      const cleanVolProfile = JSON.parse(JSON.stringify(volProfile));
      await setDocument("users", user.uid, cleanVolProfile);

      // 4. Client State
      Cookies.set("edubridge_user_role", "volunteer", { expires: 7 });
      
      router.push("/dashboard/volunteer");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to submit application.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onError = (errors: any) => {
    console.log("Validation Errors:", errors);
    const stepErrors = Object.keys(errors).map(s => s.replace("step", "Step ")).join(", ");
    toast.error(`Validation failed in: ${stepErrors}. Please go back and check.`, { duration: 5000 });
  };

  // Step conditional renders
  const w = watch();

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 selection:bg-primary/20">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-center mb-8 gap-2 items-center text-primary font-bold text-2xl">
          <BookOpen className="w-8 h-8" /> EduBridge Mentorship
        </div>

        {/* Progress Bar */}
        <div className="mb-8 max-w-lg mx-auto relative hidden sm:block">
          <div className="absolute inset-y-1/2 left-0 right-0 h-1 bg-slate-200 -z-10 rounded-full"></div>
          <div className="absolute inset-y-1/2 left-0 h-1 bg-primary -z-10 rounded-full transition-all duration-300" style={{ width: `${((step - 1) / 5) * 100}%` }}></div>
          <div className="flex justify-between relative z-10 w-full">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-sm transition-colors ${step >= i ? "bg-primary text-white" : "bg-white text-slate-400 border border-slate-200"}`}>
                {step > i ? <CheckCircle2 className="w-5 h-5 text-white" /> : i}
              </div>
            ))}
          </div>
        </div>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit, onError)}>
            <Card className="shadow-lg border-0 ring-1 ring-slate-200 overflow-visible">
              <CardHeader className="bg-white border-b border-slate-100 rounded-t-xl pb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 text-primary w-10 h-10 rounded-lg flex items-center justify-center font-bold">{step}/6</div>
                  <div>
                    <CardTitle className="text-xl">
                      {step === 1 && "Personal Information"}
                      {step === 2 && "Background & Qualification"}
                      {step === 3 && "What You Want to Deliver"}
                      {step === 4 && "Availability"}
                      {step === 5 && "Motivation & Experience"}
                      {step === 6 && "Verification & Submit"}
                    </CardTitle>
                    <CardDescription className="text-sm mt-1">
                      {step === 1 && "Basic details to create your volunteer profile."}
                      {step === 2 && "Your educational or professional status."}
                      {step === 3 && "Tell us your expertise and preferred format."}
                      {step === 4 && "When can you donate your time?"}
                      {step === 5 && "Help us understand your teaching background."}
                      {step === 6 && "Identity checks for student safety."}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6 bg-slate-50/50">
                {/* --- CHUNKS OF STEPS --- */}
                
                {/* STEP 1 */}
                <div className={step === 1 ? "block space-y-4" : "hidden"}>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Full Name</Label>
                      <Input {...register("step1.fullName")} />
                      {errors.step1?.fullName && <p className="text-red-500 text-xs mt-1">{errors.step1.fullName.message}</p>}
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input type="email" {...register("step1.email")} />
                      {errors.step1?.email && <p className="text-red-500 text-xs mt-1">{errors.step1.email.message}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Age</Label>
                      <Input type="number" {...register("step1.age")} />
                      {errors.step1?.age && <p className="text-red-500 text-xs mt-1">{errors.step1.age.message}</p>}
                    </div>
                    <div>
                      <Label>Gender</Label>
                      <RadioGroup defaultValue="Male" onValueChange={v => setValue("step1.gender", v as any)} className="flex gap-4 mt-2">
                        <div className="flex items-center gap-2"><RadioGroupItem value="Male" id="m"/><Label htmlFor="m">Male</Label></div>
                        <div className="flex items-center gap-2"><RadioGroupItem value="Female" id="f"/><Label htmlFor="f">Female</Label></div>
                        <div className="flex items-center gap-2"><RadioGroupItem value="Other" id="o"/><Label htmlFor="o">Other</Label></div>
                      </RadioGroup>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Mobile (+91)</Label>
                      <Input type="tel" {...register("step1.mobile")} />
                      {errors.step1?.mobile && <p className="text-red-500 text-xs mt-1">{errors.step1.mobile.message}</p>}
                    </div>
                    <div>
                      <Label>Password</Label>
                      <Input type="password" {...register("step1.password")} />
                      {errors.step1?.password && <p className="text-red-500 text-xs mt-1">{errors.step1.password.message}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="wa" checked={w.step1?.whatsappSameAsMobile || false} onCheckedChange={(val) => setValue("step1.whatsappSameAsMobile", val as boolean)} />
                    <Label htmlFor="wa">WhatsApp is same as mobile</Label>
                  </div>
                  {!w.step1?.whatsappSameAsMobile && (
                    <div>
                      <Label>WhatsApp Number</Label>
                      <Input type="tel" {...register("step1.whatsapp")} />
                      {errors.step1?.whatsapp && <p className="text-red-500 text-xs mt-1">{errors.step1.whatsapp.message}</p>}
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>State</Label>
                      <Input {...register("step1.state")} />
                    </div>
                    <div>
                      <Label>City</Label>
                      <Input {...register("step1.city")} />
                    </div>
                  </div>
                  <div>
                    <Label>Preferred Languages</Label>
                    <ChipSelect
                      options={LANGUAGES}
                      selected={w.step1?.languages || []}
                      onChange={(arr) => setValue("step1.languages", arr)}
                    />
                    {errors.step1?.languages && <p className="text-red-500 text-xs mt-1">{errors.step1.languages.message}</p>}
                  </div>
                </div>

                {/* STEP 2 */}
                <div className={step === 2 ? "block space-y-4" : "hidden"}>
                  <div>
                    <Label>Current Status</Label>
                    <RadioGroup defaultValue="Studying" onValueChange={v => setValue("step2.currentStatus", v as any)} className="flex gap-6 mt-2">
                      <div className="flex gap-2"><RadioGroupItem value="Studying" id="st"/><Label htmlFor="st">Studying</Label></div>
                      <div className="flex gap-2"><RadioGroupItem value="Working" id="wk"/><Label htmlFor="wk">Working</Label></div>
                      <div className="flex gap-2"><RadioGroupItem value="Other" id="ot"/><Label htmlFor="ot">Other</Label></div>
                    </RadioGroup>
                  </div>
                  {w.step2?.currentStatus === "Studying" && (
                     <div className="grid grid-cols-3 gap-4 bg-white p-4 rounded-xl border border-slate-200">
                        <div>
                          <Label>Institution</Label>
                          <Input {...register("step2.institutionName")} />
                          {errors.step2?.institutionName && <p className="text-red-500 text-xs mt-1">{errors.step2.institutionName.message}</p>}
                        </div>
                        <div>
                          <Label>Course/Stream</Label>
                          <Input {...register("step2.courseStream")} />
                        </div>
                        <div>
                          <Label>Year/Semester</Label>
                          <Input {...register("step2.yearSem")} />
                        </div>
                     </div>
                  )}
                  {w.step2?.currentStatus === "Working" && (
                    <div className="grid grid-cols-2 gap-4 bg-white p-4 rounded-xl border border-slate-200">
                      <div>
                        <Label>Profession</Label>
                        <Input {...register("step2.profession")} />
                      </div>
                      <div>
                        <Label>Organization (Optional)</Label>
                        <Input {...register("step2.organizationName")} />
                      </div>
                    </div>
                  )}
                  <div>
                    <Label>Highest Qualification</Label>
                     <select className="flex h-10 w-full rounded-md border border-input bg-white px-3 mt-1" {...register("step2.highestQualification")}>
                        <option value="10th">10th</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="UG">Undergraduate</option>
                        <option value="PG">Postgraduate</option>
                        <option value="Other">Other</option>
                     </select>
                  </div>
                  <div>
                    <Label>Brief Bio (Visible to students)</Label>
                    <Textarea className="mt-1" placeholder="Max 300 chars..." {...register("step2.bio")} />
                    {errors.step2?.bio && <p className="text-red-500 text-xs mt-1">{errors.step2.bio.message}</p>}
                  </div>
                </div>

                {/* STEP 3 */}
                <div className={step === 3 ? "block space-y-6" : "hidden"}>
                  <div>
                     <Label className="text-base text-slate-800">What do you want to deliver?</Label>
                     <RadioGroup defaultValue="Academic Support" onValueChange={v => setValue("step3.priority", v as any)} className="grid grid-cols-2 gap-4 mt-3">
                        {["Academic Support", "Skill Workshops", "Both", "One-time Workshop"].map(opt => (
                           <div key={opt} className={`flex items-start gap-3 p-4 border rounded-xl transition-colors cursor-pointer ${w.step3?.priority === opt ? "bg-primary/5 border-primary shadow-sm" : "bg-white hover:border-slate-300"}`} onClick={() => setValue("step3.priority", opt as any)}>
                             <RadioGroupItem value={opt} id={opt} className="mt-1" />
                             <div>
                               <Label htmlFor={opt} className="font-semibold cursor-pointer">{opt}</Label>
                             </div>
                           </div>
                        ))}
                     </RadioGroup>
                  </div>

                  {(w.step3?.priority === "Academic Support" || w.step3?.priority === "Both") && (
                    <div className="space-y-4 p-4 bg-white border border-slate-200 rounded-xl">
                      <h4 className="font-semibold text-primary">Academic Options</h4>
                      <div>
                         <Label>Subjects Taught</Label>
                         <ChipSelect options={SUBJECTS} selected={w.step3?.subjects || []} onChange={arr => setValue("step3.subjects", arr)} />
                      </div>
                      <div>
                         <Label>Preferred Grades</Label>
                         <ChipSelect options={GRADES} selected={w.step3?.grades || []} onChange={arr => setValue("step3.grades", arr)} />
                      </div>
                      <div>
                         <Label>Teaching Style</Label>
                         <RadioGroup defaultValue="1-on-1" onValueChange={v => setValue("step3.teachingStyle", v)} className="flex gap-4 mt-2">
                           {["1-on-1", "Small Group", "Both"].map(r => (
                             <div key={r} className="flex gap-2"><RadioGroupItem value={r} id={`a_${r}`}/><Label htmlFor={`a_${r}`}>{r}</Label></div>
                           ))}
                         </RadioGroup>
                      </div>
                    </div>
                  )}

                  {(w.step3?.priority === "Skill Workshops" || w.step3?.priority === "Both") && (
                    <div className="space-y-4 p-4 bg-white border border-slate-200 rounded-xl">
                      <h4 className="font-semibold text-accent">Workshop Options</h4>
                      <div>
                         <Label>Skills</Label>
                         <ChipSelect options={SKILLS} selected={w.step3?.skills || []} onChange={arr => setValue("step3.skills", arr)} />
                      </div>
                      <div className="grid grid-cols-2">
                        <div>
                         <Label>Format</Label>
                         <RadioGroup defaultValue="Group" onValueChange={v => setValue("step3.format", v)} className="flex gap-4 mt-2">
                           <div className="flex gap-2"><RadioGroupItem value="Group" id="wg"/><Label htmlFor="wg">Group</Label></div>
                           <div className="flex gap-2"><RadioGroupItem value="1-on-1" id="w1"/><Label htmlFor="w1">1-on-1</Label></div>
                         </RadioGroup>
                        </div>
                        <div>
                         <Label>Duration</Label>
                         <RadioGroup defaultValue="1hr" onValueChange={v => setValue("step3.sessionDuration", v)} className="flex flex-wrap gap-4 mt-2">
                           {["30min", "45min", "1hr", "Flexible"].map(r => (
                             <div key={r} className="flex gap-2"><RadioGroupItem value={r} id={`d_${r}`}/><Label htmlFor={`d_${r}`}>{r}</Label></div>
                           ))}
                         </RadioGroup>
                        </div>
                      </div>
                    </div>
                  )}

                  {w.step3?.priority === "One-time Workshop" && (
                    <div className="space-y-4 p-4 bg-white border border-slate-200 rounded-xl">
                       <h4 className="font-semibold text-amber-600">One-time Event Details</h4>
                       <div>
                         <Label>What will the session be about?</Label>
                         <Textarea className="mt-1" {...register("step3.oneTimeTopic")} />
                       </div>
                       <div>
                         <Label>Proposed Date & Time</Label>
                         <Input type="datetime-local" className="mt-1 w-full sm:w-auto" {...register("step3.proposedDate")} />
                       </div>
                    </div>
                  )}
                </div>

                {/* STEP 4 */}
                <div className={step === 4 ? "block space-y-6" : "hidden"}>
                   <div>
                      <Label>Available Days</Label>
                      <ChipSelect options={DAYS} selected={w.step4?.days || []} onChange={arr => setValue("step4.days", arr)} />
                      {errors.step4?.days && <p className="text-red-500 text-xs mt-1">{errors.step4.days.message}</p>}
                   </div>
                   <div>
                      <Label>Time Slots</Label>
                      <ChipSelect options={SLOTS} selected={w.step4?.slots || []} onChange={arr => setValue("step4.slots", arr)} />
                      {errors.step4?.slots && <p className="text-red-500 text-xs mt-1">{errors.step4.slots.message}</p>}
                   </div>
                   <div>
                      <Label>Hours per week</Label>
                      <RadioGroup defaultValue="3-5hrs" onValueChange={v => setValue("step4.hoursPerWeek", v as any)} className="flex gap-6 mt-2">
                        {["1-2hrs", "3-5hrs", "5+hrs"].map(r => (
                           <div key={r} className="flex gap-2"><RadioGroupItem value={r} id={`h_${r}`}/><Label htmlFor={`h_${r}`}>{r}</Label></div>
                        ))}
                      </RadioGroup>
                   </div>
                   <div className="p-4 bg-white border border-slate-200 rounded-xl">
                      <Label>Meeting Mode</Label>
                      <RadioGroup defaultValue="Online" onValueChange={v => setValue("step4.mode", v as any)} className="flex gap-6 mt-2 mb-4">
                        {["Online", "In-person", "Both"].map(r => (
                           <div key={r} className="flex gap-2"><RadioGroupItem value={r} id={`m_${r}`}/><Label htmlFor={`m_${r}`}>{r}</Label></div>
                        ))}
                      </RadioGroup>
                      {(w.step4?.mode === "In-person" || w.step4?.mode === "Both") && (
                        <div>
                          <Label>Area/Locality (for offline teaching)</Label>
                          <Input className="mt-1" {...register("step4.locality")} />
                          {errors.step4?.locality && <p className="text-red-500 text-xs mt-1">{errors.step4.locality.message}</p>}
                        </div>
                      )}
                   </div>
                </div>

                {/* STEP 5 */}
                <div className={step === 5 ? "block space-y-4" : "hidden"}>
                  <div>
                    <Label>Why volunteer with us?</Label>
                    <Textarea className="mt-1" minLength={50} {...register("step5.whyVolunteer")} />
                    {errors.step5?.whyVolunteer && <p className="text-red-500 text-xs mt-1">{errors.step5.whyVolunteer.message}</p>}
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                     <div className="space-y-3 p-4 bg-white border border-slate-200 rounded-xl">
                       <Label>Volunteered before?</Label>
                       <RadioGroup defaultValue="No" onValueChange={v => setValue("step5.volunteeredBefore", v as any)} className="flex gap-4">
                         <div className="flex gap-2"><RadioGroupItem value="Yes" id="v_y"/><Label htmlFor="v_y">Yes</Label></div>
                         <div className="flex gap-2"><RadioGroupItem value="No" id="v_n"/><Label htmlFor="v_n">No</Label></div>
                       </RadioGroup>
                       {w.step5?.volunteeredBefore === "Yes" && (
                         <div className="mt-2 text-sm"><Label>Details</Label><Textarea className="mt-1 text-sm" {...register("step5.volunteerDetails")} /></div>
                       )}
                     </div>
                     <div className="space-y-3 p-4 bg-white border border-slate-200 rounded-xl">
                       <Label>Prior teaching experience?</Label>
                       <RadioGroup defaultValue="No" onValueChange={v => setValue("step5.teachingExperience", v as any)} className="flex gap-4">
                         <div className="flex gap-2"><RadioGroupItem value="Yes" id="t_y"/><Label htmlFor="t_y">Yes</Label></div>
                         <div className="flex gap-2"><RadioGroupItem value="No" id="t_n"/><Label htmlFor="t_n">No</Label></div>
                       </RadioGroup>
                       {w.step5?.teachingExperience === "Yes" && (
                         <div className="mt-2 text-sm"><Label>Description</Label><Textarea className="mt-1 text-sm" {...register("step5.teachingDetails")} /></div>
                       )}
                     </div>
                  </div>
                  <div>
                    <Label>What should students gain from your sessions?</Label>
                    <Textarea className="mt-1" {...register("step5.studentGains")} />
                  </div>
                </div>

                {/* STEP 6 */}
                <div className={step === 6 ? "block space-y-4" : "hidden"}>
                  <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 space-y-4">
                     <div>
                       <Label className="text-amber-900">Upload ID proof (College ID/Work ID/Aadhaar)</Label>
                       <p className="text-xs text-amber-700/70 mb-2">Since we operate on the web for MVP, please provide a secure drive link or text description of your ID details.</p>
                       <Input className="bg-white border-amber-200 focus-visible:ring-amber-400" {...register("step6.idProof")} />
                       {errors.step6?.idProof && <p className="text-red-500 text-xs mt-1">{errors.step6.idProof.message}</p>}
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>LinkedIn URL (Optional)</Label>
                      <Input {...register("step6.linkedinUrl")} />
                    </div>
                    <div>
                      <Label>GitHub / Portfolio (Optional)</Label>
                      <Input {...register("step6.githubUrl")} />
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-xl p-4 space-y-3 bg-white mt-4">
                     <Label className="uppercase text-xs text-slate-500 font-bold tracking-wide">Emergency Contact</Label>
                     <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <Label>Name</Label>
                          <Input {...register("step6.emergencyName")} />
                          {errors.step6?.emergencyName && <p className="text-red-500 text-xs mt-1">{errors.step6.emergencyName.message}</p>}
                        </div>
                        <div>
                          <Label>Number</Label>
                          <Input {...register("step6.emergencyNumber")} />
                          {errors.step6?.emergencyNumber && <p className="text-red-500 text-xs mt-1">{errors.step6.emergencyNumber.message}</p>}
                        </div>
                        <div>
                          <Label>Relationship</Label>
                          <Input {...register("step6.emergencyRelation")} />
                          {errors.step6?.emergencyRelation && <p className="text-red-500 text-xs mt-1">{errors.step6.emergencyRelation.message}</p>}
                        </div>
                     </div>
                  </div>

                  <div className="space-y-3 pt-6">
                    <div className="flex items-start gap-3">
                      <Checkbox id="c1" checked={w.step6?.agreeCodeOfConduct || false} onCheckedChange={v => setValue("step6.agreeCodeOfConduct", v as true)} />
                      <div className="text-sm">
                        <Label htmlFor="c1" className="font-semibold text-slate-800">I agree to the EduBridge Code of Conduct.</Label>
                        <p className="text-slate-500 mt-0.5">I will respect student privacy and ensure a secure, engaging environment.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Checkbox id="c2" checked={w.step6?.confirmAccurate || false} onCheckedChange={v => setValue("step6.confirmAccurate", v as true)} />
                      <div className="text-sm">
                        <Label htmlFor="c2" className="font-semibold text-slate-800">I confirm the details above are accurate.</Label>
                      </div>
                    </div>
                  </div>
                </div>

              </CardContent>
              <CardFooter className="bg-white border-t border-slate-100 rounded-b-xl px-6 py-4 flex justify-between">
                 {step > 1 ? (
                   <Button type="button" variant="outline" onClick={() => { setStep(s => s - 1); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
                     <ChevronLeft className="w-4 h-4 mr-1" /> Back
                   </Button>
                 ) : (
                   <div />
                 )}
                 
                 {step < 6 ? (
                   <Button type="button" onClick={handleNext}>
                     Next Step <ChevronRight className="w-4 h-4 ml-1" />
                   </Button>
                 ) : (
                   <Button type="submit" className="bg-primary shadow-lg shadow-primary/30 min-w-40" disabled={isSubmitting || !w.step6?.agreeCodeOfConduct || !w.step6?.confirmAccurate}>
                     {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</> : "Submit Application"}
                   </Button>
                 )}
              </CardFooter>
            </Card>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
