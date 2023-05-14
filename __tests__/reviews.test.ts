import { createOrderReview, getAMechanicReviews } from "../supabase";

describe("createOrderReview", () => {
  test("should create a review and return data with no error", async () => {
    const review = {
      orderId: "123",
      driverId: "456",
      mechanicId: "789",
      review: "Great service!",
      rating: 5,
    };
    const { data, error } = await createOrderReview(review);
    expect(error).toBeNull();
    expect(data).not.toBeNull();
    expect(data.orderId).toBe(review.orderId);
    expect(data.driverId).toBe(review.driverId);
    expect(data.mechanicId).toBe(review.mechanicId);
    expect(data.review).toBe(review.review);
    expect(data.rating).toBe(review.rating);
  });

  test("should return an error when given invalid review data", async () => {
    const review = {
      orderId: "123",
      driverId: "456",
      mechanicId: "789",
      review: "",
      rating: 5,
    };
    const { data, error } = await createOrderReview(review);
    expect(data).toBeNull();
    expect(error).not.toBeNull();
  });
});

describe("getAMechanicReviews", () => {
  test("should return reviews for a given mechanicId with no error", async () => {
    const mechanicId = "789";
    const { data, error } = await getAMechanicReviews(mechanicId);
    expect(error).toBeNull();
    expect(data).not.toBeNull();
    data.forEach((review) => {
      expect(review.mechanicId).toBe(mechanicId);
    });
  });

  test("should return no reviews when given an invalid mechanicId", async () => {
    const mechanicId = "invalidId";
    const { data, error } = await getAMechanicReviews(mechanicId);
    expect(data).toHaveLength(0);
    expect(error).toBeNull();
  });
});
