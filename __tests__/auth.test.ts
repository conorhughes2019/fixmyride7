import {
  createDriverAccount,
  createMechanicAccount,
  getDriverProfile,
} from "../supabase/index";
//Test Creating Driver Account
describe("createDriverAccount", () => {
  test("returns driver data and no errors when sign up and insert are successful", async () => {
    const driver = {
      email: "driver@example.com",
      password: "password",
      name: "Driver Name",
      phoneNumber: "1234567890",
    };
    const signUpResult = {
      data: {
        user: {
          id: "driver-user-id",
          email: driver.email,
        },
      },
      error: null,
    };
    const insertResult = {
      data: {
        id: "driver-user-id",
        email: driver.email,
        name: driver.name,
        phoneNumber: driver.phoneNumber,
      },
      error: null,
    };
    const expected = {
      data: insertResult.data,
      error: null,
    };

    const supabase = {
      auth: { signUp: jest.fn(() => signUpResult) },
      from: jest.fn(() => ({
        insert: jest.fn(() => insertResult),
        select: jest.fn(() => ({ single: jest.fn(() => insertResult) })),
      })),
    };
    const result = await createDriverAccount(driver, supabase);

    expect(supabase.auth.signUp).toHaveBeenCalledWith({
      email: driver.email,
      password: driver.password,
      options: {
        data: {
          name: driver.name,
          phoneNumber: driver.phoneNumber,
          accountType: "driver",
        },
      },
    });
    expect(supabase.from).toHaveBeenCalledWith("drivers");
    expect(result).toEqual(expected);
  });
});

describe("getDriverProfile", () => {
  it("should get a driver's profile", async () => {
    const driver = {
      email: "johndoe@example.com",
      password: "password",
      name: "John Doe",
      phoneNumber: "1234567890",
    };
    const createResult = await createDriverAccount(driver);
    const getResult = await getDriverProfile(createResult.data.id);
    expect(getResult.error).toBeNull();
    expect(getResult.data.email).toBe(driver.email);
  });
});

describe("createMechanicAccount", () => {
  it("should create a mechanic account", async () => {
    const mechanic = {
      email: "janedoe@example.com",
      password: "password",
      name: "Jane Doe",
      phoneNumber: "1234567890",
      latitude: 40.748817,
      longitude: -73.985428,
    };
    const result = await createMechanicAccount(mechanic);
    expect(result.error).toBeNull();
    expect(result.data.email).toBe(mechanic.email);
  });
});

describe("loginMechanic", () => {
  it("should log in a mechanic", async () => {
    const credentials = {
      email: "janedoe@example.com",
      password: "password",
    };
    const result = await loginMechanic(credentials);
    expect(result.error).toBeNull();
    expect(result.data.email).toBe(credentials.email);
  });
});

describe("setDriverLogo", () => {
  it("should set a driver's logo", async () => {
    const base64Image = "some-base-64-encoded-image";
    const result = await setDriverLogo(base64Image);
    expect(result.error).toBeNull();
    expect(result.data).toBeTruthy();
  });
});
