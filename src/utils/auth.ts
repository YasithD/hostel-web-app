import { auth } from "@clerk/nextjs/server";

export const isAdminUser = async () => {
  const { userId, sessionClaims } = await auth();
  const role = sessionClaims?.metadata.role;
  if (!userId || role !== "admin") {
    return false;
  }
  return true;
};

export const isLoggedInUser = async () => {
  const { userId } = await auth();
  if (!userId) {
    return false;
  }
};
