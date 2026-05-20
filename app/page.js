// "use client";
// import { Button } from "@/components/ui/button";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import { ArrowRight, Zap, Users, BarChart3, Shield, Mic, Brain } from "lucide-react";

// export default function Home() {
//   const router = useRouter();

//   return (
//     <div className="w-full bg-white overflow-hidden">
//       {/* Navigation Bar */}
//       <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
//           <div className="flex items-center gap-2">
//             <Image
//               src="/logo.png"
//               alt="AI Interview Platform"
//               width={150}
//               height={40}
//               className="h-10 w-auto"
//             />
//           </div>
//           <div className="hidden md:flex items-center gap-8">
//             <a href="#features" className="text-sm font-medium text-gray-700 hover:text-black transition">
//               Features
//             </a>
//             <a href="#how-it-works" className="text-sm font-medium text-gray-700 hover:text-black transition">
//               How It Works
//             </a>
//             <a href="#benefits" className="text-sm font-medium text-gray-700 hover:text-black transition">
//               Benefits
//             </a>
//           </div>
//           <Button
//             onClick={() => router.push("/auth")}
//             variant="default"
//             className="bg-black hover:bg-gray-800 text-white"
//           >
//             Sign In
//           </Button>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <section className="relative min-h-[90vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-white to-gray-50">
//         <div className="absolute inset-0 overflow-hidden pointer-events-none">
//           <div className="absolute top-20 right-10 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
//           <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
//         </div>

//         <div className="relative max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
//           {/* Left Content */}
//           <div className="flex flex-col justify-center space-y-8">
//             <div className="inline-flex items-center bg-blue-50 text-blue-700 px-4 py-2 rounded-full w-fit">
//               <Zap className="w-4 h-4 mr-2" />
//               <span className="text-sm font-medium">AI-Powered Interview Platform</span>
//             </div>

//             <div>
//               <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
//                 Transform Your Hiring with{" "}
//                 <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
//                   AI Interviews
//                 </span>
//               </h1>
//               <p className="text-xl text-gray-600 leading-relaxed">
//                 Conduct intelligent, voice-based interviews powered by advanced AI. Generate contextual questions, assess candidates in real-time, and make data-driven hiring decisions instantly.
//               </p>
//             </div>

//             <div className="flex flex-col sm:flex-row gap-4">
//               <Button
//                 onClick={() => router.push("/auth")}
//                 size="lg"
//                 className="bg-black hover:bg-gray-800 text-white flex items-center justify-center group"
//               >
//                 Get Started Free
//                 <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition" />
//               </Button>
//               <Button
//                 variant="outline"
//                 size="lg"
//                 className="border-gray-300 text-gray-700 hover:bg-gray-50"
//               >
//                 Watch Demo
//               </Button>
//             </div>

//             {/* Stats */}
//             <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-200">
//               <div>
//                 <div className="text-2xl font-bold text-black">500+</div>
//                 <p className="text-sm text-gray-600">Interviews Conducted</p>
//               </div>
//               <div>
//                 <div className="text-2xl font-bold text-black">95%</div>
//                 <p className="text-sm text-gray-600">Candidate Match</p>
//               </div>
//               <div>
//                 <div className="text-2xl font-bold text-black">10x</div>
//                 <p className="text-sm text-gray-600">Faster Hiring</p>
//               </div>
//             </div>
//           </div>

//           {/* Right Image */}
//           <div className="hidden lg:flex items-center justify-center">
//             <div className="relative w-full h-full">
//               <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur-2xl opacity-20"></div>
//               <Image
//                 src="/interview.png"
//                 alt="Interview Platform"
//                 width={500}
//                 height={500}
//                 className="relative rounded-2xl shadow-2xl w-full h-auto object-cover"
//               />
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
//         <div className="max-w-6xl mx-auto">
//           <div className="text-center mb-16">
//             <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
//             <p className="text-xl text-gray-600 max-w-2xl mx-auto">
//               Everything you need to conduct professional, AI-powered interviews
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             {/* Feature 1 */}
//             <div className="p-8 rounded-xl border border-gray-200 bg-white hover:shadow-lg transition">
//               <Brain className="w-12 h-12 text-blue-600 mb-4" />
//               <h3 className="text-xl font-bold text-gray-900 mb-2">AI-Powered Questions</h3>
//               <p className="text-gray-600">
//                 Generate contextual interview questions based on job description and requirements automatically
//               </p>
//             </div>

