import { useEffect, useState } from 'react'
import { Calendar, MapPin, Compass, Briefcase, Users, ArrowRight, Sparkles, Wand2, ArrowLeft, Globe, Zap, Clock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import NominatimAutocomplete from '../components/NominatimAutocomplete'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { SelectBudgetOptions, SelectTravelersList } from '../constants/options'
import { generateTripPlan } from '../service/AIModel'
import { useToast } from '../components/ui/toast'
import { useAuth } from '../context/AuthContext'
import api from '../service/api'
import TravelLoader from '../components/custom/TravelLoader'

function CreateTrip() {
  const [selectedBudget, setSelectedBudget] = useState(null)
  const [selectedTraveler, setSelectedTraveler] = useState(null)
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(false)

  const { toast } = useToast()
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()

  useEffect(() => {
    if (!authLoading && !user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access the AI trip planner.",
        variant: "destructive"
      });
      navigate('/login');
    }
  }, [user, authLoading, navigate, toast]);

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end >= start) {
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        setFormData(prev => ({ ...prev, noOfDays: diffDays }));
      }
    }
  }, [formData.startDate, formData.endDate]);

  const GenerateTrip = async () => {
    if (!user) {
      toast({ title: "Login Required", description: "Please sign in to generate your AI trip plan.", variant: "destructive" });
      navigate('/login');
      return;
    }

    if (!formData?.location || !formData?.budget || !formData?.traveler || !formData?.noOfDays || formData.noOfDays > 15) {
      toast({ title: "Incomplete Details", description: "Please provide all details. Plan up to 15 days.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const fullLocationName = formData.location.display_name || formData.location.name || formData.location;
      const cleanLocationName = fullLocationName.split(',')[0].trim();

      const tripData = await generateTripPlan(cleanLocationName, formData.noOfDays, formData.budget, formData.traveler);

      if (!tripData || !Array.isArray(tripData.hotels)) throw new Error("AI generation failed. Please try again.");

      const saveResponse = await api.post('/trips', {
        destination: fullLocationName,
        tripData: tripData,
        duration: formData.noOfDays,
        budget: formData.budget,
        price: formData.price || 0,
        requestOrganiser: formData.requestOrganiser || false,
        startDate: formData.startDate,
        endDate: formData.endDate
      });

      toast({ title: "Trip Generated!", description: "Your AI-powered itinerary is ready.", type: "success" });
      navigate('/view-trip/' + saveResponse.data._id);
    } catch (err) {
      toast({ title: "Generation Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-white/20 font-inter relative overflow-x-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-[800px] bg-linear-to-b from-blue-500/10 via-transparent to-transparent pointer-events-none opacity-50"></div>

      {(loading || authLoading) && <TravelLoader />}

      {authLoading ? (
        <div className="flex h-screen items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-white/10 border-t-white rounded-full animate-spin"></div>
            <p className="font-urbanist font-black text-[10px] uppercase tracking-[0.5em] text-gray-500">Synchronizing Credentials</p>
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-10 relative z-10">
          {/* Simple Navigation */}
          <button onClick={() => navigate(-1)} className="group flex items-center gap-2 text-gray-400 hover:text-white transition-all text-[11px] font-bold tracking-widest cursor-pointer mb-8">
            <ArrowLeft className="w-4 h-4" />
            BACK
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 items-start">

            {/* Form Side */}
            <div className="lg:col-span-8 space-y-16 sm:space-y-24">
              <header className="space-y-4 sm:space-y-6">
                <h1 className="text-[34px] xs:text-[42px] sm:text-[60px] lg:text-[86px] font-urbanist font-bold text-white leading-[1] sm:leading-[0.95] tracking-tighter">
                  Plan your dream <br />
                  <span className="text-gray-500 italic">trip in seconds.</span>
                </h1>
                <p className="text-[14px] sm:text-lg text-gray-400 font-medium max-w-xl leading-relaxed">
                  Provide your preferences and let our advanced AI build a premium, tailored itinerary for your next adventure.
                </p>
              </header>

              <div className="space-y-24">
                {/* Destination */}
                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    <h2 className="text-[14px] font-black uppercase tracking-[0.2em] text-white">Where are you going?</h2>
                  </div>
                  <div className="bg-[#0a0a0a] border border-white/10 rounded-sm focus-within:border-white/30 transition-all p-1">
                    <NominatimAutocomplete onChange={(item) => handleInputChange('location', item)} />
                  </div>
                </div>

                {/* Schedule */}
                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    <h2 className="text-[14px] font-black uppercase tracking-[0.2em] text-white">When are you going?</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Arrival Date</span>
                      <div className="relative group">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-white transition-colors" />
                        <input
                          type="date"
                          onChange={(e) => handleInputChange('startDate', e.target.value)}
                          className="w-full h-12 bg-[#0a0a0a] border border-white/10 rounded-sm pl-12 pr-4 text-[13px] font-bold text-white [color-scheme:dark] outline-none focus:border-white/40 transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Departure Date</span>
                      <div className="relative group">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-white transition-colors" />
                        <input
                          type="date"
                          onChange={(e) => handleInputChange('endDate', e.target.value)}
                          className="w-full h-12 bg-[#0a0a0a] border border-white/10 rounded-sm pl-12 pr-4 text-[13px] font-bold text-white [color-scheme:dark] outline-none focus:border-white/40 transition-all"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Budget */}
                <div className="space-y-8 sm:space-y-10">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    <h2 className="text-[12px] sm:text-[14px] font-black uppercase tracking-[0.2em] text-white">What is your budget?</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {SelectBudgetOptions.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => { setSelectedBudget(index); handleInputChange('budget', item.title); }}
                        className={`p-6 sm:p-10 text-left transition-all border rounded-sm outline-none cursor-pointer group ${selectedBudget === index ? 'bg-white border-white text-black scale-[1.02] shadow-2xl' : 'bg-transparent border-white/10 hover:bg-white/[0.03] text-white'}`}
                      >
                        <div className="text-3xl sm:text-4xl mb-6 sm:mb-8 group-hover:scale-110 transition-transform">{item.icon}</div>
                        <h3 className="font-urbanist font-black text-[16px] sm:text-[18px] uppercase tracking-wider mb-2">{item.title}</h3>
                        <p className={`text-[11px] sm:text-[12px] leading-relaxed font-semibold transition-colors ${selectedBudget === index ? 'text-black/60' : 'text-gray-500'}`}>{item.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Party */}
                <div className="space-y-8 sm:space-y-10">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    <h2 className="text-[12px] sm:text-[14px] font-black uppercase tracking-[0.2em] text-white">Who is traveling?</h2>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
                    {SelectTravelersList.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => { setSelectedTraveler(index); handleInputChange('traveler', item.title); }}
                        className={`p-5 sm:p-8 text-center transition-all border rounded-sm outline-none cursor-pointer group ${selectedTraveler === index ? 'bg-white border-white text-black scale-[1.05] shadow-2xl' : 'bg-transparent border-white/10 hover:bg-white/[0.03] text-white'}`}
                      >
                        <div className="text-2xl sm:text-3xl mb-3 sm:mb-4 group-hover:rotate-12 transition-transform">{item.icon}</div>
                        <h3 className="font-urbanist font-black text-[10px] sm:text-[11px] uppercase tracking-widest">{item.title}</h3>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Summary Area */}
            <div className="lg:col-span-4 h-fit sticky top-24">
              <div className="bg-[#0a0a0a] border border-white/10 p-8 sm:p-12 rounded-sm space-y-10 sm:space-y-12 shadow-2xl overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity duration-1000 rotate-12">
                  <Globe className="w-32 h-32 sm:w-48 h-48" />
                </div>

                <div className="space-y-3 relative z-10">
                  <h3 className="text-[13px] font-black uppercase tracking-[0.4em] text-white">Trip Summary</h3>
                  <div className="w-12 h-1 bg-white"></div>
                </div>

                <div className="space-y-10 relative z-10">
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Destination</span>
                    <span className="text-[14px] font-bold text-white truncate max-w-full italic">{formData.location?.display_name?.split(',')[0] || formData.location?.name || 'Destination not set'}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Duration</span>
                      <span className="text-[14px] font-bold text-white uppercase">{formData.noOfDays ? `${formData.noOfDays} DAYS` : '---'}</span>
                    </div>
                    <div className="flex flex-col gap-2 text-right">
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Group</span>
                      <span className="text-[14px] font-bold text-white uppercase">{formData.traveler || '---'}</span>
                    </div>
                  </div>
                </div>

                {user?.role === 'organiser' && (
                  <div className="pt-10 border-t border-white/5 space-y-8 relative z-10">
                    <div className="flex items-center justify-between p-5 bg-white/5 border border-white/10 rounded-sm">
                      <div className="flex flex-col gap-1">
                        <span className="text-[11px] font-black uppercase tracking-widest text-emerald-500 flex items-center gap-2">
                          <Zap className="w-3 h-3 fill-emerald-500" /> Organiser Mode
                        </span>
                        <span className="text-[9px] font-bold text-gray-600 uppercase tracking-tighter">List this trip for others</span>
                      </div>
                      <input
                        type="checkbox"
                        className="w-5 h-5 accent-emerald-500 cursor-pointer"
                        onChange={(e) => handleInputChange('requestOrganiser', e.target.checked)}
                      />
                    </div>
                    <div className="space-y-2">
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Proposed Price</span>
                      <input
                        type="number"
                        placeholder="ENTER PRICE (INR)"
                        className="w-full h-14 bg-black border border-white/10 rounded-sm px-5 text-sm font-bold outline-none focus:border-white/40 transition-colors"
                        onChange={(e) => handleInputChange('price', e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-4 relative z-10">
                  <button
                    onClick={GenerateTrip}
                    disabled={loading}
                    className="w-full h-20 bg-white hover:bg-gray-200 text-black rounded-sm font-urbanist font-black text-[18px] uppercase tracking-widest flex items-center justify-center gap-4 transition-all cursor-pointer active:scale-[0.98] disabled:opacity-50 shadow-xl"
                  >
                    {loading ? "Planning..." : "Generate Trip"}
                    <ArrowRight className="w-6 h-6" />
                  </button>

                  <div className="flex items-center justify-center gap-3 opacity-40">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-black uppercase tracking-[0.5em]">SYSTEM READY</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}

export default CreateTrip
