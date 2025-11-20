type LoginParams = { username: string; password: string };
type LoginResponse = { token: string; user: { id: string; username: string } };
type RegisterParams = { username: string; password: string };
type RegisterResponse = { success: boolean };

export async function login({ username, password }: LoginParams): Promise<LoginResponse> {
  // Fake backend logic
  if (username === "admin" && password === "123") {
    return {
      token: "ABC123TOKEN",
      user: { id: "1", username: "admin" },
    };
  }
  throw new Error("Invalid username or password");
}

export async function register({ username, password }: RegisterParams): Promise<RegisterResponse> {
  // Fake success
  return { success: true };
}