//             {/* Feature 2 */}
//             <div className="p-8 rounded-xl border border-gray-200 bg-white hover:shadow-lg transition">
//               <Mic className="w-12 h-12 text-blue-600 mb-4" />
//               <h3 className="text-xl font-bold text-gray-900 mb-2">Voice Interviews</h3>
//               <p className="text-gray-600">
//                 Conduct natural, two-way conversations with candidates using advanced voice technology
//               </p>
//             </div>

//             {/* Feature 3 */}
//             <div className="p-8 rounded-xl border border-gray-200 bg-white hover:shadow-lg transition">
//               <BarChart3 className="w-12 h-12 text-blue-600 mb-4" />
//               <h3 className="text-xl font-bold text-gray-900 mb-2">Instant Feedback</h3>
//               <p className="text-gray-600">
//                 Get detailed performance analysis with ratings and hiring recommendations in seconds
//               </p>
//             </div>

//             {/* Feature 4 */}
//             <div className="p-8 rounded-xl border border-gray-200 bg-white hover:shadow-lg transition">
//               <Users className="w-12 h-12 text-blue-600 mb-4" />
//               <h3 className="text-xl font-bold text-gray-900 mb-2">Candidate Management</h3>
//               <p className="text-gray-600">
//                 Track all interviews, results, and candidate information in one centralized dashboard
//               </p>
//             </div>

//             {/* Feature 5 */}
//             <div className="p-8 rounded-xl border border-gray-200 bg-white hover:shadow-lg transition">
//               <Shield className="w-12 h-12 text-blue-600 mb-4" />
//               <h3 className="text-xl font-bold text-gray-900 mb-2">Secure & Reliable</h3>
//               <p className="text-gray-600">
//                 Enterprise-grade security with encrypted conversations and secure data storage
//               </p>
//             </div>

//             {/* Feature 6 */}
//             <div className="p-8 rounded-xl border border-gray-200 bg-white hover:shadow-lg transition">
//               <Zap className="w-12 h-12 text-blue-600 mb-4" />
//               <h3 className="text-xl font-bold text-gray-900 mb-2">Fast & Efficient</h3>
//               <p className="text-gray-600">
//                 Reduce hiring time from weeks to days with automated interview scheduling and analysis
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* How It Works */}
//       <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
//         <div className="max-w-6xl mx-auto">
//           <div className="text-center mb-16">
//             <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
//             <p className="text-xl text-gray-600 max-w-2xl mx-auto">
//               Three simple steps to revolutionize your hiring process
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {/* Step 1 */}
//             <div className="text-center">
//               <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 font-bold text-2xl mb-6">
//                 1
//               </div>
//               <h3 className="text-2xl font-bold text-gray-900 mb-3">Create Interview</h3>
//               <p className="text-gray-600 mb-4">
//                 Set up an interview by providing job details and requirements
//               </p>
//               <div className="text-blue-600 font-semibold text-sm">Takes 2 minutes</div>
//             </div>

//             {/* Arrow */}
//             <div className="hidden md:flex items-center justify-center">
//               <ArrowRight className="w-8 h-8 text-gray-400 rotate-0 md:rotate-0" />
//             </div>

//             {/* Step 2 */}
//             <div className="text-center">
//               <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 font-bold text-2xl mb-6">
//                 2
//               </div>
//               <h3 className="text-2xl font-bold text-gray-900 mb-3">Share Link</h3>
//               <p className="text-gray-600 mb-4">
//                 Send the interview link to candidates via email or QR code
//               </p>
//               <div className="text-blue-600 font-semibold text-sm">Instant sharing</div>
//             </div>

//             {/* Arrow */}
//             <div className="hidden md:flex items-center justify-center">
//               <ArrowRight className="w-8 h-8 text-gray-400 rotate-0 md:rotate-0" />
//             </div>

