import React from "react";
import { AnimatePresence, motion } from "motion/react";
import {signInWithPopup} from "firebase/auth";
import { auth, provider } from "../firebase.js";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice.js";

function LoginModal({ open, onClose }) {
const dispatch = useDispatch()

   const handleGoogleAuth =async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const {data} = await axios.post(`${serverUrl}/api/auth/google`, {
        name: result.user.displayName,
        email: result.user.email,
        avtar: result.user.photoURL,
      },{withCredentials: true})
      dispatch(setUserData(data))
      onClose();
       
    } catch (error) {
      console.log(error);
    }
   };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] backdrop-blur-xl px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.88, opacity: 0, y: 60 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 40 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="relative w-full max-w-md p-[1px] rounded-3xl bg-gradient-to-r from-purple-500/40 via-blue-500/30 to-transparent"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative rounded-3xl bg-[#040404] border border-white/10 shadow-[0_30px_120px_rgba(0,0,0,0.8)] overflow-hidden">
              
              {/* Glow Effects */}
              <motion.div
                animate={{ opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-32 -left-32 w-80 h-80 bg-gradient-to-r from-blue-500 to-purple-500 blur-3xl"
              />

              <motion.div
                animate={{ opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-500 to-blue-500 opacity-10"
              />

              {/* Close Button */}
              <button
                className="absolute top-5 right-5 z-20 text-zinc-400 hover:text-white transition text-lg"
                onClick={onClose}
              >
                ✕
              </button>

              {/* Content */}
              <div className="relative px-8 pt-14 pb-10 text-center">
                
                {/* Badge */}
                <h1 className="inline-block mb-6 px-4 py-1.5 rounded-full bg-white/5 border border-white/20 text-xs text-zinc-300">
                  AI-powered website builder
                </h1>

                {/* Heading */}
                <h2 className="text-3xl font-semibold leading-tight my-3">
                  <span>Welcome back! </span>
                  <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    Genweb.ai
                  </span>
                </h2>

                {/* Google Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative w-full h-14 mt-6 rounded-xl bg-white text-black font-semibold shadow-xl overflow-hidden flex items-center justify-center gap-3 transition-all duration-300 hover:shadow-2xl"
                  onClick={handleGoogleAuth}
                >
                  {/* Shine Effect */}
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/0/09/IOS_Google_icon.png"
                    alt="Google logo"
                    className="w-6 h-6"
                  />

                  Continue with Google
                </motion.button>

              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default LoginModal;