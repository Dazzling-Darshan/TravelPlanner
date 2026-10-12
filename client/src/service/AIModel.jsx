// Enhanced AIModel.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from 'axios';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY);

// --- 1. ENHANCED Geocoding (with place type details) ---
async function geocodeLocation(location) {
  console.log("📍 Geocoding:", location);
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1&addressdetails=1`
    );
    const data = await response.json();
    if (data.length > 0) {
      const details = data[0];
      // Store useful info for later queries (city, country)
      return {
        lat: parseFloat(details.lat),
        lng: parseFloat(details.lon),
        displayName: details.display_name,
        type: details.type
      };
    }
    throw new Error('Location not found');
  } catch (error) {
    console.error("Geocoding failed:", error);
    throw error;
  }
}

// --- 2. REAL IMAGE FETCHER (Using Unsplash API) ---
async function fetchPlaceImage(query, location, type) {
  // Add safe keywords to avoid inappropriate content
  const safeKeywords = type === 'hotel' ? 'hotel,building' : 'landmark,travel';
  const searchQuery = `${query},${location},${safeKeywords}`.replace(/\s+/g, ',');

  try {
    // LoremFlickr is a more reliable alternative to the deprecated Unsplash source redirect
    const imageUrl = `https://loremflickr.com/800/600/${encodeURIComponent(searchQuery.toLowerCase())}`;
    return imageUrl;
  } catch (error) {
    // Ultimate fallback
    return `https://picsum.photos/800/600?random=${Math.random()}`;
  }
}

// --- 3. ENHANCED HOTEL FETCHER (with realistic pricing & amenities) ---
async function fetchRealHotels(lat, lng, budget, locationName) {
  console.log("🏨 Fetching hotels...");
  try {
    const radius = 5000; // Reduced to 5km radius for speed
    // More specific Overpass Query for tourism and amenity
    const query = `
      [out:json][timeout:60];
      (
        node["tourism"="hotel"](around:${radius},${lat},${lng});
        node["tourism"="guest_house"](around:${radius},${lat},${lng});
        node["amenity"="hotel"](around:${radius},${lat},${lng});
      );
      out body;
      >;
      out skel qt;
    `;

    const response = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error(`Overpass API error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();

    const hotelPromises = data.elements.slice(0, 8).map(async (element) => {
      const hotelName = element.tags.name || `${locationName} Hotel`;

      // Build a realistic address
      let address = element.tags['addr:street'] || '';
      if (element.tags['addr:city']) address += `, ${element.tags['addr:city']}`;
      if (element.tags['addr:country']) address += `, ${element.tags['addr:country']}`;
      if (!address) address = `Near ${locationName}`;

      // Calculate realistic price based on budget and tags
      let pricePerNight;
      if (budget === 'Cheap') {
        pricePerNight = element.tags.tourism === 'hotel' ? '₹2500-₹5000' : '₹1000-₹2500';
      } else if (budget === 'Mid-range') {
        pricePerNight = '₹5000-₹12000';
      } else { // Luxury
        pricePerNight = element.tags['building:levels'] > 10 ? '₹15000-₹40000' : '₹12000-₹25000';
      }

      // Generate rating (4.0 to 4.8, slightly random)
      const rating = (4.0 + Math.random() * 0.8).toFixed(1);

      // Generate REAL image URLs
      const imageUrl = await fetchPlaceImage(hotelName, locationName, 'hotel');

      return {
        hotelName,
        address: address || `Near ${locationName}`,
        price: `${pricePerNight} per night`,
        imageUrl, // ✅ यहाँ valid URL होना चाहिए
        geoCoordinates: { lat: element.lat, lng: element.lon },
        rating,
        description: element.tags.description || `A comfortable hotel in ${locationName}`,
        amenities: ['Free WiFi', 'Parking', 'Breakfast']
      };
    });

    const hotels = await Promise.all(hotelPromises);
    console.log(`✅ Found ${hotels.length} enhanced hotels`);
    return hotels;
  } catch (error) {
    console.error("Hotel fetch error:", error);
    return [];
  }
}

// --- 4. ENHANCED PLACES FETCHER (with Wikipedia details) ---
async function fetchTouristPlaces(lat, lng, locationName) {
  console.log("🗺️ Fetching places...");
  try {
    const radius = 25000; // Increased to 25km for wider search
    // Broader, smarter query for attractions
    const query = `
      [out:json][timeout:60];
      (
        node["tourism"~"attraction|museum|gallery|viewpoint|castle|zoo|theme_park|monument|ruins"](around:${radius},${lat},${lng});
        node["historic"~"monument|castle|archaeological_site|ruins"](around:${radius},${lat},${lng});
        node["leisure"~"park|garden|nature_reserve"](around:${radius},${lat},${lng});
        way["tourism"~"attraction|museum|castle"](around:${radius},${lat},${lng});
        way["historic"~"monument|castle"](around:${radius},${lat},${lng});
      );
      out center;
      >;
      out skel qt;
    `;

    const response = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
    if (!response.ok) {
      console.warn("Overpass API failed, will rely on AI knowledge");
      return [];
    }
    const data = await response.json();

    if (!data.elements || data.elements.length === 0) {
      console.warn("No places found nearby, AI will need to suggest real locations");
      return [];
    }

    const placePromises = data.elements.slice(0, 25).map(async (element) => {
      const placeName = element.tags.name || `${locationName} Point of Interest`;
      // Prioritize wikipedia tag which usually has "lang:Title" format
      const wikiTag = element.tags.wikipedia;

      // Fetch description from Wikipedia if available
      let details = element.tags.description || element.tags['description:en'] || 'A notable local attraction.';

      if (wikiTag) {
        try {
          // Extract title (e.g. "en:Eiffel Tower" -> "Eiffel Tower")
          // If it's just a title without prefix, use it as is.
          const title = wikiTag.includes(':') ? wikiTag.split(':')[1] : wikiTag;

          if (title) {
            const wikiResponse = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`);
            if (wikiResponse.ok) {
              const wikiData = await wikiResponse.json();
              if (wikiData.extract) {
                details = wikiData.extract;
              }
            }
          }
        } catch (e) {
          console.warn("Wikipedia fetch failed for", placeName, e);
        }
      }

      // Smart pricing based on type
      let ticketPricing = 'Free';
      if (element.tags.tourism === 'museum' || element.tags.tourism === 'zoo') {
        ticketPricing = '₹500-₹1500';
      } else if (element.tags.historic) {
        ticketPricing = '₹100-₹500';
      }

      // Calculate realistic best time
      const openingHours = element.tags.opening_hours;
      let bestTimeToVisit = '9:00 AM - 6:00 PM';
      if (openingHours && openingHours.includes('09:00-17:00')) bestTimeToVisit = 'Morning (Less crowd)';
      if (element.tags.leisure === 'park') bestTimeToVisit = 'Early Morning or Sunset';

      // Get image
      const imageUrl = await fetchPlaceImage(placeName, locationName, 'attraction');

      // Generate rating (4.2 to 4.9)
      const rating = (4.2 + Math.random() * 0.7).toFixed(1);

      return {
        placeName,
        details: details.substring(0, 150) + (details.length > 150 ? '...' : ''), // Truncate long descriptions
        imageUrl,
        geoCoordinates: { lat: element.lat, lng: element.lon },
        ticketPricing,
        rating,
        travelTime: `${Math.floor(Math.random() * 25) + 15} min from center`, // Simulated
        bestTimeToVisit
      };
    });

    const places = await Promise.all(placePromises);
    console.log(`✅ Found ${places.length} enhanced places`);
    return places;
  } catch (error) {
    console.error("Places fetch error:", error);
    return [];
  }
}

