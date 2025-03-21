
import { useState } from "react";
import { Star, ThumbsUp, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ButtonCustom } from "@/components/ui/button-custom";
import { formatDate } from "@/lib/utils";
import DoctorReviewForm from "@/components/patient/DoctorReviewForm";

interface Review {
  id: string;
  patientName: string;
  patientImage?: string;
  rating: number;
  comment: string;
  date: string;
  helpfulCount: number;
  isHelpful?: boolean;
}

interface DoctorRatingsProps {
  doctorId: string;
  doctorName?: string;
  averageRating: number;
  totalReviews: number;
  reviews: Review[];
  showReviewForm?: boolean;
}

const DoctorRatings = ({ 
  doctorId, 
  doctorName = "", 
  averageRating, 
  totalReviews, 
  reviews,
  showReviewForm = false
}: DoctorRatingsProps) => {
  const [reviewsList, setReviewsList] = useState<Review[]>(reviews);
  const [showForm, setShowForm] = useState(false);

  const handleHelpful = (reviewId: string) => {
    setReviewsList(
      reviewsList.map(review => {
        if (review.id === reviewId) {
          const wasHelpful = review.isHelpful || false;
          return {
            ...review,
            helpfulCount: wasHelpful ? review.helpfulCount - 1 : review.helpfulCount + 1,
            isHelpful: !wasHelpful
          };
        }
        return review;
      })
    );
  };

  const handleNewReview = (data: { rating: number; comment: string }) => {
    // In a real app, this would send the review to an API
    const newReview: Review = {
      id: `review-${Date.now()}`,
      patientName: "You", // In a real app, this would be the current user's name
      rating: data.rating,
      comment: data.comment,
      date: new Date().toISOString(),
      helpfulCount: 0,
      isHelpful: false
    };
    
    setReviewsList([newReview, ...reviewsList]);
    setShowForm(false);
  };

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < rating ? "text-yellow-400 fill-yellow-400" : "text-slate-300"
          }`}
        />
      ));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Patient Reviews</span>
          <div className="flex items-center">
            <div className="flex mr-2">{renderStars(Math.round(averageRating))}</div>
            <span className="text-lg font-bold">{averageRating.toFixed(1)}</span>
            <span className="text-sm text-slate-500 ml-2">({totalReviews} reviews)</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {showReviewForm && !showForm && (
          <div className="mb-6">
            <ButtonCustom 
              onClick={() => setShowForm(true)}
              className="w-full"
            >
              Write a Review
            </ButtonCustom>
          </div>
        )}

        {showForm && (
          <div className="mb-6">
            <DoctorReviewForm 
              doctorId={doctorId}
              doctorName={doctorName}
              onReviewSubmitted={handleNewReview}
            />
          </div>
        )}

        {reviewsList.length > 0 ? (
          <div className="space-y-6">
            {reviewsList.map((review) => (
              <div key={review.id} className="border-b border-slate-200 pb-6 last:border-b-0 last:pb-0">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={review.patientImage} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{review.patientName}</p>
                      <div className="flex items-center mt-1">
                        <div className="flex mr-2">{renderStars(review.rating)}</div>
                        <span className="text-xs text-slate-500">{formatDate(review.date)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-slate-700 mb-3">{review.comment}</p>
                <div className="flex items-center">
                  <ButtonCustom
                    variant={review.isHelpful ? "default" : "outline"}
                    size="sm"
                    className="h-8"
                    onClick={() => handleHelpful(review.id)}
                  >
                    <ThumbsUp className="h-3.5 w-3.5 mr-1" />
                    Helpful ({review.helpfulCount})
                  </ButtonCustom>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-slate-500">
            <p>No reviews yet for this doctor.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DoctorRatings;
