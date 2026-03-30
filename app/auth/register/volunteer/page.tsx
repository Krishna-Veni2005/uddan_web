"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { setDocument, addDocument } from "@/lib/firestore";
import { Volunteer, VolunteerApplication } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, CheckCircle2, ChevronLeft, MapPin, School, Clock, Briefcase } from "lucide-react";
import toast from "react-hot-toast";
import Cookies from "js-cookie";

export default function VolunteerRegistrationWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    email: "", password: "", fullName: "",
    age: "", gender: "", mobile: "", whatsapp: "", state: "", city: "",
    qualificationStatus: "professional", highestQualification: "", bio: "",
    deliveryType: "academic", subjects: "",
    hoursPerWeek: "5", whyVolunteer: "", idUploadedLink: "", emergencyContact: ""
  });

  const updateForm = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  async function handleFinalSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // 1. Create Auth Account
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      const idToken = await user.getIdToken();

      // 2. Draft VolunteerApplication Object
      const applicationPayload: VolunteerApplication = {
        uid: user.uid,
        status: "pending",
        personalInfo: {
          fullName: formData.fullName,
          age: parseInt(formData.age || "18"),
          gender: formData.gender,
          mobile: formData.mobile,
          whatsapp: formData.whatsapp || formData.mobile,
          email: formData.email,
          state: formData.state,
          city: formData.city,
          languages: ["English"],
        },
        qualification: {
          status: formData.qualificationStatus,
          highestQualification: formData.highestQualification,
          bio: formData.bio,
        },
        deliveryType: formData.deliveryType as any,
        academic: {
          subjects: formData.subjects.split(",").map(s => s.trim()),
          grades: ["All Grades"],
          teachingStyle: "Interactive",
        },
        availability: {
          days: ["Weekends"],
          slots: ["Evening"],
          hoursPerWeek: formData.hoursPerWeek,
          mode: "online",
        },
        motivation: {
          whyVolunteer: formData.whyVolunteer,
          volunteeredBefore: false,
          teachingExperience: false,
          studentGains: "Academic confidence",
        },
        verification: {
          idUploaded: formData.idUploadedLink, // MVP: Drive Link / ID String
          emergencyContactName: "Not Provided",
          emergencyContactNumber: formData.emergencyContact,
          emergencyContactRelation: "Family",
        },
        submittedAt: new Date().toISOString(),
      };

      // 3. Save to Applications Collection (Auto-ID)
      const applicationId = await addDocument("volunteerApplications", applicationPayload);

      // 4. Draft Volunteer Base Profile
      const volunteerProfile: Volunteer = {
        uid: user.uid,
        name: formData.fullName,
        email: formData.email,
        role: "volunteer",
        applicationId: applicationId.id,
        createdAt: new Date().toISOString(),
        deliveryType: formData.deliveryType as any,
        subjects: formData.subjects.split(",").map(s => s.trim()),
        skills: [],
        availability: {},
        impactScore: 0,
        sessionsCompleted: 0,
        workshopsHosted: 0,
        studentsAssigned: [],
        status: "inactive", // MUST BE ACTIVE TO TEACH
        approvedAt: "",
      };

      // 5. Save to Volunteers Collection (User-ID)
      await setDocument("volunteers", user.uid, volunteerProfile);

      // Save Cookies
      Cookies.set("edubridge_token", idToken, { expires: 7 });
      Cookies.set("edubridge_role", "volunteer", { expires: 7 });

      toast.success("Application Submitted Successfully! Welcome to the Mentor family.");
      router.push("/dashboard/volunteer");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Apologies, your application failed to submit. Check fields.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center py-12 px-4">
      <div className="max-w-2xl w-full">
        {/* Progress Tracker */}
        <div className="mb-8 relative">
          <div className="absolute inset-y-1/2 left-0 right-0 h-1 bg-slate-200 -z-10 rounded-full"></div>
          <div 
             className="absolute inset-y-1/2 left-0 h-1 bg-primary -z-10 rounded-full transition-all duration-500 ease-in-out"
             style={{ width: `${((step - 1) / 3) * 100}%` }}
          ></div>
          <div className="flex justify-between relative z-10 w-full">
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i} 
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-sm transition-colors duration-300 ${
                  step >= i ? "bg-primary text-white" : "bg-white text-slate-400 border border-slate-200"
                }`}
              >
                {step > i ? <CheckCircle2 className="w-5 h-5 text-white" /> : i}
              </div>
            ))}
          </div>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
              {step === 1 && "Start Your Journey"}
              {step === 2 && "Personal Details"}
              {step === 3 && "Skills & Qualification"}
              {step === 4 && "Final Verification"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Create your volunteer credentials and basic info."}
              {step === 2 && "Where are you located and how can we reach you?"}
              {step === 3 && "Tell us about your background and what you're teaching."}
              {step === 4 && "Logistical availability and safety checks."}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={step === 4 ? handleFinalSubmit : (e) => { e.preventDefault(); handleNext(); }}>
              {/* STAGE 1 */}
              {step === 1 && (
                <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-sm font-medium">Full Name</label>
                       <Input required placeholder="John Doe" value={formData.fullName} onChange={e => updateForm("fullName", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm font-medium">Email Address</label>
                       <Input required type="email" placeholder="john@university.edu" value={formData.email} onChange={e => updateForm("email", e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-sm font-medium">Create Password</label>
                     <Input required type="password" placeholder="At least 6 characters" minLength={6} value={formData.password} onChange={e => updateForm("password", e.target.value)} />
                  </div>
                </div>
              )}

              {/* STAGE 2 */}
              {step === 2 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-sm font-medium">Age</label>
                       <Input required type="number" min="18" placeholder="Must be 18+" value={formData.age} onChange={e => updateForm("age", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm font-medium">Gender</label>
                       <Input required placeholder="Male/Female/Other" value={formData.gender} onChange={e => updateForm("gender", e.target.value)} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 relative">
                       <label className="text-sm font-medium">State</label>
                       <Input required placeholder="E.g., Maharashtra" value={formData.state} onChange={e => updateForm("state", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-sm font-medium">City</label>
                       <Input required placeholder="E.g., Mumbai" value={formData.city} onChange={e => updateForm("city", e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-sm font-medium">Mobile Number</label>
                     <Input required type="tel" minLength={10} placeholder="Active Phone Number" value={formData.mobile} onChange={e => updateForm("mobile", e.target.value)} />
                  </div>
                </div>
              )}

              {/* STAGE 3 */}
              {step === 3 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="p-3 border rounded-lg bg-indigo-50/50 border-indigo-100 flex items-start gap-3">
                    <School className="w-5 h-5 text-indigo-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm text-indigo-900">Academic Background</p>
                      <p className="text-xs text-indigo-700">Tell us what you studied so we can match you perfectly.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                       <label className="text-sm font-medium">Current Status</label>
                       <select 
                         className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
                         value={formData.qualificationStatus}
                         onChange={e => updateForm("qualificationStatus", e.target.value)}
                       >
                         <option value="student">College Student</option>
                         <option value="professional">Working Professional</option>
                         <option value="retired">Retired / Freelancer</option>
                       </select>
                     </div>
                     <div className="space-y-2">
                       <label className="text-sm font-medium">Highest Degree/Course</label>
                       <Input required placeholder="E.g., B.Tech Computer Science" value={formData.highestQualification} onChange={e => updateForm("highestQualification", e.target.value)} />
                     </div>
                  </div>

                  <div className="space-y-2 border-t pt-4">
                     <label className="text-sm font-medium flex items-center gap-1.5"><Briefcase className="w-4 h-4 text-slate-500" /> Teaching Preferences</label>
                     <p className="text-xs text-slate-500 pb-1">Which subjects do you want to teach? (Comma separated)</p>
                     <Input required placeholder="E.g., Math, Physics, English" value={formData.subjects} onChange={e => updateForm("subjects", e.target.value)} />
                  </div>

                  <div className="space-y-2">
                     <label className="text-sm font-medium">Short Bio</label>
                     <Textarea required placeholder="Tell students a little bit about yourself, your hobbies, and why you love teaching." value={formData.bio} onChange={e => updateForm("bio", e.target.value)} />
                  </div>
                </div>
              )}

              {/* STAGE 4 */}
              {step === 4 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="p-3 border rounded-lg bg-orange-50/50 border-orange-100 flex flex-col gap-1">
                     <label className="text-sm font-medium flex items-center gap-1.5 text-orange-800"><Clock className="w-4 h-4" /> Weekly Commitment</label>
                     <p className="text-xs text-orange-700 mb-2">How many hours can you donate per week?</p>
                     <Input required type="number" min="1" max="40" placeholder="E.g., 5" value={formData.hoursPerWeek} onChange={e => updateForm("hoursPerWeek", e.target.value)} />
                  </div>

                  <div className="space-y-2">
                     <label className="text-sm font-medium">Verification document (Google Drive Link or ID No.)</label>
                     <Input required placeholder="College ID or Aadhaar details for safety verification" value={formData.idUploadedLink} onChange={e => updateForm("idUploadedLink", e.target.value)} />
                     <p className="text-xs text-slate-500">Student safety is our top priority. Our admins manually verify all IDs.</p>
                  </div>

                  <div className="space-y-2">
                     <label className="text-sm font-medium">Emergency Contact Number</label>
                     <Input required type="tel" placeholder="Guardian / Close Family" value={formData.emergencyContact} onChange={e => updateForm("emergencyContact", e.target.value)} />
                  </div>

                  <div className="space-y-2">
                     <label className="text-sm font-medium">Motivation (Why EduBridge?)</label>
                     <Textarea required placeholder="What drives you to be a mentor?" value={formData.whyVolunteer} onChange={e => updateForm("whyVolunteer", e.target.value)} />
                  </div>
                </div>
              )}

              {/* FOOTER ACTIONS */}
              <div className="flex items-center justify-between mt-8 pt-4 border-t">
                 {step > 1 ? (
                   <Button type="button" variant="outline" onClick={handleBack} disabled={isSubmitting}>
                     <ChevronLeft className="w-4 h-4 mr-1" /> Back
                   </Button>
                 ) : (
                   <div /> 
                 )}

                 {step < 4 ? (
                   <Button type="submit">
                     Next Step <ArrowRight className="w-4 h-4 ml-1" />
                   </Button>
                 ) : (
                   <Button type="submit" disabled={isSubmitting} className="min-w-[140px]">
                     {isSubmitting ? "Submitting App..." : "Pledge as Mentor"}
                   </Button>
                 )}
              </div>
            </form>
          </CardContent>
          <CardFooter className="justify-center border-t py-4 bg-slate-50 rounded-b-xl">
             <p className="text-sm text-slate-500">
               Already an approved volunteer? <Link href="/auth/login" className="text-primary font-medium hover:underline">Log in</Link>
             </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