//             {/* Step 3 */}
//             <div className="text-center">
//               <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 font-bold text-2xl mb-6">
//                 3
//               </div>
//               <h3 className="text-2xl font-bold text-gray-900 mb-3">Get Results</h3>
//               <p className="text-gray-600 mb-4">
//                 Receive detailed AI feedback and hiring recommendations instantly
//               </p>
//               <div className="text-blue-600 font-semibold text-sm">Real-time insights</div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Benefits Section */}
//       <section id="benefits" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
//         <div className="max-w-6xl mx-auto">
//           <div className="text-center mb-16">
//             <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
//             <p className="text-xl text-gray-600 max-w-2xl mx-auto">
//               Join hundreds of companies improving their hiring process
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
//             {[
//               {
//                 title: "Save Time & Resources",
//                 description: "Automate repetitive interview scheduling and initial screening",
//               },
//               {
//                 title: "Better Candidate Experience",
//                 description: "Modern, voice-based interviews are engaging and less stressful",
//               },
//               {
//                 title: "Data-Driven Decisions",
//                 description: "Make hiring decisions based on AI-analyzed performance metrics",
//               },
//               {
//                 title: "Consistent Evaluation",
//                 description: "Remove bias with standardized questions and objective scoring",
//               },
//             ].map((benefit, index) => (
//               <div key={index} className="flex gap-4">
//                 <div className="flex-shrink-0">
//                   <Image
//                     src="/check.png"
//                     alt="check"
//                     width={24}
//                     height={24}
//                     className="w-6 h-6"
//                   />
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-bold text-gray-900 mb-2">
//                     {benefit.title}
//                   </h3>
//                   <p className="text-gray-600">{benefit.description}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-blue-800">
//         <div className="max-w-4xl mx-auto text-center">
//           <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Hiring?</h2>
//           <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
//             Start conducting AI-powered interviews today. Free for the first 5 interviews.
//           </p>
//           <Button
//             onClick={() => router.push("/auth")}
//             size="lg"
//             className="bg-white hover:bg-gray-100 text-blue-600 font-semibold px-8 flex items-center justify-center gap-2 group"
//           >
//             Get Started Now
//             <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
//           </Button>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-6xl mx-auto">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
//             <div>
//               <h4 className="font-bold text-lg mb-4">AI Interview Platform</h4>
//               <p className="text-gray-400 text-sm">
//                 Revolutionizing the way companies hire talent
//               </p>
//             </div>
//             <div>
//               <h4 className="font-bold text-lg mb-4">Product</h4>
//               <ul className="space-y-2 text-sm text-gray-400">
//                 <li><a href="#features" className="hover:text-white transition">Features</a></li>
//                 <li><a href="#how-it-works" className="hover:text-white transition">How It Works</a></li>
//                 <li><a href="#benefits" className="hover:text-white transition">Pricing</a></li>
//               </ul>
//             </div>
//             <div>
//               <h4 className="font-bold text-lg mb-4">Company</h4>
//               <ul className="space-y-2 text-sm text-gray-400">
//                 <li><a href="#" className="hover:text-white transition">About</a></li>
//                 <li><a href="#" className="hover:text-white transition">Blog</a></li>
//                 <li><a href="#" className="hover:text-white transition">Contact</a></li>
//               </ul>
//             </div>
//             <div>
//               <h4 className="font-bold text-lg mb-4">Legal</h4>
//               <ul className="space-y-2 text-sm text-gray-400">
//                 <li><a href="#" className="hover:text-white transition">Privacy</a></li>
//                 <li><a href="#" className="hover:text-white transition">Terms</a></li>
//                 <li><a href="#" className="hover:text-white transition">Security</a></li>
//               </ul>
//             </div>
//           </div>
//           <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
//             <p>&copy; 2024 AI Interview Platform. All rights reserved.</p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }
// "use client";
// import { Button } from "@/components/ui/button";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import { ArrowRight, Zap, Users, BarChart3, Shield, Mic, Brain } from "lucide-react";