// --- 5. MAIN GENERATE TRIP FUNCTION (Enhanced) ---
export async function generateTripPlan(location, days, budget, traveler) {
  console.log("=".repeat(60));
  console.log("🚀 Generating Enhanced Trip for:", { location, days, budget, traveler });

  try {
    // 1. Geocode
    const geoData = await geocodeLocation(location);

    // 2. Fetch Data in Parallel (faster)
    const [hotels, allPlaces] = await Promise.all([
      fetchRealHotels(geoData.lat, geoData.lng, budget, location),
      fetchTouristPlaces(geoData.lat, geoData.lng, location)
    ]);

    // 3. Ensure minimum data (fallbacks)
    if (hotels.length < 3) {
      console.log("⚠️ Adding fallback hotels...");
      const fallbackData = getFallbackData(location, days, budget);

      // Add missing hotels from fallback
      while (hotels.length < 3) {
        const nextFallback = fallbackData.hotels[hotels.length] || fallbackData.hotels[0];
        // Ensure unique ID/key if possible, or just push
        hotels.push({
          ...nextFallback,
          hotelName: `${nextFallback.hotelName} (Recommended)`,
          imageUrl: await fetchPlaceImage(nextFallback.hotelName, location, 'hotel') // Try to fetch real image for fallback too
        });
      }
    }

    // 4. Create Smart Itinerary using Gemini AI for Day Planning
    const itinerary = await createSmartItinerary(allPlaces, hotels, days, location, traveler, budget);

    // 5. Fetch Destination Photo
    const photoUrl = await fetchPlaceImage(location, location, 'city');

    // 6. Final Result
    const result = {
      locationInfo: {
        ...geoData,
        photoUrl
      },
      hotels: hotels.slice(0, 5), // Top 5 hotels
      itinerary,
      generatedAt: new Date().toISOString()
    };

    console.log("✅ Trip Generated Successfully!");
    console.log("=".repeat(60));
    return result;

  } catch (error) {
    console.error("❌ Trip generation failed:", error);
    // Return a well-structured fallback
    return getFallbackData(location, days, budget);
  }
}

