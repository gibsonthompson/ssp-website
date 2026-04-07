import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, phone, email, location, service, details } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ error: 'Name and phone are required' });
    }

    // 1. Insert into Supabase
    const { data, error: dbError } = await supabase
      .from('ssp_contact_submissions')
      .insert([{
        name,
        phone,
        email: email || null,
        location: location || null,
        service: service || null,
        details: details || null,
      }])
      .select()
      .single();

    if (dbError) {
      console.error('Supabase insert error:', dbError);
    }

    // 2. Send SMS notification via Telnyx
    const smsBody = [
      `🔶 New SSP Quote Request!`,
      ``,
      `Name: ${name}`,
      `Phone: ${phone}`,
      email ? `Email: ${email}` : null,
      location ? `Location: ${location}` : null,
      service ? `Service: ${service}` : null,
      details ? `Details: ${details.substring(0, 200)}` : null,
    ].filter(Boolean).join('\n');

    try {
      await fetch('https://api.telnyx.com/v2/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.TELNYX_API_KEY}`,
        },
        body: JSON.stringify({
          from: process.env.TELNYX_PHONE_NUMBER,
          to: process.env.NOTIFY_PHONE_NUMBER,
          text: smsBody,
        }),
      });
    } catch (smsError) {
      console.error('SMS send error:', smsError);
      // Don't fail the request if SMS fails
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Form submission error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}