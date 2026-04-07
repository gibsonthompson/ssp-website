import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { name, phone, email, location, service, details, photo_urls } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ error: 'Name and phone are required' });
    }

    // Insert to Supabase
    const { error: dbError } = await supabase
      .from('ssp_contact_submissions')
      .insert([{
        name,
        phone,
        email: email || null,
        location: location || null,
        service: service || null,
        details: details || null,
        photo_urls: photo_urls && photo_urls.length > 0 ? photo_urls : null,
      }]);

    if (dbError) console.error('Supabase error:', dbError);

    // Build SMS
    const lines = [
      `🔶 New SSP Quote Request!`,
      ``,
      `Name: ${name}`,
      `Phone: ${phone}`,
    ];
    if (email) lines.push(`Email: ${email}`);
    if (location) lines.push(`Location: ${location}`);
    if (service) lines.push(`Service: ${service}`);
    if (details) lines.push(`Details: ${details.substring(0, 160)}`);
    if (photo_urls && photo_urls.length > 0) {
      lines.push(``);
      lines.push(`📷 ${photo_urls.length} photo(s):`);
      photo_urls.slice(0, 3).forEach(url => lines.push(url));
      if (photo_urls.length > 3) lines.push(`...and ${photo_urls.length - 3} more`);
    }

    // Send SMS via Telnyx
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
          text: lines.join('\n'),
        }),
      });
    } catch (smsErr) {
      console.error('SMS error:', smsErr);
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}