// export default function Home() {
//   const router = useRouter();

//   return (
//     <div className="w-full bg-white overflow-hidden">
//       {/* Navigation Bar */}
//       <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
//           <div className="flex items-center gap-2">
//             <Image
//               src="/logo.png"
//               alt="AI Interview Platform"
//               width={150}
//               height={40}
//               className="h-10 w-auto"
//             />
//           </div>
//           <div className="hidden md:flex items-center gap-8">
//             <a href="#features" className="text-sm font-medium text-gray-700 hover:text-black transition">
//               Features
//             </a>
//             <a href="#how-it-works" className="text-sm font-medium text-gray-700 hover:text-black transition">
//               How It Works
//             </a>
//             <a href="#benefits" className="text-sm font-medium text-gray-700 hover:text-black transition">
//               Benefits
//             </a>
//           </div>
//           <Button
//             onClick={() => router.push("/auth")}
//             variant="default"
//             className="bg-black hover:bg-gray-800 text-white"
//           >
//             Sign In
//           </Button>
//         </div>
//       </nav>

//       {/* Hero Section - IMPROVED RESPONSIVE GRID */}
//       <section className="relative min-h-[90vh] flex items-center justify-center !px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-white to-gray-50">
//         <div className="absolute inset-0 overflow-hidden pointer-events-none">
//           <div className="absolute top-20 right-10 !w-72 !h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
//           <div className="absolute -bottom-8 left-20 !w-72 !h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
//         </div>

//         {/* FIXED: Improved responsive gap and alignment */}
//         <div className="relative max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
//           {/* Left Content */}
//           <div className="flex flex-col justify-center space-y-6 sm:space-y-8">
//             <div className="inline-flex items-center bg-blue-50 text-blue-700 px-4 py-2 rounded-full w-fit">
//               <Zap className="w-4 h-4 mr-2" />
//               <span className="text-sm font-medium">AI-Powered Interview Platform</span>
//             </div>

//             <div>
//               <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
//                 Transform Your Hiring with{" "}
//                 <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
//                   AI Interviews
//                 </span>
//               </h1>
//               <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
//                 Conduct intelligent, voice-based interviews powered by advanced AI. Generate contextual questions, assess candidates in real-time, and make data-driven hiring decisions instantly.
//               </p>
//             </div>

//             <div className="flex flex-col sm:flex-row gap-4 pt-2">
//               <Button
//                 onClick={() => router.push("/auth")}
//                 size="lg"
//                 className="bg-black hover:bg-gray-800 text-white flex items-center justify-center group w-full sm:w-auto"
//               >
//                 Get Started Free
//                 <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition" />
//               </Button>
//               <Button
//                 variant="outline"
//                 size="lg"
//                 className="border-gray-300 text-gray-700 hover:bg-gray-50 w-full sm:w-auto"
//               >
//                 Watch Demo
//               </Button>
//             </div>

//             {/* FIXED: Improved stats grid for better alignment on all breakpoints */}
//             <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-6 sm:pt-8 border-t border-gray-200">
//               <div className="flex flex-col items-start">
//                 <div className="text-xl sm:text-2xl font-bold text-black">500+</div>
//                 <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">Interviews</p>
//               </div>
//               <div className="flex flex-col items-start">
//                 <div className="text-xl sm:text-2xl font-bold text-black">95%</div>
//                 <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">Match Rate</p>
//               </div>
//               <div className="flex flex-col items-start">
//                 <div className="text-xl sm:text-2xl font-bold text-black">10x</div>
//                 <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2">Faster</p>
//               </div>
//             </div>
//           </div>

//           {/* Right Image */}
//           <div className="hidden lg:flex items-center justify-center">
//             <div className="relative w-full h-full">
//               <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur-2xl opacity-20"></div>
//               <Image
//                 src="/interview.png"
//                 alt="Interview Platform"
//                 width={500}
//                 height={500}
//                 className="relative rounded-2xl shadow-2xl w-full h-auto object-cover"
//               />
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section id="features" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
//         <div className="max-w-6xl mx-auto">
//           <div className="text-center mb-12 sm:mb-16">
//             <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
//             <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
//               Everything you need to conduct professional, AI-powered interviews
//             </p>
//           </div>

