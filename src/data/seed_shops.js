import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qovccvusvcrlvggyjtqh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvdmNjdnVzdmNybHZnZ3lqdHFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzMjE0MjgsImV4cCI6MjA4Njg5NzQyOH0.AIyU-WaOJ3E0RbkspV7nX9UNNwn99ZPk46qRo32vie0';

const supabase = createClient(supabaseUrl, supabaseKey);

const ownerEmail = 'kolkata_owner@getacut.com';
const ownerPassword = 'KolkataBarbers2026!';

const newShops = [
  {
    shop_name: "Hi.Handsome Gents Parlour",
    opening_time: "09:00",
    closing_time: "21:00",
    total_seats: 3,
    is_open: true,
    address: "Baguihati Main Road, opp. Deshbandhu Nagar Post Office, Baguiati, Kolkata 700059",
    lat: 22.62,
    lng: 88.42
  },
  {
    shop_name: "The Barber Republic",
    opening_time: "09:00",
    closing_time: "21:00",
    total_seats: 3,
    is_open: true,
    address: "9, Ibrahim Road, Beside Ekbalpore Nursing Home, Kidderpore/Ekbalpore, Kolkata 700023",
    lat: 22.527,
    lng: 88.318
  },
  {
    shop_name: "Style Collective Family Salon",
    opening_time: "09:00",
    closing_time: "21:00",
    total_seats: 4,
    is_open: true,
    address: "CF-128, Salt Lake City, Sector-1, Kolkata 700064",
    lat: 22.591121,
    lng: 88.404029
  },
  {
    shop_name: "The Style Street Family Saloon",
    opening_time: "09:00",
    closing_time: "21:00",
    total_seats: 3,
    is_open: true,
    address: "205A/3, near SBI Bank, Sakher Bazar, Diamond Harbour Road, Kolkata",
    lat: 22.47,
    lng: 88.30
  },
  {
    shop_name: "Phoenix Grooming Studio",
    opening_time: "09:00",
    closing_time: "21:00",
    total_seats: 3,
    is_open: true,
    address: "Ghugragachi, Nabarupdaha, Bayardengi Road, Hanskhali, Nadia (West Bengal)",
    lat: 23.3677,
    lng: 88.6011
  },
  {
    shop_name: "La Bella Vita Hair n Beauty Lounge",
    opening_time: "09:00",
    closing_time: "21:00",
    total_seats: 3,
    is_open: true,
    address: "GA-1, Rajdanga Main Road, Narkel Bagan, Ruby Kasba, Kolkata",
    lat: 22.5085,
    lng: 88.3900
  }
];

async function seed() {
  console.log("Starting DB seeding...");

  // 1. Try to sign in first
  let user;
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email: ownerEmail,
    password: ownerPassword
  });

  if (signInError) {
    console.log("Sign in failed, attempting to register owner...");
    // 2. Register owner
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: ownerEmail,
      password: ownerPassword
    });

    if (signUpError) {
      throw new Error(`Failed to sign up: ${signUpError.message}`);
    }
    user = signUpData.user;
    console.log(`Registered owner with ID: ${user.id}`);

    // Create owner profile
    const { error: profileError } = await supabase.from("profiles").insert({
      id: user.id,
      name: "Kolkata Master Owner",
      phone: "+91 99999 99999",
      role: "owner"
    });

    if (profileError) {
      console.warn(`Profile creation warning: ${profileError.message}`);
    } else {
      console.log("Owner profile created successfully.");
    }
  } else {
    user = signInData.user;
    console.log(`Logged in as owner with ID: ${user.id}`);
  }

  // 3. Fetch existing shops in DB
  const { data: existingShops, error: fetchError } = await supabase.from("shops").select("*");
  if (fetchError) {
    throw new Error(`Failed to fetch existing shops: ${fetchError.message}`);
  }

  const existingNames = new Set(existingShops.map(s => s.shop_name.toLowerCase().trim()));
  console.log(`Found ${existingShops.length} existing shops in database.`);

  const toInsert = [];
  for (const shop of newShops) {
    if (existingNames.has(shop.shop_name.toLowerCase().trim())) {
      console.log(`Shop already exists (Skipping duplicate): "${shop.shop_name}"`);
    } else {
      toInsert.push({
        ...shop,
        owner_id: user.id
      });
    }
  }

  if (toInsert.length === 0) {
    console.log("All shops already registered in Supabase. Nothing to seed.");
    return;
  }

  console.log(`Inserting ${toInsert.length} new shops...`);
  const { data: insertedData, error: insertError } = await supabase.from("shops").insert(toInsert).select();

  if (insertError) {
    throw new Error(`Failed to insert shops: ${insertError.message}`);
  }

  console.log(`Successfully seeded ${insertedData.length} shops into Supabase.`);
}

seed().catch(err => {
  console.error("Seeding error:", err);
});
