import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import MainLayout from "../../layouts/MainLayout";

import { getProductById }
from "../../services/productDetailsService";

import { addToCart }
from "../../services/cartService";

import {
  getReviews,
  createReview
} from "../../services/reviewService";

import LoadingSpinner
from "../../components/common/LoadingSpinner";

function ProductDetailsPage() {
  const { id } = useParams();

  const [product, setProduct] =
  useState<any>(null);

  const [reviews,
  setReviews] =
  useState<any[]>([]);

const [rating,
  setRating] =
  useState(5);

const [comment,
  setComment] =
  useState("");
  const loadReviews =
  async () => {

    try {

      const data =
        await getReviews(
          Number(id)
        );

      setReviews(data);

    }
    catch (error) {

      console.error(error);

    }
};

const handleReviewSubmit =
  async () => {

    try {

      await createReview(
        Number(id),
        rating,
        comment
      );

      toast.success(
        "Review submitted"
      );

      setComment("");

      setRating(5);

      loadReviews();

    }
    catch (error) {

      console.error(error);

      toast.error(
        "Failed to submit review"
      );

    }
};

  

  useEffect(() => {

  loadProduct();

  loadReviews();

}, []);

  const loadProduct = async () => {
  try {
    const data =
      await getProductById(
        Number(id));

    console.log("PRODUCT DATA:", data);

    setProduct(data);
  }
  catch (error) {
    console.error(error);
  }
  };

  const handleAddToCart = async () => {
    try {
      await addToCart(product.id, 1);
      toast.success("Product Added to cart");
    } catch (error) {
      console.error(error);
    }
  };

  if (!product)
  {
    return (
     <MainLayout>
      <LoadingSpinner />
    </MainLayout>
    );
  }

 

  return (
    <MainLayout>

      <div
        className="
        container-custom
        py-10
        "
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          className="
            w-full
            max-w-lg
            rounded-xl
            shadow-xl
            mb-8
          "
        />
        <h1>
          {product.name}
        </h1>

        <p
          className="
          mt-4
          text-slate-400
          "
        >
          {product.description}
        </p>

        <p
          className="
          mt-4
          text-2xl
          text-blue-400
          "
        >
          ₹{product.price}
        </p>

        <button
          className="
          mt-6
          px-4
          py-2
          bg-blue-500
          text-white
          rounded
          hover:bg-blue-600
          "
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>

<div
  className="
  mt-10
  bg-slate-800
  p-6
  rounded-lg
  "
>

  <h2
    className="
    text-2xl
    font-bold
    mb-4
    "
  >
    Write a Review
  </h2>

  <select
    value={rating}
    onChange={(e) =>
      setRating(
        Number(e.target.value)
      )
    }
    className="
    w-full
    p-3
    rounded
    bg-slate-700
    mb-4
    "
  >
    <option value={5}>★★★★★</option>
    <option value={4}>★★★★☆</option>
    <option value={3}>★★★☆☆</option>
    <option value={2}>★★☆☆☆</option>
    <option value={1}>★☆☆☆☆</option>
  </select>

  <textarea
    value={comment}
    onChange={(e) =>
      setComment(
        e.target.value
      )
    }
    placeholder="Write your review..."
    className="
    w-full
    p-3
    rounded
    bg-slate-700
    mb-4
    "
  />

  <button
    onClick={
      handleReviewSubmit
    }
    className="
    bg-green-600
    px-4
    py-2
    rounded
    "
  >
    Submit Review
  </button>

</div>
<div
  className="
  mt-10
  "
>

  <h2
    className="
    text-2xl
    font-bold
    mb-4
    "
  >
    Customer Reviews
  </h2>

  {
    reviews.length === 0
      ? (
        <p>
          No reviews yet
        </p>
      )
      : (
        reviews.map(
          review => (

            <div
              key={review.id}
              className="
              bg-slate-800
              p-4
              rounded-lg
              mb-4
              "
            >

              <h3
                className="
                font-semibold
                "
              >
                {review.userName}
              </h3>

              <p
                className="
                text-yellow-400
                "
              >
                {"★".repeat(
                  review.rating
                )}
              </p>

              <p>
                {review.comment}
              </p>

            </div>

          ))
      )
  }

</div>
      </div>
      

    </MainLayout>
  );
  
}

export default ProductDetailsPage;