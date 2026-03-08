import React from "react";
import { motion } from "motion/react";
import { setUserData } from "../redux/userSlice";
import LoginModal from "../components/LoginModal";
import { useDispatch, useSelector } from "react-redux";
import { Coins } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";


function Home() {
  const navigate = useNavigate();
  const highlights = [
    "AI Generated code",
    "Fully responsive designs",
    "Production ready code",
  ];

  const [openLogin, setOpenLogin] = React.useState(false);
  const { userData } = useSelector((state) => state.user);
  const [openProfile,setOpenProfile] = React.useState(false);
  const dispatch = useDispatch();
  const handleLogOut=async () =>{

    try{
         await axios.get(`$(serverUrl)/api/auth/logout`,{withCredentials:true});
         dispatch(setUserData(null))
         setOpenProfile(false)
    }
    catch(error)
    {
         console.log(error)
    }
  }

  return (
    <div className="relative min-h-screen bg-[#040404] text-white overflow-hidden">
      
      {/* Navbar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-lg font-semibold">
            GenWeb.ai
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:inline text-sm text-zinc-400 hover:text-white transition cursor-pointer" onClick={()=>navigate("/pricing")}>
              Pricing
            </div> 
            {userData && <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/30 text-sm cursor-pointer hover:bg-white/30 transition">
              <Coins size={16} className="text-yellow-400"/>
              <span className="text-zinc-300">Credits</span>
              <span>{userData.credits}</span>
              <span className="font-semibold">+</span>
              </div>
              }

            {!userData ? (
              <button
                className="px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 text-sm transition"
                onClick={() => setOpenLogin(true)}
              >
                Get Started
              </button>
            ) : (
              <div className="relative">
              <button className="rounded-full" onClick={() =>setOpenProfile(!openProfile)}>
                <img
                  src={
                    userData.avatar ||
                    `https://ui-avatars.com/api/?name=${userData.name}`
                  }
                  alt="user avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
              </button>
              <AnimatePresence>
              {openProfile && (
                <>
                <motion.div
                  initial={{ opacity: 0, y: -10 ,scale:0.95}}
                  animate={{ opacity: 1, y: 0 ,scale:1}}
                  exit={{ opacity: 0, y: -10 ,scale:0.95}}
                  className="absolute right-0 top-12 w-64 z-50 rounded-xl bg-[#0B0B0B] border border-white/10 shadow-2xl overflow-hidden"
                >
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-sm font-medium truncate">{userData.name}</p>
                    <p className="text-sm text-zinc-400 truncate">{userData.email}</p>
                  </div>
                  <button className=" md:hidden w-full px-4 py-2 flex items-center gap-2 text-sm border-b border-white/10 hover:bg-white/5">
                    <Coins size={16} className="text-yellow-400"/>
              <span className="text-zinc-300">Credits</span>
              <span>{userData.credits}</span>
              <span className="font-semibold">+</span>
                  </button>
                  <button className="w-full px-4 py-2 text-sm hover:bg-white/5" onClick={()=>navigate("/dashboard")}>Dashboard</button>
                  <button className="w-full px-4 py-2 text-sm text-red-400 hover:bg-white/5" onClick={handleLogOut}>Logout</button>


                </motion.div>
                  </>
              )}
              </AnimatePresence>



              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Hero Section */}
      <section className="pt-44 pb-32 px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-bold tracking-tight"
        >
          Build Stunning Websites
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500 ml-2">
            With AI
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto mt-6"
        >
          Describe your idea and let AI generate a modern, responsive,
          production-ready website.
        </motion.p>

        {!userData ? (
          <button
            className="mt-8 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-medium hover:opacity-90 transition-opacity"
            onClick={() => setOpenLogin(true)}
          >
           {userData?"Go to dashboard":" Get Started"}
          </button>
        ) : null}
      </section>

      {/* Highlights Section */}
      <section className="max-w-7xl mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {highlights.map((h, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="rounded-2xl bg-white/5 border border-white/10 p-8"
            >
              <h1 className="text-xl font-semibold mb-3">{h}</h1>
              <p className="text-zinc-400">
                GenWeb.ai builds real websites — clean code, animations,
                responsiveness, and scalable structure.
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-6">
        <div className="max-w-7xl mx-auto text-center text-zinc-400">
          © 2024 GenWeb.ai. All rights reserved.
        </div>
      </footer>

      {openLogin && (
        <LoginModal
          open={openLogin}
          onClose={() => setOpenLogin(false)}
        />
      )}
    </div>
  );
}

export default Home;