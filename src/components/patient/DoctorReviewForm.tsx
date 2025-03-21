
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Star, Send } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ButtonCustom } from "@/components/ui/button-custom";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const reviewSchema = z.object({
  rating: z.number().min(1, "Please select a rating").max(5),
  comment: z.string().min(5, "Please provide a comment with at least 5 characters"),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface DoctorReviewFormProps {
  doctorId: string;
  doctorName: string;
  onReviewSubmitted?: (review: ReviewFormValues) => void;
}

const DoctorReviewForm = ({ doctorId, doctorName, onReviewSubmitted }: DoctorReviewFormProps) => {
  const [hoveredRating, setHoveredRating] = useState(0);
  
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: "",
    },
  });

  const selectedRating = form.watch("rating");

  const handleStarClick = (rating: number) => {
    form.setValue("rating", rating);
  };

  const onSubmit = (data: ReviewFormValues) => {
    console.log("Review submitted:", data);
    toast.success("Your review has been submitted");
    
    if (onReviewSubmitted) {
      onReviewSubmitted(data);
    }
    
    form.reset({
      rating: 0,
      comment: "",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">Rate your experience with Dr. {doctorName}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          className="focus:outline-none"
                          onClick={() => handleStarClick(rating)}
                          onMouseEnter={() => setHoveredRating(rating)}
                          onMouseLeave={() => setHoveredRating(0)}
                        >
                          <Star
                            className={`h-8 w-8 cursor-pointer ${
                              (hoveredRating ? rating <= hoveredRating : rating <= selectedRating)
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-slate-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Review</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Share your experience with the doctor..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <ButtonCustom type="submit" className="w-full">
              <Send className="h-4 w-4 mr-2" />
              Submit Review
            </ButtonCustom>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default DoctorReviewForm;
