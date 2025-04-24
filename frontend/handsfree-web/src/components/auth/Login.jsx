import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/auth';
import { useFeedback } from '../../services/feedback';
import { motion } from 'framer-motion';
import { FiArrowRight, FiGlobe, FiMousePointer, FiVolume2, FiPlay, FiPause } from 'react-icons/fi';
import { FaGoogle } from 'react-icons/fa';

const Login = () => {
  const { loginWithGoogle } = useAuth();
  const { showFeedback } = useFeedback();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    const success = await loginWithGoogle();
    if (success) {
      showFeedback('Successfully logged in!', 'success');
      navigate('/');
    } else {
      showFeedback('Login failed. Please try again.', 'error');
    }
  };

  // Animation for floating hand gestures
  useEffect(() => {
    const floatingElements = document.querySelectorAll('.floating-element');
    floatingElements.forEach(el => {
      el.style.setProperty('--start-y', `${Math.random() * 80 - 40}px`);
      el.style.setProperty('--start-x', `${Math.random() * 80 - 40}px`);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="floating-element absolute opacity-10"
            initial={{
              y: `var(--start-y)`,
              x: `var(--start-x)`,
              rotate: Math.random() * 360
            }}
            animate={{
              y: [null, `calc(var(--start-y) + ${Math.random() * 40 - 20}px)`],
              x: [null, `calc(var(--start-x) + ${Math.random() * 40 - 20}px)`],
              rotate: [null, Math.random() * 360]
            }}
            transition={{
              duration: 15 + Math.random() * 20,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
            style={{
              fontSize: `${20 + Math.random() * 30}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          >
            {['✋', '👆', '🤟', '👍', '👎', '🤙', '👌', '🤘'][i % 8]}
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-gray-800 bg-opacity-70 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden w-full max-w-4xl"
        >
          <div className="md:flex">
            {/* Left side - Product showcase */}
            <div className="md:w-1/2 p-10 bg-gradient-to-br from-purple-800 to-blue-900 flex flex-col justify-center">
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "mirror"
                }}
                className="mb-8 mx-auto"
              >
                <div className="relative w-40 h-40">
                  <div className="absolute inset-0 rounded-full bg-white bg-opacity-10 animate-ping"></div>
                  <div className="absolute inset-2 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                    <span className="text-6xl">👋</span>
                  </div>
                </div>
              </motion.div>

              <h1 className="text-4xl font-bold text-white mb-4 text-center">
                HandsFree <span className="text-blue-300">OS</span>
              </h1>
              
              <p className="text-gray-200 text-center mb-8">
                Control your computer with natural gestures. No touch required.
              </p>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-white bg-opacity-10">
                    <FiMousePointer className="text-blue-300 text-xl" />
                  </div>
                  <span className="text-gray-200">Mouse control with hand movements</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-white bg-opacity-10">
                    <FiVolume2 className="text-purple-300 text-xl" />
                  </div>
                  <span className="text-gray-200">Volume control with simple gestures</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-white bg-opacity-10">
                    <FiGlobe className="text-green-300 text-xl" />
                  </div>
                  <span className="text-gray-200">Web navigation without touching keyboard</span>
                </div>
              </div>
            </div>

            {/* Right side - Login form */}
            <div className="md:w-1/2 p-10 flex flex-col justify-center">
              <h2 className="text-2xl font-bold text-white mb-2">Welcome back!</h2>
              <p className="text-gray-400 mb-8">Sign in to access your gesture controls</p>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center px-6 py-3 border border-gray-600 rounded-lg shadow-sm text-md font-medium text-white bg-gray-700 hover:bg-gray-600 transition-all duration-300 mb-6"
              >
                <FaGoogle className="w-5 h-5 mr-3 text-red-400" />
                Sign in with Google
              </motion.button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-800 text-gray-400">Experience the future</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="bg-gray-700 bg-opacity-50 p-4 rounded-lg flex flex-col items-center"
                >
                  <div className="text-2xl mb-2">✋</div>
                  <p className="text-xs text-center text-gray-300">Show Desktop</p>
                </motion.div>
                
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="bg-gray-700 bg-opacity-50 p-4 rounded-lg flex flex-col items-center"
                >
                  <div className="text-2xl mb-2">👍</div>
                  <p className="text-xs text-center text-gray-300">Volume Up</p>
                </motion.div>
                
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="bg-gray-700 bg-opacity-50 p-4 rounded-lg flex flex-col items-center"
                >
                  <div className="text-2xl mb-2">👎</div>
                  <p className="text-xs text-center text-gray-300">Volume Down</p>
                </motion.div>
              </div>

              <div className="text-center text-xs text-gray-500">
                <p>By signing in, you agree to our <a href="#" className="text-blue-400 hover:underline">Terms</a> and <a href="#" className="text-blue-400 hover:underline">Privacy Policy</a></p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Floating CTA at bottom */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-6 left-0 right-0 flex justify-center"
      >
        <a 
          href="#features" 
          className="flex items-center px-4 py-2 bg-white bg-opacity-10 backdrop-blur-md rounded-full text-white border border-white border-opacity-20 hover:bg-opacity-20 transition-all"
        >
          <span>Explore Features</span>
          <FiArrowRight className="ml-2 animate-bounce-x" />
        </a>
      </motion.div>
    </div>
  );
};

export default Login;