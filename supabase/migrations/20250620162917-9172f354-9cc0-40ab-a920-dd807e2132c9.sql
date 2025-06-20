
-- Add notification-related columns to the profiles table
ALTER TABLE public.profiles 
ADD COLUMN notification_email TEXT,
ADD COLUMN reminder_time TEXT DEFAULT '18:00',
ADD COLUMN email_notifications_enabled BOOLEAN DEFAULT false;
