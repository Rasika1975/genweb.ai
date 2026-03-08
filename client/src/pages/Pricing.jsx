import React from 'react'
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import axios from 'axios';
import { serverUrl } from '../App';

const plans = [
  {
    key: "free",
    name: "Free",
    price: "₹0",
    description: "Perfect to explore GenWeb.ai",
    features: [
      "100 credits",
      "AI website generation",
      "Responsive HTML output",
      "Basic animations",
    ],
    popular: false,
    button: "Get Started",
  },
  {
    key: "pro",
    name: "Pro",
    price: "₹499",
    description: "For serious creators & freelancers",
    features: [
      "500 credits",
      "Everything in Free",
      "Faster generation",
      "Edit & regenerate",
    ],
    popular: true,
    button: "Upgrade to Pro",
  },
  {
    key: "enterprise",
    name: "Enterprise",
    price: "₹1499",
    description: "For teams & power users",
    features: [
      "1000 credits",
      "Everything in Pro",
      "Highest priority generation",
      "Team collaboration features",
      "Dedicated support"
    ],
    popular: false,
    button: "Contact Sales",
  },
];
function Pricing() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  const handlePlanSelect = async (plan) => {
    if (!userData) {
      alert("Please login first.");
      navigate("/");
      return;
    }

    if (plan.key === "free") {
      try {
        const response = await axios.post(`${serverUrl}/api/user/update-credits`, { credits: 100 }, { withCredentials: true });

        if (response.data.success) {
          dispatch(setUserData(response.data.user));
          alert("Free plan activated! 100 Credits added.");
          navigate("/generate");
        } else {
          alert("Failed to activate plan. Please try again.");
        }
      } catch (error) {
        console.error("Failed to sync credits:", error);
        alert("Error updating credits. Please try again.");
      }
    } else {
      alert("Payment gateway integration required for this plan.");
    }
  };

  return (
    <div className='min-h-screen bg-[#040404] text-white p-6 sm:p-10 overflow-hidden'>
      <button
        className="relative z-10 mb-8 flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition"
        onClick={() => navigate("/")}
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 max-w-4xl mx-auto text-center mb-14"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Simple, transparent pricing
        </h1>

        <p className="text-zinc-400 text-lg">
          Buy credits once. Build anytime.
        </p>
      </motion.div>
      <div className='relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8'>
        {plans.map((plan, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.12 }}
            whileHover={{ y: -14, scale: 1.03 }}
            className={`relative rounded-3xl p-8 border backdrop-blur-xl transition-all ${plan.popular
              ? "border-indigo-500 bg-gradient-to-b from-indigo-500/20 to-transparent shadow-2xl shadow-indigo-500/30"
              : "border-white/10 bg-white/5 hover:border-indigo-400"
              }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <div className="px-4 py-1.5 rounded-full bg-indigo-500 text-white text-sm font-semibold">
                  Most Popular
                </div>
              </div>
            )}
            <h2 className="text-2xl font-semibold mb-2">{plan.name}</h2>
            <p className="text-zinc-400 mb-6">{plan.description}</p>

            <div className="mb-8">
              <span className="text-5xl font-bold">{plan.price}</span>
              {plan.key !== 'free' && <span className="text-zinc-400">/month</span>}
            </div>

            <ul className="space-y-3 mb-8">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-indigo-400" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button 
              onClick={() => handlePlanSelect(plan)}
              className={`w-full py-3 rounded-lg transition font-semibold ${plan.popular ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-white/10 hover:bg-white/20'}`}
            >
              {plan.button}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
export default Pricing
