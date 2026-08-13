"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Star, MessageSquare, ClipboardList, Loader2, Package } from "lucide-react";
import PageHeading from "@/components/shared/PageHeading";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { getCustomerRentalOrdersAction } from "@/app/(customer)/_actions/rentalActions";
import { getCustomerReviewsAction, createReviewAction } from "@/app/(customer)/_actions/reviewActions";
import Image from "next/image";

const reviewSchema = z.object({
  rating: z.number().min(1, "Please select a rating").max(5),
  comment: z.string().optional(),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;
type StatRow = [React.ElementType, string, string, string];

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const CustomerReviewsPage = () => {
  const [selectedRentalForReview, setSelectedRentalForReview] = useState<any>(null);

  const { data: rentals = [], isLoading: isLoadingRentals } = useQuery({
    queryKey: ["customer-rental-orders"],
    queryFn: getCustomerRentalOrdersAction,
  });

  const { data: reviews = [], isLoading: isLoadingReviews, refetch: refetchReviews } = useQuery({
    queryKey: ["customer-reviews"],
    queryFn: getCustomerReviewsAction,
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: "",
    },
  });

  const ratingValue = watch("rating");

  const submitReviewMutation = useMutation({
    mutationFn: (data: ReviewFormValues) =>
      createReviewAction({
        rentalOrderId: selectedRentalForReview.id,
        rating: data.rating,
        comment: data.comment,
      }),
    onSuccess: () => {
      toast.success("Review submitted successfully!");
      setSelectedRentalForReview(null);
      reset();
      refetchReviews();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to submit review");
    },
  });

  const onSubmit = (data: ReviewFormValues) => {
    if (data.rating < 1) {
      toast.error("Please select a rating");
      return;
    }
    submitReviewMutation.mutate(data);
  };

  const isLoading = isLoadingRentals || isLoadingReviews;

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#e31824]" />
      </div>
    );
  }

  // Pending reviews: Orders that are RETURNED and do not have a review yet.
  // We can check if the rentalOrderId exists in the reviews array.
  const reviewedRentalOrderIds = new Set(reviews.map((r: any) => r.rentalOrderId));
  
  const pendingRentals = rentals.filter(
    (rental: any) => rental.status === "RETURNED" && !reviewedRentalOrderIds.has(rental.id)
  );

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((acc: number, cur: any) => acc + cur.rating, 0) / reviews.length).toFixed(1)
      : "0.0";

  return (
    <div className="p-6 sm:p-10">
      <PageHeading title="My Reviews" />

      <div className="grid gap-4 sm:grid-cols-3">
        {([
          [Star, avgRating, "Avg rating given", "text-amber-500"],
          [MessageSquare, reviews.length.toString(), "Total Reviews", "text-blue-600"],
          [ClipboardList, pendingRentals.length.toString(), "Pending Reviews", "text-primary"],
        ] as StatRow[]).map(([Icon, number, label, color]) => (
          <Card
            key={label as string}
            className="flex items-center gap-4 rounded-xl bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
          >
            <Icon className={`size-7 ${color}`} />
            <div>
              <p className="text-2xl font-extrabold text-foreground">{number}</p>
              <p className="text-sm text-slate-500">{label}</p>
            </div>
          </Card>
        ))}
      </div>

      {pendingRentals.length > 0 && (
        <section className="mt-10">
          <div className="rounded-t-xl bg-amber-100 px-5 py-4">
            <h2 className="font-extrabold text-amber-800">Pending Reviews</h2>
          </div>
          <div className="grid gap-4 rounded-b-xl bg-amber-50 p-5 lg:grid-cols-2">
            {pendingRentals.map((rental: any) => (
              <Card
                key={rental.id}
                className="flex flex-col gap-4 rounded-xl bg-white p-4 sm:flex-row sm:items-center"
              >
                {rental.gearItem?.image ? (
                  <div className="relative h-20 w-full shrink-0 overflow-hidden rounded-lg sm:w-24">
                    <Image
                      src={rental.gearItem.image}
                      alt={rental.gearItem.name}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-20 w-full items-center justify-center rounded-lg bg-slate-100 sm:w-24">
                    <Package className="size-8 text-slate-300" />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-extrabold text-foreground">
                    {rental.gearItem?.name}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Returned: {formatDate(rental.endDate)}
                  </p>
                </div>
                <Button
                  onClick={() => {
                    setSelectedRentalForReview(rental);
                    reset();
                    setTimeout(() => {
                      document.getElementById("review-form")?.scrollIntoView({ behavior: "smooth" });
                    }, 100);
                  }}
                  className="rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-bold text-white hover:bg-primary/90"
                >
                  Leave a Review
                </Button>
              </Card>
            ))}
          </div>
        </section>
      )}

      {selectedRentalForReview && (
        <section
          id="review-form"
          className="mt-8 max-w-2xl rounded-xl bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
        >
          <h2 className="text-xl font-extrabold text-foreground">Leave a Review</h2>
          <p className="mt-1 text-sm text-slate-500">
            How was the {selectedRentalForReview.gearItem?.name}?
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-5">
            <div className="flex gap-2">
              {Array.from({ length: 5 }).map((_, index) => {
                const starValue = index + 1;
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setValue("rating", starValue)}
                    className="text-3xl text-amber-400 focus:outline-none"
                  >
                    <Star
                      className={`size-8 ${
                        starValue <= ratingValue ? "fill-amber-400" : "fill-transparent"
                      } transition-colors`}
                    />
                  </button>
                );
              })}
            </div>
            {errors.rating && (
              <p className="mt-2 text-sm text-red-500">{errors.rating.message}</p>
            )}

            <label className="mt-5 block text-sm font-bold text-foreground">
              Your review (Optional)
              <Textarea
                {...register("comment")}
                placeholder="Share your experience with this gear..."
                className="mt-2 min-h-[120px] w-full rounded-lg border border-slate-200 p-3 text-sm leading-6 outline-none focus:border-primary"
              />
            </label>
            {errors.comment && (
              <p className="mt-2 text-sm text-red-500">{errors.comment.message}</p>
            )}

            <div className="mt-6 flex items-center gap-4">
              <Button
                type="submit"
                disabled={submitReviewMutation.isPending}
                className="rounded-lg bg-primary px-5 py-3 text-sm font-bold text-white hover:bg-primary/90"
              >
                {submitReviewMutation.isPending && (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                )}
                Submit Review
              </Button>
              <button
                type="button"
                onClick={() => {
                  setSelectedRentalForReview(null);
                  reset();
                }}
                className="text-sm font-bold text-slate-500 hover:text-slate-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="mt-9">
        <h2 className="text-xl font-extrabold text-foreground">
          My Submitted Reviews
        </h2>
        {reviews.length === 0 ? (
          <div className="mt-4 flex flex-col items-center justify-center rounded-xl bg-white py-16 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
            <MessageSquare className="mb-3 size-12 text-slate-300" />
            <p className="font-bold text-slate-500">No reviews submitted yet</p>
          </div>
        ) : (
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            {reviews.map((review: any) => (
              <Card
                key={review.id}
                className="rounded-xl bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
              >
                <div className="flex gap-3">
                  {review.gearItem?.image ? (
                    <div className="relative size-12 shrink-0 overflow-hidden rounded-lg">
                      <Image
                        src={review.gearItem.image}
                        alt={review.gearItem.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex size-12 items-center justify-center rounded-lg bg-slate-100">
                      <Package className="size-6 text-slate-300" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-extrabold text-foreground">
                      {review.gearItem?.name}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      Rental: {formatDate(review.rentalOrder?.startDate)} – {formatDate(review.rentalOrder?.endDate)}
                    </p>
                  </div>
                </div>
                <div className="mt-5 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      key={index}
                      className={`size-4 ${
                        index < review.rating
                          ? "fill-amber-400 text-amber-400"
                          : "fill-transparent text-slate-300"
                      }`}
                    />
                  ))}
                </div>
                {review.comment && (
                  <p className="mt-4 text-sm leading-6 text-slate-600">
                    “{review.comment}”
                  </p>
                )}
                <p className="mt-5 text-xs text-slate-400">
                  Submitted {formatDate(review.createdAt)}
                </p>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default CustomerReviewsPage;
