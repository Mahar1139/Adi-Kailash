import { TourPackage } from "../types";

export const SAMPLE_PACKAGES: TourPackage[] = [
  {
    id: "adi-kailash-yatra-7d",
    title: "Adi Kailash Yatra",
    description: "A divine 7-day journey to the spiritual heart of the Himalayas.",
    duration: "7 Days",
    price: 28999,
    image: "https://images.unsplash.com/photo-1544735038-735b023f613e?q=80&w=1200",
    category: "Pilgrimage",
    includes: ["Accommodation", "Meals", "Transport", "Guide", "Permits"],
    itinerary: [
      { day: 1, title: "Arrival at Dharchula", activities: "Meet and greet at Dharchula. Check into homestay/hotel." },
      { day: 2, title: "Dharchula to Gunji", activities: "Drive through scenic mountain roads to reach Gunji village." },
      { day: 3, title: "Gunji to Adi Kailash Base", activities: "Early morning trek/drive to Jolingkong for Adi Kailash darshan." },
      { day: 4, title: "Om Parvat Darshan", activities: "Visit Nabhidhang for the majestic view of Om Parvat." },
      { day: 5, title: "Narayan Ashram Visit", activities: "Return via Narayan Ashram and experience its serene atmosphere." },
      { day: 6, title: "Return to Dharchula", activities: "Descent back to Dharchula, evening local exploration." },
      { day: 7, title: "Departure", activities: "End of journey, departure for onwards destination." }
    ]
  },
  {
    id: "om-parvat-tour-5d",
    title: "Om Parvat Tour",
    description: "Witness the mystical Om sign formed by nature in snow.",
    duration: "5 Days",
    price: 19999,
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200",
    category: "Short Tour",
    includes: ["Meals", "Transport", "Guide", "Permits"],
    itinerary: [
      { day: 1, title: "Arrival at Dharchula", activities: "Briefing and permit collection." },
      { day: 2, title: "Dharchula to Gunji", activities: "Long mountain drive with breath-taking views." },
      { day: 3, title: "Om Parvat Darshan", activities: "Sacred darshan of Om Parvat at Nabhidhang." },
      { day: 4, title: "Return to Dharchula", activities: "Journey back to base." },
      { day: 5, title: "Departure", activities: "Farewell and departure." }
    ]
  },
  {
    id: "full-spiritual-circuit-10d",
    title: "Full Spiritual Circuit",
    description: "The ultimate Himalayan spiritual experience covering all major points.",
    duration: "10 Days",
    price: 42999,
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200",
    category: "Expedition",
    includes: ["Luxury Stay", "All Meals", "Premium Transport", "expert Guide", "VIP Permits"],
    itinerary: [
      { day: 1, title: "Arrive Dharchula", activities: "Welcome ceremony." },
      { day: 2, title: "Trek to Malpa", activities: "Initial trekking phase." },
      { day: 3, title: "Reach Gunji", activities: "Acclimatization day." },
      { day: 4, title: "Adi Kailash Darshan", activities: "Full day at Jolingkong." },
      { day: 5, title: "Parvati Tal", activities: "Spiritual rituals at the sacred lake." },
      { day: 6, title: "Om Parvat", activities: "Visit Nabhidhang." },
      { day: 7, title: "Lipulekh Pass", activities: "Visit the historical pass (subject to permits)." },
      { day: 8, title: "Narayan Ashram", activities: "Quiet time at the ashram." },
      { day: 9, title: "Dharchula Return", activities: "Celebratory dinner." },
      { day: 10, title: "Departure", activities: "End of circuit." }
    ]
  }
];
