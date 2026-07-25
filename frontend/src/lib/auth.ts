// Save sellerId in localStorage
export const loginSeller = (sellerId: string) => {
  localStorage.setItem("sellerId", sellerId);
};

// Get sellerId
export const getSellerId = () => {
  return localStorage.getItem("sellerId");
};

// Logout (clear sellerId)
export const logoutSeller = () => {
  localStorage.removeItem("sellerId");
};