//           {/* IMPROVED: Better responsive grid with improved hover states */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
//             {/* Feature 1 */}
//             <div className="p-6 sm:p-8 rounded-xl border border-gray-200 bg-white hover:shadow-lg transition-shadow duration-300">
//               <Brain className="w-12 h-12 text-blue-600 mb-4" />
//               <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">AI-Powered Questions</h3>
//               <p className="text-gray-600 text-sm sm:text-base">
//                 Generate contextual interview questions based on job description and requirements automatically
//               </p>
//             </div>

//             {/* Feature 2 */}
//             <div className="p-6 sm:p-8 rounded-xl border border-gray-200 bg-white hover:shadow-lg transition-shadow duration-300">
//               <Mic className="w-12 h-12 text-blue-600 mb-4" />
//               <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Voice Interviews</h3>
//               <p className="text-gray-600 text-sm sm:text-base">
//                 Conduct natural, two-way conversations with candidates using advanced voice technology
//               </p>
//             </div>

//             {/* Feature 3 */}
//             <div className="p-6 sm:p-8 rounded-xl border border-gray-200 bg-white hover:shadow-lg transition-shadow duration-300">
//               <BarChart3 className="w-12 h-12 text-blue-600 mb-4" />
//               <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Instant Feedback</h3>
//               <p className="text-gray-600 text-sm sm:text-base">
//                 Get detailed performance analysis with ratings and hiring recommendations in seconds
//               </p>
//             </div>

//             {/* Feature 4 */}
//             <div className="p-6 sm:p-8 rounded-xl border border-gray-200 bg-white hover:shadow-lg transition-shadow duration-300">
//               <Users className="w-12 h-12 text-blue-600 mb-4" />
//               <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Candidate Management</h3>
//               <p className="text-gray-600 text-sm sm:text-base">
//                 Track all interviews, results, and candidate information in one centralized dashboard
//               </p>
//             </div>

//             {/* Feature 5 */}
//             <div className="p-6 sm:p-8 rounded-xl border border-gray-200 bg-white hover:shadow-lg transition-shadow duration-300">
//               <Shield className="w-12 h-12 text-blue-600 mb-4" />
//               <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Secure & Reliable</h3>
//               <p className="text-gray-600 text-sm sm:text-base">
//                 Enterprise-grade security with encrypted conversations and secure data storage
//               </p>
//             </div>

//             {/* Feature 6 */}
//             <div className="p-6 sm:p-8 rounded-xl border border-gray-200 bg-white hover:shadow-lg transition-shadow duration-300">
//               <Zap className="w-12 h-12 text-blue-600 mb-4" />
//               <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Fast & Efficient</h3>
//               <p className="text-gray-600 text-sm sm:text-base">
//                 Reduce hiring time from weeks to days with automated interview scheduling and analysis
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* How It Works - FIXED ALIGNMENT */}
//       <section id="how-it-works" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
//         <div className="max-w-6xl mx-auto">
//           <div className="text-center mb-12 sm:mb-16">
//             <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
//             <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
//               Three simple steps to revolutionize your hiring process
//             </p>
//           </div>

//           {/* FIXED: Improved responsive layout with better arrow alignment */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
//             {/* Step 1 */}
//             <div className="text-center relative">
//               <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-blue-100 text-blue-600 font-bold text-xl sm:text-2xl mb-4 sm:mb-6">
//                 1
//               </div>
//               <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">Create Interview</h3>
//               <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4">
//                 Set up an interview by providing job details and requirements
//               </p>
//               <div className="text-blue-600 font-semibold text-xs sm:text-sm">Takes 2 minutes</div>

//               {/* FIXED: Arrow that shows only on md and larger with proper sizing */}
//               <div className="hidden md:flex absolute left-full top-1/3 transform -translate-y-1/2 -translate-x-1/2 justify-center items-center w-8 h-8 md:w-6 md:h-6">
//                 <ArrowRight className="w-6 h-6 text-gray-400" />
//               </div>
//             </div>

