"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"] as const
type BloodGroup = typeof bloodGroups[number]

interface FormData {
  firstName: string
  lastName: string
  bloodGroup: BloodGroup
  dateOfBirth: Date | undefined
}

export default function QuizPage() {
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const form = useForm<FormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      bloodGroup: "" as BloodGroup,
      dateOfBirth: undefined
    },
    mode: "onChange",
  })

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true)
      
      if (!data.dateOfBirth || isNaN(data.dateOfBirth.getTime())) {
        toast({
          title: "Invalid date",
          description: "Please select a valid date of birth",
          variant: "destructive",
        })
        return
      }

      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log("Form submitted:", data)
      
      toast({
        title: "Success!",
        description: "Your information has been submitted successfully.",
      })
      
      form.reset({
        firstName: "",
        lastName: "",
        bloodGroup: "A+",
        dateOfBirth: undefined
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem submitting your information.",
        variant: "destructive",
      })
      console.error("Submission error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container max-w-2xl mx-auto p-8">
      <div className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    rules={{ 
                      required: "First name is required",
                      minLength: { value: 2, message: "Must be at least 2 characters" },
                      pattern: { value: /^[A-Za-z\s-]+$/, message: "Invalid characters" }
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    rules={{ 
                      required: "Last name is required",
                      minLength: { value: 2, message: "Must be at least 2 characters" },
                      pattern: { value: /^[A-Za-z\s-]+$/, message: "Invalid characters" }
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="bloodGroup"
                    rules={{ required: "Blood group is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Blood Group</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select blood group" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {bloodGroups.map((group) => (
                              <SelectItem key={group} value={group}>{group}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    rules={{ 
                      required: "Date of birth is required",
                      validate: (value) => {
                        if (!value) return "Date is required"
                        const date = new Date(value)
                        if (isNaN(date.getTime())) return "Invalid date"
                        const minDate = new Date("1900-01-01")
                        const today = new Date()
                        if (date < minDate || date > today) return "Date must be between 1900 and today"
                        return true
                      }
                    }}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            value={field.value ? format(field.value, "yyyy-MM-dd") : ""}
                            onChange={(e) => {
                              const date = e.target.value ? new Date(e.target.value) : null
                              field.onChange(date)
                            }}
                            max={format(new Date(), "yyyy-MM-dd")}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end">
                  <Button 
                    type="submit"
                    disabled={!form.formState.isValid || isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  )
}