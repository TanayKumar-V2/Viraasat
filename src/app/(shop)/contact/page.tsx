"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, CheckCircle2, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

const contactSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    message: z.string().min(10, "Message must be at least 10 characters"),
})

type ContactFormData = z.infer<typeof contactSchema>

export default function ContactPage() {
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [serverError, setServerError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema)
    })

    const onSubmit = async (data: ContactFormData) => {
        setServerError(null)
        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })

            const result = await response.json()

            if (!response.ok) {
                throw new Error(result.message || "Something went wrong")
            }

            setIsSubmitted(true)
            reset()
        } catch (err: any) {
            setServerError(err.message)
        }
    }

    return (
        <div className="min-h-screen pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-6">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-20"
                >
                    <h1 className="text-5xl md:text-7xl font-heading mb-6">CONNECT</h1>
                    <p className="text-xl text-foreground/60 max-w-2xl mx-auto">
                        We're here to assist you with any inquiries regarding our collections, 
                        orders, or heritage.
                    </p>
                </motion.div>

                <div className="max-w-xl mx-auto">
                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative bg-white rounded-[2rem] p-8 md:p-12 shadow-2xl shadow-foreground/5 border border-foreground/5 overflow-hidden"
                    >
                        <AnimatePresence mode="wait">
                            {isSubmitted ? (
                                <motion.div 
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex flex-col items-center justify-center text-center py-10 space-y-6"
                                >
                                    <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center">
                                        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                                    </div>
                                    <h3 className="text-3xl font-heading">Message Sent</h3>
                                    <p className="text-foreground/60 max-w-xs mx-auto">
                                        Thank you for reaching out. Our team will review your inquiry 
                                         and get back to you within 24 hours.
                                    </p>
                                    <button 
                                        onClick={() => setIsSubmitted(false)}
                                        className="text-sm font-bold uppercase tracking-widest text-brand-beige hover:text-brand-beige/80 transition-colors"
                                    >
                                        Send another message
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.form 
                                    key="form"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="space-y-8" 
                                    onSubmit={handleSubmit(onSubmit)}
                                >
                                    {serverError && (
                                        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-500 text-sm font-medium">
                                            {serverError}
                                        </div>
                                    )}

                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <label className="text-sm uppercase tracking-[0.2em] font-medium text-foreground/60">Full Name</label>
                                            {errors.name && <span className="text-xs text-red-500 font-medium">{errors.name.message}</span>}
                                        </div>
                                        <input 
                                            {...register("name")}
                                            type="text" 
                                            className={`w-full bg-brand-cream/30 border-none rounded-2xl p-4 text-lg focus:ring-2 transition-all ${errors.name ? 'ring-2 ring-red-500/20' : 'focus:ring-brand-beige'}`}
                                            placeholder="Enter your name"
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <label className="text-sm uppercase tracking-[0.2em] font-medium text-foreground/60">Email Address</label>
                                            {errors.email && <span className="text-xs text-red-500 font-medium">{errors.email.message}</span>}
                                        </div>
                                        <input 
                                            {...register("email")}
                                            type="email" 
                                            className={`w-full bg-brand-cream/30 border-none rounded-2xl p-4 text-lg focus:ring-2 transition-all ${errors.email ? 'ring-2 ring-red-500/20' : 'focus:ring-brand-beige'}`}
                                            placeholder="your@email.com"
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <label className="text-sm uppercase tracking-[0.2em] font-medium text-foreground/60">Message</label>
                                            {errors.message && <span className="text-xs text-red-500 font-medium">{errors.message.message}</span>}
                                        </div>
                                        <textarea 
                                            {...register("message")}
                                            rows={4}
                                            className={`w-full bg-brand-cream/30 border-none rounded-2xl p-4 text-lg focus:ring-2 transition-all resize-none ${errors.message ? 'ring-2 ring-red-500/20' : 'focus:ring-brand-beige'}`}
                                            placeholder="How can we help?"
                                        />
                                    </div>

                                    <button 
                                        disabled={isSubmitting}
                                        className="w-full bg-foreground text-background py-5 rounded-2xl font-medium text-lg flex items-center justify-center gap-3 hover:bg-foreground/90 transition-all group disabled:opacity-70"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                Sending...
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            </>
                                        ) : (
                                            <>
                                                Send Message
                                                <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                            </>
                                        )}
                                    </button>
                                </motion.form>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