//             {/* Step 2 */}
//             <div className="text-center relative">
//               <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-blue-100 text-blue-600 font-bold text-xl sm:text-2xl mb-4 sm:mb-6">
//                 2
//               </div>
//               <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">Share Link</h3>
//               <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4">
//                 Send the interview link to candidates via email or QR code
//               </p>
//               <div className="text-blue-600 font-semibold text-xs sm:text-sm">Instant sharing</div>

//               {/* FIXED: Arrow that shows only on md and larger */}
//               <div className="hidden md:flex absolute left-full top-1/3 transform -translate-y-1/2 -translate-x-1/2 justify-center items-center w-8 h-8 md:w-6 md:h-6">
//                 <ArrowRight className="w-6 h-6 text-gray-400" />
//               </div>
//             </div>

//             {/* Step 3 */}
//             <div className="text-center">
//               <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-blue-100 text-blue-600 font-bold text-xl sm:text-2xl mb-4 sm:mb-6">
//                 3
//               </div>
//               <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">Get Results</h3>
//               <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4">
//                 Receive detailed AI feedback and hiring recommendations instantly
//               </p>
//               <div className="text-blue-600 font-semibold text-xs sm:text-sm">Real-time insights</div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Benefits Section - IMPROVED ALIGNMENT */}
//       <section id="benefits" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
//         <div className="max-w-6xl mx-auto">
//           <div className="text-center mb-12 sm:mb-16">
//             <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
//             <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
//               Join hundreds of companies improving their hiring process
//             </p>
//           </div>

//           {/* FIXED: Consistent padding and improved responsive layout */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
//             {[
//               {
//                 title: "Save Time & Resources",
//                 description: "Automate repetitive interview scheduling and initial screening",
//               },
//               {
//                 title: "Better Candidate Experience",
//                 description: "Modern, voice-based interviews are engaging and less stressful",
//               },
//               {
//                 title: "Data-Driven Decisions",
//                 description: "Make hiring decisions based on AI-analyzed performance metrics",
//               },
//               {
//                 title: "Consistent Evaluation",
//                 description: "Remove bias with standardized questions and objective scoring",
//               },
//             ].map((benefit, index) => (
//               <div key={index} className="flex gap-4 sm:gap-6">
//                 <div className="flex-shrink-0 mt-1">
//                   <Image
//                     src="/check.png"
//                     alt="check"
//                     width={24}
//                     height={24}
//                     className="w-6 h-6"
//                   />
//                 </div>
//                 <div className="flex-1">
//                   <h3 className="text-lg font-bold text-gray-900 mb-2">
//                     {benefit.title}
//                   </h3>
//                   <p className="text-gray-600 text-sm sm:text-base">{benefit.description}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-blue-800">
//         <div className="max-w-4xl mx-auto text-center">
//           <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 sm:mb-6">Ready to Transform Your Hiring?</h2>
//           <p className="text-lg sm:text-xl text-blue-100 mb-6 sm:mb-8 max-w-2xl mx-auto">
//             Start conducting AI-powered interviews today. Free for the first 5 interviews.
//           </p>
//           <Button
//             onClick={() => router.push("/auth")}
//             size="lg"
//             className="bg-white hover:bg-gray-100 text-blue-600 font-semibold px-6 sm:px-8 flex items-center justify-center gap-2 group w-full sm:w-auto"
//           >
//             Get Started Now
//             <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
//           </Button>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-6xl mx-auto">
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
//             <div>
//               <h4 className="font-bold text-lg mb-4">AI Interview Platform</h4>
//               <p className="text-gray-400 text-sm">
//                 Revolutionizing the way companies hire talent
//               </p>
//             </div>
//             <div>
//               <h4 className="font-bold text-lg mb-4">Product</h4>
//               <ul className="space-y-2 text-sm text-gray-400">
//                 <li><a href="#features" className="hover:text-white transition">Features</a></li>
//                 <li><a href="#how-it-works" className="hover:text-white transition">How It Works</a></li>
//                 <li><a href="#benefits" className="hover:text-white transition">Pricing</a></li>
//               </ul>
//             </div>
//             <div>
//               <h4 className="font-bold text-lg mb-4">Company</h4>
//               <ul className="space-y-2 text-sm text-gray-400">
//                 <li><a href="#" className="hover:text-white transition">About</a></li>
//                 <li><a href="#" className="hover:text-white transition">Blog</a></li>
//                 <li><a href="#" className="hover:text-white transition">Contact</a></li>
//               </ul>
//             </div>
//             <div>
//               <h4 className="font-bold text-lg mb-4">Legal</h4>
//               <ul className="space-y-2 text-sm text-gray-400">
//                 <li><a href="#" className="hover:text-white transition">Privacy</a></li>
//                 <li><a href="#" className="hover:text-white transition">Terms</a></li>
//                 <li><a href="#" className="hover:text-white transition">Security</a></li>
//               </ul>
//             </div>
//           </div>
//           <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
//             <p>&copy; 2024 AI Interview Platform. All rights reserved.</p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }

