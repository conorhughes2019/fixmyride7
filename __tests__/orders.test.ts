import {
  getMechanicOrders,
  getDriverOrders,
  updateOrderState,
  updateOrderProgess,
} from "../supabase";

describe("getMechanicOrders", () => {
  test("should return data and no error when given a valid mechanicId", async () => {
    const mechanicId = "123";
    const { data, error } = await getMechanicOrders(mechanicId);
    expect(error).toBeNull();
    expect(data).not.toBeNull();
  });

  test("should return an error when given an invalid mechanicId", async () => {
    const mechanicId = "invalidId";
    const { data, error } = await getMechanicOrders(mechanicId);
    expect(data).toBeNull();
    expect(error).not.toBeNull();
  });
});

describe("getDriverOrders", () => {
  test("should return data and no error when given a valid driverId", async () => {
    const driverId = "456";
    const { data, error } = await getDriverOrders(driverId);
    expect(error).toBeNull();
    expect(data).not.toBeNull();
  });

  test("should return an error when given an invalid driverId", async () => {
    const driverId = "invalidId";
    const { data, error } = await getDriverOrders(driverId);
    expect(data).toBeNull();
    expect(error).not.toBeNull();
  });
});

describe("updateOrderState", () => {
  test("should update the state of an order and return data with no error", async () => {
    const orderId = "123";
    const state = "Ongoing";
    const { data, error } = await updateOrderState(orderId, state);
    expect(error).toBeNull();
    expect(data).not.toBeNull();
    expect(data.state).toBe(state);
  });

  test("should return an error when given an invalid orderId", async () => {
    const orderId = "invalidId";
    const state = "Ongoing";
    const { data, error } = await updateOrderState(orderId, state);
    expect(data).toBeNull();
    expect(error).not.toBeNull();
  });
});

describe("updateOrderProgess", () => {
  test("should update the progress of an order and return no error", async () => {
    const orderId = "123";
    const progress = "In Progress";
    const error = await updateOrderProgess(orderId, progress);
    expect(error).toBeNull();
  });

  test("should return an error when given an invalid orderId", async () => {
    const orderId = "invalidId";
    const progress = "In Progress";
    const error = await updateOrderProgess(orderId, progress);
    expect(error).not.toBeNull();
  });
});
