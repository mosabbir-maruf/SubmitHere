import React, { useState, useEffect, useRef } from "react";
import { Mail, MapPin, Send, Twitter, Instagram, Github } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Please enter a valid email" }),
  phone: z.string().min(1, { message: "Phone number is required" }),
  message: z.string().min(1, { message: "Message is required" }),
});

type FormValues = z.infer<typeof formSchema>;

const CACHE_KEY = "contact-form-cache";

const Index = () => {
  const vantaRef = useRef<HTMLDivElement>(null);
  const [vantaEffect, setVantaEffect] = useState<any>(null);

  const cachedData = typeof window !== "undefined" ? localStorage.getItem(CACHE_KEY) : null;
  const parsedCache = cachedData ? JSON.parse(cachedData) : {};

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: parsedCache.firstName || "",
      lastName: parsedCache.lastName || "",
      email: parsedCache.email || "",
      phone: parsedCache.phone || "",
      message: parsedCache.message || "",
    },
  });

  useEffect(() => {
    const subscription = form.watch((value) => {
      localStorage.setItem(CACHE_KEY, JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [form]);

  useEffect(() => {
    let isScriptLoaded = false;

    const loadVanta = () => {
      if (!vantaRef.current) return;
      if (window.VANTA && !vantaEffect) {
        const effect = window.VANTA.CLOUDS({
          el: vantaRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: true,
          minHeight: 200.0,
          minWidth: 200.0,
          backgroundColor: 0x000000,
          skyColor: 0x000000,
          cloudColor: 0x3a3a3a,
          cloudShadowColor: 0x000000,
          sunColor: 0x8100ff,
          sunGlareColor: 0x4d00ff,
          sunlightColor: 0x3600ff,
          speed: 0.8,
        });
        setVantaEffect(effect);
      }
    };

    const loadScripts = () => {
      if (isScriptLoaded || document.getElementById("vanta-script")) {
        loadVanta();
        return;
      }

      const script1 = document.createElement("script");
      script1.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js";
      script1.async = true;
      script1.onload = () => {
        const script2 = document.createElement("script");
        script2.src = "https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.clouds.min.js";
        script2.async = true;
        script2.id = "vanta-script";
        script2.onload = () => {
          isScriptLoaded = true;
          loadVanta();
        };
        document.body.appendChild(script2);
      };

      document.body.appendChild(script1);
    };

    loadScripts();

    return () => {
      if (vantaEffect) {
        vantaEffect.destroy();
        setVantaEffect(null);
      }
    };
  }, []);

  const submitToFormSubmit = (data: FormValues) => {
    const formEl = document.createElement("form");
    formEl.action = "https://formsubmit.co/thevamp.cloud@gmail.com";
    formEl.method = "POST";
    formEl.style.display = "none";

    const fields = {
      "First Name": data.firstName,
      "Last Name": data.lastName,
      Email: data.email,
      Phone: data.phone,
      Message: data.message,
      _captcha: "false",
    };

    Object.entries(fields).forEach(([name, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      input.value = value;
      formEl.appendChild(input);
    });

    document.body.appendChild(formEl);
    formEl.submit();
    document.body.removeChild(formEl);

    setTimeout(() => {
      window.location.href = "https://submithere.vercel.app/";
    }, 1000);
  };

  const onSubmit = async (data: FormValues) => {
    toast({
      title: "Success!",
      description: "Your Message Received and you will be informed ASAP!",
      duration: 5000,
    });
    submitToFormSubmit(data);
    form.reset();
    localStorage.removeItem(CACHE_KEY);
  };

  return (
    <div
      ref={vantaRef}
      className="h-screen w-full flex flex-col justify-start px-4 relative overflow-hidden bg-black animate__fadeIn"
    >
      <div className="relative z-10 text-center text-white mb-1 animate-fade-in pt-5">
        <h1 className="text-6xl sm:text-7xl font-extrabold mb-1 font-serif tracking-tight animate-slide-up">
          Say Hello!
        </h1>
        <p className="text-xl text-white/70 italic font-light font-sans animate__fadeIn">
          Your Text Matters
        </p>
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto mt-4 sm:mt-8 flex-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden shadow-xl animate-scale-up flex flex-col md:flex-row max-h-[90vh]">
        {/* Form and Contact Info Merged Section */}
        <div className="w-full p-6 sm:p-8 overflow-y-auto flex flex-col md:flex-row gap-6">
          {/* Form Section */}
          <div className="w-full md:w-2/3">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pb-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <FormField control={form.control} name="firstName" render={({ field }) => (
                    <FormItem>
                      <label className="text-white mb-2 block">First Name</label>
                      <FormControl>
                        <Input {...field} placeholder="John" className="min-w-0 bg-black border border-white/20 text-white placeholder:text-white/40" />
                      </FormControl>
                      <FormMessage className="text-pink-400" />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="lastName" render={({ field }) => (
                    <FormItem>
                      <label className="text-white mb-2 block">Last Name</label>
                      <FormControl>
                        <Input {...field} placeholder="Doe" className="min-w-0 bg-black border border-white/20 text-white placeholder:text-white/40" />
                      </FormControl>
                      <FormMessage className="text-pink-400" />
                    </FormItem>
                  )} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                      <label className="text-white mb-2 block">Email</label>
                      <FormControl>
                        <Input {...field} placeholder="example@email.com" className="min-w-0 bg-black border border-white/20 text-white placeholder:text-white/40" />
                      </FormControl>
                      <FormMessage className="text-pink-400" />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem>
                      <label className="text-white mb-2 block">Phone Number</label>
                      <FormControl>
                        <Input {...field} placeholder="+1234567890" className="min-w-0 bg-black border border-white/20 text-white placeholder:text-white/40" />
                      </FormControl>
                      <FormMessage className="text-pink-400" />
                    </FormItem>
                  )} />
                </div>

                <FormField control={form.control} name="message" render={({ field }) => (
                  <FormItem>
                    <label className="text-white mb-2 block">Write your message</label>
                    <FormControl>
                      <Textarea {...field} placeholder="You can paste your link here too..." className="bg-black border border-white/20 text-white placeholder:text-white/40 resize-none min-h-[80px]" />
                    </FormControl>
                    <FormMessage className="text-pink-400" />
                  </FormItem>
                )} />

                <div className="flex justify-end pt-6">
                  <Button type="submit" className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-md flex items-center gap-2 w-full sm:w-auto animate__scaleUp hover:animate-scale-up">
                    Send Message
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </Form>
          </div>

          {/* Contact Info Section */}
          <div className="w-full md:w-1/3 bg-gray-900/50 p-6 md:p-8 relative min-h-[200px] sm:min-h-[400px] flex flex-col justify-center items-center rounded-3xl animate__fadeIn">
            <h2 className="text-3xl font-bold mb-6 text-white font-custom">Contact Us</h2>
            <div className="space-y-4 font-roboto"> {/* Apply roboto font for email and location */}
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-white" />
                <span className="text-white/80">example@email.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-white" />
                <span className="text-white/80">Savar, Dhaka</span>
              </div>
            </div>
            {/* Centered Social Media Icons */}
            <div className="flex justify-center gap-4 mt-4">
              <a href="https://twitter.com/IAmMRF07" className="text-[#1DA1F2] hover:opacity-80 transition-opacity" target="_blank" rel="noopener noreferrer">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="https://www.instagram.com/mosabbir_maruf/" className="text-[#E1306C] hover:opacity-80 transition-opacity" target="_blank" rel="noopener noreferrer">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="https://github.com/mosabbir-maruf" className="text-white hover:opacity-80 transition-opacity" target="_blank" rel="noopener noreferrer">
                <Github className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Background Bubbles */}
      <div className="absolute top-20 left-20 w-60 h-60 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-20 blur-3xl bg-parallax"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-gradient-to-r from-blue-400 to-teal-300 opacity-20 blur-3xl bg-parallax"></div>
      <div className="absolute bottom-40 left-40 w-40 h-40 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-20 blur-3xl bg-parallax"></div>
      <div className="absolute top-40 right-40 w-60 h-60 rounded-full bg-gradient-to-r from-teal-400 to-blue-400 opacity-20 blur-3xl bg-parallax"></div>
    </div>
  );
};

export default Index;