// --- 6. AI-POWERED SMART ITINERARY PLANNER ---
async function createSmartItinerary(places, hotels, days, location, traveler, budget) {
  // If we have Gemini, use it to intelligently group places by day
  const prompt = `
    Generate a highly detailed and optimized ${days}-day travel itinerary for a ${traveler} visiting ${location} with a ${budget} budget.
    ${traveler === 'Community' ? 'Special Instruction: This is an OPEN COMMUNITY group trip. Focus on activities that are group-friendly, socially engaging, and suitable for meeting new people (e.g., group tours, shared dinners, interactive events, safe public spaces).' : ''}
    
    The Output must be a valid JSON object.
    
    Here is a list of real landmarks we found in our database: ${places.length > 0 ? places.map(p => p.placeName).join(', ') : 'NONE FOUND'}.
    
    CRITICAL INSTRUCTIONS:
    1. If the list above is empty, you MUST use your own internal knowledge to provide REAL, FAMOUS tourist landmarks in ${location}. 
    2. USE ACTUAL NAMES ONLY. Every place name in your itinerary MUST be a real, recognizable place that a tourist would visit in ${location}. 
    3. NEVER use generic placeholders, index numbers, or labels like "Discovery", "Hub", or "Attraction" as names.
    4. Provide specific details, visit times, and costs in Indian Rupees (₹) for each real location.

    Example of desired placeName: "The Eiffel Tower", "Central Park", "Colosseum", "India Gate".

    Structure exactly like this:
    {
      "itinerary": [
        {
          "day": 1,
          "theme": "Theme Label",
          "area": "Main Area",
          "suggestedHotel": "${hotels[0]?.hotelName || 'Grand Hotel'}",
          "totalTime": "8h",
          "totalExpense": "Approx INR (₹)",
          "places": [
            {
              "placeName": "Actual Real Famous Landmark",
              "details": "Real description of why it's famous",
              "visitTime": "10:00 AM",
              "duration": "2h",
              "estimatedCost": "₹500",
              "nearbyTip": "Pro tip here"
            }
          ]
        }
      ]
    }
  `;

  try {
    // UPDATED MODEL NAME
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    let text = result.response.text();

    // Clean JSON if AI wraps it in markdown code blocks
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const data = JSON.parse(text);
    let aiItinerary = data.itinerary || data;

    // --- STRIKE 1: Placeholder Validation ---
    const hasPlaceholders = JSON.stringify(aiItinerary).toLowerCase().includes('local attraction') ||
      JSON.stringify(aiItinerary).toLowerCase().includes('activity 1');

    if (hasPlaceholders) {
      console.warn("Detected placeholders in AI response, retrying with stricter enforcement...");
      const retryPrompt = `${prompt}\n\nERROR: Your previous response contained generic names like "Local Attraction". 
      I REPEAT: DO NOT USE PLACEHOLDERS. Use ACTUAL FAMOUS NAMES of real landmarks in ${location} from your training data. 
      Example: If in Agra, use "Taj Mahal", not "Local Attraction".`;

      const retryResult = await model.generateContent(retryPrompt);
      let retryText = retryResult.response.text();
      retryText = retryText.replace(/```json/g, "").replace(/```/g, "").trim();
      const retryData = JSON.parse(retryText);
      aiItinerary = retryData.itinerary || retryData;
    }

    // Map AI suggestions back to our full place objects and enrich with AI details
    return aiItinerary.map(dayPlan => ({
      day: dayPlan.day,
      theme: dayPlan.theme,
      area: dayPlan.area || "Mixed",
      suggestedHotel: dayPlan.suggestedHotel || "Recommended Stay",
      totalTime: dayPlan.totalTime || "8h",
      totalExpense: dayPlan.totalExpense || "Varies",
      places: dayPlan.places
        .map((p, idx) => {
          const original = places.find(orig => orig.placeName.toLowerCase() === p.placeName.toLowerCase());

          // If we still have a placeholder despite all warnings, let's at least name it after the city
          let finalName = p.placeName;
          if (finalName.toLowerCase().includes('local attraction')) {
            finalName = `${location} Landmark ${idx + 1}`;
          }

          return {
            placeName: finalName,
            details: original?.details || p.details || `Discover the amazing history and culture of ${finalName} in ${location}.`,
            imageUrl: original?.imageUrl || `https://loremflickr.com/800/600/${encodeURIComponent(finalName.toLowerCase())},landmark`,
            geoCoordinates: original?.geoCoordinates || { lat: 0, lng: 0 },
            ticketPricing: original?.ticketPricing || p.estimatedCost || 'Free',
            rating: original?.rating || (4.0 + Math.random() * 0.9).toFixed(1),
            travelTime: original?.travelTime || "20-30 min",
            bestTimeToVisit: original?.bestTimeToVisit || "Morning",
            visitTime: p.visitTime,
            duration: p.duration,
            estimatedCost: p.estimatedCost,
            nearbyTip: p.nearbyTip
          };
        })
    }));
  } catch (aiError) {
    console.log("AI planning failed, using default grouping", aiError);
    // Fallback to simple distribution
    return defaultItineraryGrouping(places, days, location);
  }
}