"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  ArrowRight,
  Brain,
  Mic,
  BarChart3,
  Shield,
  Users,
} from "lucide-react";

export default function Home() {
  const router = useRouter();

  const features = [
    {
      icon: Brain,
      title: "AI Question Generation",
      desc: "Generate contextual interview questions tailored to job roles and candidate profiles.",
    },
    {
      icon: Mic,
      title: "Voice-Based Interviews",
      desc: "Natural AI conversations that feel smooth, engaging, and human-like.",
    },
    {
      icon: BarChart3,
      title: "Real-Time Evaluation",
      desc: "Instant candidate scoring with actionable insights and performance analysis.",
    },
    {
      icon: Users,
      title: "Candidate Dashboard",
      desc: "Manage interviews, results, and hiring pipelines from one place.",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      desc: "Secure infrastructure with encrypted communication and protected data.",
    },
  ];

  return (
    <main className="w-full overflow-hidden bg-white text-gray-900">
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex !h-20 max-w-7xl items-center justify-between !px-6 lg:!px-8">
          <Image
            src="/logo.png"
            alt="Logo"
            width={140}
            height={40}
            className="h-9 w-auto"
          />

          <nav className="hidden items-center gap-10 md:flex">
            <a
              href="#features"
              className="text-sm text-gray-600 transition hover:text-black"
            >
              Features
            </a>

            <a
              href="#process"
              className="text-sm text-gray-600 transition hover:text-black"
            >
              Process
            </a>

            <a
              href="#benefits"
              className="text-sm text-gray-600 transition hover:text-black"
            >
              Benefits
            </a>
          </nav>

          <Button
            onClick={() => router.push("/auth")}
            className="rounded-full bg-black !px-6 text-white hover:bg-gray-800"
          >
            Sign In
          </Button>
        </div>
      </header>

      {/* HERO */}
      <section className="relative">
        <div className="mx-auto grid !min-h-[92vh] max-w-7xl grid-cols-1 items-center !gap-20 !px-6 !py-24 lg:grid-cols-2 lg:!px-8">
          {/* LEFT */}
          <div className="max-w-2xl">
            <div className="!mb-8 inline-flex items-center rounded-full border border-blue-100 bg-blue-50 !px-4 !py-2 text-sm font-medium text-blue-700">
              AI Powered Hiring Platform
            </div>

            <h1 className="text-5xl font-bold leading-[1.05] tracking-tight text-black sm:text-6xl lg:text-7xl">
              Modern AI Interviews For Smarter Hiring
            </h1>

            <p className="!mt-8 max-w-xl text-lg leading-8 text-gray-600">
              Streamline your hiring workflow with intelligent voice interviews,
              automated candidate evaluation, and AI-driven insights.
            </p>

            <div className="!mt-10 flex flex-col !gap-4 sm:flex-row">
              <Button
                onClick={() => router.push("/auth")}
                size="lg"
                className="!h-14 rounded-full bg-black !px-8 text-base text-white hover:bg-gray-800"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="!h-14 rounded-full border-gray-300 !px-8 text-base"
              >
                Watch Demo
              </Button>
            </div>

            {/* STATS */}
            <div className="!mt-16 grid grid-cols-3 !gap-10 border-t border-gray-100 !pt-10">
              <div>
                <h3 className="text-3xl font-bold text-black">500+</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Interviews Conducted
                </p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-black">95%</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Candidate Match Accuracy
                </p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-black">10x</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Faster Hiring Process
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 rounded-[40px] bg-gradient-to-tr from-blue-100 to-purple-100 blur-3xl opacity-40"></div>

            <Image
              src="/interview.png"
              alt="AI Interview"
              width={700}
              height={700}
              className="relative rounded-[32px] border border-gray-100 shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      {/* <section
        id="features"
        className="border-t border-gray-100 bg-gray-50 py-32"
      > */}
      <section
        id="features"
        className="border-t border-gray-100 bg-gray-50 !py-24 lg:!py-32"
      >
        <div className="mx-auto w-full max-w-6xl !px-6 sm:!px-8 lg:!px-12">
          <div className="max-w-2xl">
            <p className="!mb-4 text-sm font-semibold uppercase tracking-wider text-blue-600">
              Features
            </p>

            <h2 className="text-4xl font-bold tracking-tight text-black">
              Built for modern recruitment teams
            </h2>

            <p className="!mt-6 text-lg leading-8 text-gray-600">
              Everything needed to create seamless AI-powered interview
              experiences at scale.
            </p>
          </div>

          <div className="!mt-16 grid grid-cols-1 !gap-6 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature, i) => {
              const Icon = feature.icon;

              return (
                <div
                  key={i}
                  className="rounded-2xl bg-white !p-7 shadow-sm ring-1 ring-gray-100 transition-all duration-300 hover:shadow-md"
                >
                  <div className="!mb-6 flex !h-14 !w-14 items-center justify-center rounded-2xl bg-blue-50">
                    <Icon className="h-7 w-7 text-blue-600" />
                  </div>

                  <h3 className="text-xl font-semibold text-black">
                    {feature.title}
                  </h3>

                  <p className="!mt-4 leading-7 text-gray-600">
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section id="process" className="!py-32">
        <div className="mx-auto max-w-5xl !px-6 text-center lg:px-8">
          <p className="!mb-4 text-sm font-semibold uppercase tracking-wider text-blue-600">
            Process
          </p>

          <h2 className="text-4xl font-bold tracking-tight">
            Simple from start to finish
          </h2>

          <div className="!mt-24 grid !gap-16 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Create Interview",
                desc: "Set job requirements and configure interview preferences.",
              },
              {
                step: "02",
                title: "Invite Candidates",
                desc: "Share interview links instantly with applicants.",
              },
              {
                step: "03",
                title: "Review Insights",
                desc: "Receive AI-generated reports and hiring recommendations.",
              },
            ].map((item, i) => (
              <div key={i}>
                <div className="text-5xl font-bold text-gray-200">
                  {item.step}
                </div>

                <h3 className="!mt-6 text-2xl font-semibold text-black">
                  {item.title}
                </h3>

                <p className="!mt-4 leading-7 text-gray-600">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="!px-6 !pb-24 lg:!px-8">
        <div className="mx-auto max-w-6xl rounded-[40px] bg-black !px-8 !py-20 text-center sm:!px-16">
          <h2 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Ready to transform your hiring process?
          </h2>

          <p className="mx-auto !mt-6 max-w-2xl text-lg leading-8 text-gray-300">
            Start conducting intelligent AI-powered interviews today.
          </p>

          <Button
            onClick={() => router.push("/auth")}
            size="lg"
            className="!mt-10 !h-14 rounded-full bg-white !px-8 text-base text-black hover:bg-gray-200"
          >
            Start Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gray-100 !py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between !gap-4 !px-6 text-sm text-gray-500 md:flex-row lg:!px-8">
          <p>© 2026 AI Interview Platform. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-black">
              Privacy
            </a>

            <a href="#" className="hover:text-black">
              Terms
            </a>

            <a href="#" className="hover:text-black">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}