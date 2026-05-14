import React, { useState, useEffect } from "react";
import { TourPackage } from "../types";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";
import { toast } from "react-toastify";
import { GoogleGenAI, Type } from "@google/genai";
import { Sparkles, Plus, Trash2 } from "lucide-react";

interface Props {
  initialData?: TourPackage | null;
  onClose: () => void;
}

export default function PackageForm({ initialData, onClose }: Props) {
  const [formData, setFormData] = useState<Partial<TourPackage>>({
    title: '',
    description: '',
    duration: '',
    price: 0,
    image: '',
    category: '',
    baseCamp: '',
    altitude: '',
    grade: '',
    stay: '',
    distance: '',
    eligibilityAge: '',
    fitness: '',
    healthAwareness: '',
    meals: '',
    includes: [],
    itinerary: [],
  });
  
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleGenerateItinerary = async () => {
    if (!formData.title || !formData.duration) {
      toast.error("Title and Duration are required to generate an itinerary.");
      return;
    }
    
    setIsGenerating(true);
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Create a detailed daily itinerary for a tour package named "${formData.title}".
The duration of the tour is ${formData.duration}.
Category: ${formData.category || 'Trekking'}.
Base Camp: ${formData.baseCamp || 'Not specified'}.
Provide a JSON array where each object has "day", "title", and "activities" fields.
Make sure "activities" is a described in detail.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.INTEGER },
                title: { type: Type.STRING },
                activities: { type: Type.STRING },
              },
              required: ["day", "title", "activities"]
            }
          }
        }
      });
      
      const text = response.text;
      if (text) {
        const parsed = JSON.parse(text);
        setFormData(prev => ({
          ...prev,
          itinerary: parsed
        }));
        toast.success("Itinerary generated successfully!");
      }
    } catch (e: any) {
      console.error(e);
      toast.error("Failed to generate itinerary. " + (e.message || ''));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleItineraryChange = (index: number, field: string, value: string | number) => {
    setFormData(prev => {
      const newItinerary = [...(prev.itinerary || [])];
      newItinerary[index] = { ...newItinerary[index], [field]: value };
      return { ...prev, itinerary: newItinerary };
    });
  };

  const addItineraryDay = () => {
    setFormData(prev => ({
      ...prev,
      itinerary: [...(prev.itinerary || []), { day: (prev.itinerary?.length || 0) + 1, title: '', activities: '' }]
    }));
  };

  const removeItineraryDay = (index: number) => {
    setFormData(prev => ({
      ...prev,
      itinerary: prev.itinerary?.filter((_, i) => i !== index)
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'price' ? Number(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let pkgId = initialData?.id || '';
      if (!pkgId) {
        pkgId = formData.title ? formData.title.toLowerCase().replace(/[^a-z0-9\-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') : '';
        if (!pkgId) pkgId = Date.now().toString();
      }
      
      const payload = {
        title: formData.title || '',
        description: formData.description || '',
        duration: formData.duration || '',
        price: typeof formData.price === 'number' && !isNaN(formData.price) ? formData.price : 0,
        image: formData.image || '',
        category: formData.category || '',
        baseCamp: formData.baseCamp || '',
        altitude: formData.altitude || '',
        grade: formData.grade || '',
        stay: formData.stay || '',
        distance: formData.distance || '',
        eligibilityAge: formData.eligibilityAge || '',
        fitness: formData.fitness || '',
        healthAwareness: formData.healthAwareness || '',
        meals: formData.meals || '',
        includes: typeof formData.includes === 'string' 
          ? formData.includes.split(',').map(s => s.trim()).filter(Boolean)
          : (formData.includes || []),
        itinerary: formData.itinerary || [],
        id: pkgId
      };
      
      console.log("PAYLOAD BEING SENT TO FIRESTORE:", JSON.stringify(payload, null, 2));

      await setDoc(doc(db, "packages", pkgId), payload, { merge: true });
      
      toast.success(initialData ? "Package updated successfully!" : "Package created successfully!");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Error saving package");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex justify-center p-4 md:p-6 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl p-6 md:p-8 relative mx-auto my-auto h-fit mt-12 md:mt-16 mb-12">
        <button onClick={onClose} className="absolute top-4 right-4 md:top-6 md:right-6 text-gray-400 hover:text-black font-bold">Close X</button>
        <h2 className="text-3xl font-black uppercase tracking-tight mb-8">{initialData ? 'Edit Package' : 'Add New Package'}</h2>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Title</label>
            <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full border border-gray-200 rounded-md p-3" />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Description</label>
            <textarea required name="description" value={formData.description} onChange={handleChange} className="w-full border border-gray-200 rounded-md p-3 h-24" />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Duration</label>
            <select required name="duration" value={formData.duration} onChange={handleChange} className="w-full border border-gray-200 rounded-md p-3">
              <option value="">Select Duration</option>
              <option value="5 Days">5 Days</option>
              <option value="6 Days">6 Days</option>
              <option value="7 Days">7 Days</option>
              <option value="8 Days">8 Days</option>
              <option value="10 Days">10 Days</option>
              <option value="12 Days">12 Days</option>
              <option value="14 Days">14 Days</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Price (Costing)</label>
            <input required type="number" name="price" value={formData.price} onChange={handleChange} min="0" className="w-full border border-gray-200 rounded-md p-3" />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Category</label>
            <select required name="category" value={formData.category} onChange={handleChange} className="w-full border border-gray-200 rounded-md p-3">
              <option value="">Select Category</option>
              <option value="Pilgrimage">Pilgrimage</option>
              <option value="Trekking">Trekking</option>
              <option value="Adventure">Adventure</option>
              <option value="Cultural">Cultural</option>
            </select>
          </div>
          
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Image URL</label>
            <input required type="text" name="image" value={formData.image} onChange={handleChange} className="w-full border border-gray-200 rounded-md p-3" />
          </div>

          {/* New Fields */}
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Base Camp Location</label>
            <input type="text" name="baseCamp" value={formData.baseCamp || ''} onChange={handleChange} className="w-full border border-gray-200 rounded-md p-3" />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Altitude</label>
            <input type="text" name="altitude" value={formData.altitude || ''} onChange={handleChange} className="w-full border border-gray-200 rounded-md p-3" />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Grade (Difficulty)</label>
            <select name="grade" value={formData.grade || ''} onChange={handleChange} className="w-full border border-gray-200 rounded-md p-3">
              <option value="">Select Grade</option>
              <option value="Easy">Easy</option>
              <option value="Moderate">Moderate</option>
              <option value="Hard">Hard</option>
              <option value="Extreme">Extreme</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Accommodation / Stay</label>
            <select name="stay" value={formData.stay || ''} onChange={handleChange} className="w-full border border-gray-200 rounded-md p-3">
              <option value="">Select Stay</option>
              <option value="Hotels / Guesthouses">Hotels / Guesthouses</option>
              <option value="Tent / Camps">Tent / Camps</option>
              <option value="Homestays">Homestays</option>
              <option value="Mixed (Hotels & Camps)">Mixed (Hotels & Camps)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Trekking Distance</label>
            <input type="text" name="distance" value={formData.distance || ''} onChange={handleChange} placeholder="e.g. 25 KM total" className="w-full border border-gray-200 rounded-md p-3" />
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Eligibility Age</label>
            <select name="eligibilityAge" value={formData.eligibilityAge || ''} onChange={handleChange} className="w-full border border-gray-200 rounded-md p-3">
              <option value="">Select Age</option>
              <option value="10-55 Yrs">10-55 Yrs</option>
              <option value="15-55 Yrs">15-55 Yrs</option>
              <option value="18-50 Yrs">18-50 Yrs</option>
              <option value="Any Age">Any Age</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Fitness / Weight Requirements</label>
            <select name="fitness" value={formData.fitness || ''} onChange={handleChange} className="w-full border border-gray-200 rounded-md p-3">
              <option value="">Select Fitness</option>
              <option value="Basic Fitness">Basic Fitness</option>
              <option value="Moderate Physical Fitness">Moderate Physical Fitness</option>
              <option value="Excellent Fitness">Excellent Fitness</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Meals (Veg/Non-Veg)</label>
            <select name="meals" value={formData.meals || ''} onChange={handleChange} className="w-full border border-gray-200 rounded-md p-3">
              <option value="">Select Meals</option>
              <option value="Veg">Veg Only</option>
              <option value="Veg & Non-Veg">Veg & Non-Veg</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Health & Awareness Guidelines</label>
            <textarea name="healthAwareness" value={formData.healthAwareness || ''} onChange={handleChange} className="w-full border border-gray-200 rounded-md p-3 h-24" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">What's Included (Comma-separated)</label>
            <textarea name="includes" value={Array.isArray(formData.includes) ? formData.includes.join(', ') : (formData.includes || '')} onChange={(e) => setFormData(prev => ({ ...prev, includes: e.target.value as any }))} className="w-full border border-gray-200 rounded-md p-3 h-24" placeholder="Breakfast, Hotel Stay, Transport, Sightseeing..." />
          </div>

          <div className="md:col-span-2 border-t pt-6 mt-2">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
              <label className="text-sm font-black uppercase tracking-widest text-gray-800">Detailed Itinerary</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleGenerateItinerary}
                  disabled={isGenerating}
                  className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-md font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  <Sparkles size={16} />
                  {isGenerating ? "Generating..." : "Generate AI Itinerary"}
                </button>
                <button
                  type="button"
                  onClick={addItineraryDay}
                  className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-md font-bold text-xs uppercase tracking-wider hover:bg-gray-200 transition-colors"
                >
                  <Plus size={16} />
                  Add Day
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {formData.itinerary?.map((dayObj, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50 relative group">
                  <button
                    type="button"
                    onClick={() => removeItineraryDay(index)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors z-10"
                  >
                    <Trash2 size={18} />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Day</label>
                      <input 
                        type="number" 
                        value={dayObj.day} 
                        onChange={(e) => handleItineraryChange(index, 'day', Number(e.target.value))} 
                        className="w-full border border-gray-200 rounded-md p-2 text-sm" 
                      />
                    </div>
                    <div className="md:col-span-10">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Title</label>
                      <input 
                        type="text" 
                        value={dayObj.title} 
                        onChange={(e) => handleItineraryChange(index, 'title', e.target.value)} 
                        className="w-full border border-gray-200 rounded-md p-2 text-sm" 
                        placeholder="Arrival in Base Camp"
                      />
                    </div>
                    <div className="md:col-span-12">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Activities</label>
                      <textarea 
                        value={dayObj.activities} 
                        onChange={(e) => handleItineraryChange(index, 'activities', e.target.value)} 
                        className="w-full border border-gray-200 rounded-md p-2 h-20 text-sm" 
                        placeholder="Detailed description of the day's events..."
                      />
                    </div>
                  </div>
                </div>
              ))}
              {(!formData.itinerary || formData.itinerary.length === 0) && (
                <div className="text-center py-8 text-gray-400 text-sm">
                  No itinerary days added yet. Click "Generate AI Itinerary" or "Add Day".
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-2 flex justify-end gap-4 mt-6">
            <button type="button" onClick={onClose} className="px-6 py-3 font-bold text-gray-500 hover:bg-gray-100 rounded-md transition-colors">Cancel</button>
            <button type="submit" className="px-6 py-3 bg-primary text-white font-bold rounded-md hover:bg-primary-dark transition-colors shadow-lg">Save Package</button>
          </div>
        </form>
      </div>
    </div>
  );
}
