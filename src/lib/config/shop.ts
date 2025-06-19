// Shop configuration - centralized shop settings
export interface ShopConfig {
  name: string;
  brandName: string;
  description?: string;
}

// Default shop configuration - can be overridden by user settings
export const defaultShopConfig: ShopConfig = {
  name: "My Store",
  brandName: "StockFlow",
  description: "Smart Inventory Management"
};

// Get shop name from user profile or fallback to default
export const getShopName = (user: any): string => {
  // Priority 1: User's business name from profile
  if (user?.user_metadata?.business_name) {
    return user.user_metadata.business_name;
  }
  
  // Priority 2: User's full name + "Store"
  if (user?.user_metadata?.full_name) {
    return `${user.user_metadata.full_name}'s Store`;
  }
  
  // Priority 3: Email-based store name
  if (user?.email) {
    const emailName = user.email.split('@')[0];
    const capitalizedName = emailName.charAt(0).toUpperCase() + emailName.slice(1);
    return `${capitalizedName}'s Store`;
  }
  
  // Fallback: Default store name
  return defaultShopConfig.name;
};

// Get user initials for avatar
export const getUserInitials = (user: any): string => {
  if (user?.user_metadata?.full_name) {
    return user.user_metadata.full_name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
  if (user?.email) {
    return user.email.charAt(0).toUpperCase();
  }
  return "U";
};

// Update shop name in user profile
export const updateShopName = async (newName: string) => {
  // TODO: Implement Supabase profile update
  console.log('Updating shop name to:', newName);
  // This will be implemented when we add the profile update functionality
};