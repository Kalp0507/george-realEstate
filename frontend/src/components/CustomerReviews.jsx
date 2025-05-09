"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const StarRating = ({ rating }) => {
  return (
    <div className="flex gap-1 items-center">
      {[...Array(5)].map((_, i) => (
        <img
          key={i}
          src={
            i < rating
              ? "https://upload.wikimedia.org/wikipedia/commons/4/44/Plain_Yellow_Star.png" // Working filled star
              : "https://upload.wikimedia.org/wikipedia/commons/e/e7/Empty_Star.svg" // Working empty star
          }
          alt="Star"
          className="w-4 h-4"
          onError={(e) => (e.target.src = "https://via.placeholder.com/15")} // Backup star image
        />
      ))}
    </div>
  );
};

const ReviewCard = ({ comment, time, imageSrc, rating, customerName }) => {
 
  return (
    <article className="pb-4 w-full border-b border-gray-200 last:border-0">
      <div className="flex flex-wrap items-center gap-4">
        {/* Customer Image */}
        <img
          src={imageSrc || "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=800&auto=format&fit=crop&q=60"}
          alt="Customer"
          className="w-12 h-12 rounded-full object-cover"
          onError={(e) => (e.target.src = "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=800&auto=format&fit=crop&q=60")}
        />

        {/* Customer Name & Rating */}
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-black">
            {customerName || "Anonymous"}
          </h3>
          <StarRating rating={rating} />
        </div>

        {/* Review Time */}
        <time className="text-xs text-gray-500">{time}</time>
      </div>

      {/* Review Comment */}
      <p className="mt-3 text-sm text-gray-600">{comment}</p>
    </article>
  );
};

const CustomerReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter()

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/v1/reviews");
        const data = await response.json();
        setReviews(data?.data || []);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  return (
    <section className="w-full h-full">
      <article className="w-full flex flex-col gap-4 items-center justify-center h-full">
        <div className="text-black">
          {loading ? (
            <p>Loading reviews...</p>
          ) : reviews.length > 0 ? (
            reviews.slice(0, 2).map((review, index) => (
              <ReviewCard
                key={index}
                comment={review.comment}
                time={new Date(review.createdAt).toLocaleString()}
                imageSrc={review.user?.avatar}
                customerName={review.user?.name}
                rating={review.rating}
              />
            ))
          ) : (
            <p>No reviews available</p>
          )}
        </div>

        <button onClick={()=>
          {
             router.push("/reviews")
            
          }
        } className="w-fit px-5 py-3 text-base font-semibold text-white bg-indigo-700 rounded-lg hover:bg-indigo-800 transition">
          See More Reviews
        </button>
      </article>
    </section>
  );
};

export default CustomerReviews;
