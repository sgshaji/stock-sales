
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const resendApiKey = Deno.env.get('RESEND_API_KEY');

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const resend = resendApiKey ? new Resend(resendApiKey) : null;

interface UserNotificationData {
  id: string;
  email: string;
  full_name: string;
  business_name: string;
  notification_email: string;
  reminder_time: string;
  timezone: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting daily sales notification check...');

    if (!resend) {
      console.error('Resend API key not configured');
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    const today = new Date().toISOString().split('T')[0];
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    const currentTimeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}:00`;

    console.log(`Checking for notifications at ${currentTimeString} on ${today}`);

    // Get users who have email notifications enabled and haven't been notified today
    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select('id, email, full_name, business_name, notification_email, reminder_time, timezone')
      .eq('email_notifications_enabled', true)
      .not('notification_email', 'is', null);

    if (usersError) {
      console.error('Error fetching users:', usersError);
      throw usersError;
    }

    console.log(`Found ${users?.length || 0} users with notifications enabled`);

    if (!users || users.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No users with notifications enabled' }),
        { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    const notificationsSent = [];

    for (const user of users as UserNotificationData[]) {
      try {
        // Check if user's reminder time has passed (simple hour comparison for now)
        const [reminderHour, reminderMinute] = user.reminder_time.split(':').map(Number);
        const reminderTimeInMinutes = reminderHour * 60 + reminderMinute;
        const currentTimeInMinutes = currentHour * 60 + currentMinute;

        // Only check if the current time is at or after the reminder time
        if (currentTimeInMinutes < reminderTimeInMinutes) {
          console.log(`Skipping user ${user.email} - reminder time not reached yet`);
          continue;
        }

        // Check if user has sales entry for today
        const { data: salesData } = await supabase
          .from('sales')
          .select('id')
          .eq('user_id', user.id)
          .eq('sale_date', today)
          .limit(1);

        // Check if notification was already sent today
        const { data: trackingData } = await supabase
          .from('daily_sales_tracking')
          .select('notification_sent')
          .eq('user_id', user.id)
          .eq('date', today)
          .single();

        const hasSalesEntry = salesData && salesData.length > 0;
        const notificationAlreadySent = trackingData?.notification_sent || false;

        console.log(`User ${user.email}: hasSales=${hasSalesEntry}, notificationSent=${notificationAlreadySent}`);

        // Send notification if no sales entry and notification not sent
        if (!hasSalesEntry && !notificationAlreadySent) {
          const emailResponse = await resend.emails.send({
            from: "StockFlow <notifications@resend.dev>",
            to: [user.notification_email],
            subject: "Daily Sales Reminder - StockFlow",
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h1 style="color: #333; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
                  Daily Sales Reminder
                </h1>
                <p>Hello ${user.full_name || 'there'},</p>
                <p>This is a friendly reminder that you haven't entered any sales data for today (${today}) in your StockFlow inventory management system.</p>
                <p>To keep your business records accurate and up-to-date, please log in and enter your daily sales:</p>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${supabaseUrl.replace('.supabase.co', '.vercel.app')}/sales" 
                     style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                    Enter Sales Data
                  </a>
                </div>
                <p>If you don't have any sales to record for today, you can safely ignore this reminder.</p>
                <p>Best regards,<br>
                StockFlow Team</p>
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
                <p style="font-size: 12px; color: #666;">
                  You can modify your notification settings in the app under Settings > Configuration.
                </p>
              </div>
            `,
          });

          if (emailResponse.error) {
            console.error(`Failed to send email to ${user.email}:`, emailResponse.error);
          } else {
            console.log(`Email sent successfully to ${user.email}`);
            notificationsSent.push(user.email);

            // Update tracking record
            await supabase
              .from('daily_sales_tracking')
              .upsert({
                user_id: user.id,
                date: today,
                has_sales_entry: false,
                notification_sent: true,
              });
          }
        }
      } catch (userError) {
        console.error(`Error processing user ${user.email}:`, userError);
      }
    }

    console.log(`Notifications sent to: ${notificationsSent.join(', ')}`);

    return new Response(
      JSON.stringify({ 
        message: 'Notification check completed',
        notificationsSent,
        totalChecked: users.length 
      }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );

  } catch (error) {
    console.error('Error in notification check:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
};

serve(handler);
