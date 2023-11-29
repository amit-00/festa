"use client"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import MaxWidthWrapper from "@/components/MaxWidthWrapper"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

 
const formSchema = z.object({
  eventTitle: z.string().min(2).max(50),
})

const page = () => {

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventTitle: "",
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }
  return (
    <>
      <MaxWidthWrapper className="flex justify-around w-full my-4">
        <section className="flex flex-col items-center bg-gray-200 min-h-screen w-full">
          <div className="w-full aspect-square bg-gray-400 rounded-xl"></div>
        </section>
        <section className="flex flex-col bg-gray-100 min-h-screen w-full">
          <div className="px-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="eventTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-2xl">Event Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g Birthday Bash!" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is what your event is called
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Submit</Button>
              </form>
            </Form>
          </div>

        </section>
      </MaxWidthWrapper>
    </>
  )
}

export default page