// --- 7. DEFAULT ITINERARY GROUPING (Fallback) ---
function defaultItineraryGrouping(places, days, location) {
  const placesPerDay = Math.max(3, Math.ceil(places.length / days));
  const itinerary = [];

  for (let i = 0; i < days; i++) {
    const start = i * placesPerDay;
    const end = Math.min(start + placesPerDay, places.length);
    let dayPlaces = places.slice(start, end);

    // If we absolutely have no real places left, don't use "Local Attraction"
    // Instead, use location-specific naming that sounds better, but prioritize real results
    if (dayPlaces.length === 0 && places.length > 0) {
      dayPlaces = [places[i % places.length]]; // Reuse a real place if necessary
    }

    itinerary.push({
      day: i + 1,
      theme: `Exploring ${location} - Part ${i + 1}`,
      places: dayPlaces
    });
  }

  return itinerary;
}

// --- 8. FALLBACK DATA FUNCTION ---
function getFallbackData(location, days, budget) {
  const cityImage = `https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop`; // Beautiful mountain/landscape
  const hotelImage = `https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop`; // Generic luxury hotel
  const attractionImage = `https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=800&auto=format&fit=crop`; // Generic nature attraction

  return {
    locationInfo: {
      lat: 40.7128,
      lng: -74.0060,
      displayName: location,
      type: 'city',
      photoUrl: cityImage
    },
    hotels: [
      {
        hotelName: `${location} Grand Hotel`,
        address: `123 Main Street, ${location}`,
        price: getPriceForBudget(budget),
        imageUrl: hotelImage,
        geoCoordinates: { lat: 40.7128, lng: -74.0060 },
        rating: '4.3',
        description: 'Comfortable accommodation with modern amenities'
      },
      {
        hotelName: `${location} Plaza Hotel`,
        address: `456 Central Avenue, ${location}`,
        price: getPriceForBudget(budget),
        imageUrl: hotelImage,
        geoCoordinates: { lat: 40.7589, lng: -73.9851 },
        rating: '4.1',
        description: 'Central location with excellent service'
      },
      {
        hotelName: `${location} Boutique Inn`,
        address: `789 Tourist Road, ${location}`,
        price: getPriceForBudget(budget),
        imageUrl: hotelImage,
        geoCoordinates: { lat: 40.7489, lng: -73.9680 },
        rating: '4.0',
        description: 'Charming boutique hotel experience'
      }
    ],
    itinerary: Array.from({ length: days }, (_, i) => ({
      day: i + 1,
      theme: `Day ${i + 1} Discovery`,
      area: 'Downtown',
      totalTime: '8h',
      totalExpense: budget === 'Cheap' ? '40' : '100',
      places: [
        {
          placeName: `${location} Central Hub`,
          details: 'The beating heart of the city.',
          imageUrl: attractionImage,
          geoCoordinates: { lat: 40.7829, lng: -73.9654 },
          visitTime: '10:00 AM',
          duration: '2h',
          estimatedCost: '₹800',
          nearbyTip: 'Great local coffee shops are just around the corner.',
          rating: '4.5',
          travelTime: '15 min'
        },
        {
          placeName: `${location} Cultural Museum`,
          details: 'A deep dive into local heritage.',
          imageUrl: attractionImage,
          geoCoordinates: { lat: 40.7614, lng: -73.9776 },
          visitTime: '1:00 PM',
          duration: '3h',
          estimatedCost: '₹2000',
          nearbyTip: 'The rooftop terrace has the best views.',
          rating: '4.3',
          travelTime: '20 min'
        }
      ]
    })),
    generatedAt: new Date().toISOString()
  };
}

// --- 9. PRICE HELPER ---
function getPriceForBudget(budget) {
  if (budget === 'Cheap') return '₹4000-₹8000 per night';
  if (budget === 'Mid-range') return '₹8000-₹16000 per night';
  if (budget === 'Luxury') return '₹16000-₹40000 per night';
  return '₹8000-₹16000 per night';
}