import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const { currentUser } = useAuth();

  return (
    <div className="bg-surface text-on-surface min-h-screen selection:bg-primary-container selection:text-on-primary-container font-body">
      {/* TopAppBar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md shadow-sm dark:shadow-none">
        <div className="flex items-center justify-between px-6 py-4 w-full max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary dark:text-primary-fixed">menu</span>
            <span className="text-primary dark:text-primary-fixed font-bold tracking-tighter font-headline text-lg">Saheli Connect</span>
          </div>
          <div className="hidden md:flex gap-8 items-center font-bold text-sm">
            <a className="text-primary hover:opacity-80 transition-opacity" href="#">Home</a>
            <a className="text-zinc-500 hover:opacity-80 transition-opacity" href="#">Impact</a>
            <a className="text-zinc-500 hover:opacity-80 transition-opacity" href="#">NGOs</a>
            <a className="text-zinc-500 hover:opacity-80 transition-opacity" href="#">Safety</a>
          </div>
          <div className="flex items-center gap-4">
            {currentUser ? (
              <Link to="/dashboard" className="bg-primary text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-primary-container transition-colors">
                Dashboard
              </Link>
            ) : (
              <Link to="/login" className="text-primary font-bold hover:opacity-80 transition-opacity text-sm">
                NGO Login
              </Link>
            )}
            <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center overflow-hidden border-2 border-primary-container">
              <img alt="User Profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUNHFWgEFeMwNl-1ge-V5U_py0pZXSkfa7buwUglS0wqAGofVcZjEUX9SUEd4uzf7uFhpBUqNRuWTpkKskBv_F0VAnZwbQdPwmedUUB1qYbZrq4FKKU9GnWmtGy1WMReXwRJC99mvLHSBQ9CSnvaNURX-212TxcazbWM_JxU34s_E0klQEO1Q8KLvBTCd1ewZa8LyD_tUxbDTXDf9ZSvmC3cC6-V-YES5NmwxJyi1imQXQ238qdL1aRR0uK2Uh6b8OHM--0ruzsQ"/>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-32">
        {/* Hero Section */}
        <section className="px-6 max-w-7xl mx-auto py-12 md:py-24 overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl md:text-6xl font-extrabold text-primary leading-[1.1] tracking-tight font-headline">
                Connecting Women to Safety, Support, and Opportunity
              </h1>
              <p className="text-lg md:text-xl text-on-surface-variant leading-relaxed">
                A platform that enables safe reporting, NGO coordination, and real-time response. Building a digital sanctuary for community resilience.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/report" className="bg-gradient-to-br from-primary to-primary-container text-on-primary px-8 py-4 rounded-3xl font-bold text-lg shadow-lg hover:scale-[1.02] active:scale-95 transition-all duration-200 text-center">
                  Report Now
                </Link>
                <Link to={currentUser ? "/dashboard" : "/login"} className="border-2 border-secondary text-secondary px-8 py-4 rounded-3xl font-bold text-lg hover:bg-secondary/5 transition-colors duration-200 text-center">
                  For NGOs
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-secondary-container/20 rounded-full blur-3xl"></div>
              <div className="relative bg-surface-container-low rounded-3xl p-4 md:p-8 aspect-square flex items-center justify-center">
                <img alt="Women supporting each other" className="rounded-2xl object-cover w-full h-full shadow-lg" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDkZGwmxYEXk9T-ZhIbqF8oB0E4pDphpUql6QV1nYPCp0ZzxLaj8L3VY0gsqMTu0Tjd9uT49PIia0YZUUACrTt_XEgWpa87QRiOZdd1BDYHQHk85tWyOGh9_mj08cX465UOjIDl3V6Hhssyl277nl_2JyRy3gV_gvspsH3Q2RCbuYS6GJCSfqTmO-T2tafY4wTqeG_tMi1qGp5BneCajnpoCAaES1M2adHmCTIUPcJdxughNd-DPmHhapP4hAHdGbREIgsaNQyjw"/>
              </div>
            </div>
          </div>
        </section>

        {/* Problem Section */}
        <section className="bg-surface-container-low py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 font-headline">The Gap We’re Solving</h2>
              <div className="w-24 h-1 bg-secondary rounded-full mx-auto"></div>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-surface-container-lowest p-10 rounded-3xl space-y-6 hover:translate-y-[-4px] transition-transform duration-300">
                <div className="w-16 h-16 bg-surface-container flex items-center justify-center rounded-2xl">
                  <span className="material-symbols-outlined text-primary text-3xl">campaign</span>
                </div>
                <h3 className="text-xl font-bold text-on-surface font-headline">Lack of awareness</h3>
                <p className="text-on-surface-variant leading-relaxed">Women often don't know who to contact or where to turn during critical moments of need.</p>
              </div>
              <div className="bg-surface-container-lowest p-10 rounded-3xl space-y-6 hover:translate-y-[-4px] transition-transform duration-300">
                <div className="w-16 h-16 bg-surface-container flex items-center justify-center rounded-2xl">
                  <span className="material-symbols-outlined text-primary text-3xl">schedule</span>
                </div>
                <h3 className="text-xl font-bold text-on-surface font-headline">Delayed help</h3>
                <p className="text-on-surface-variant leading-relaxed">Bureaucratic hurdles and slow communication channels result in dangerous response times.</p>
              </div>
              <div className="bg-surface-container-lowest p-10 rounded-3xl space-y-6 hover:translate-y-[-4px] transition-transform duration-300">
                <div className="w-16 h-16 bg-surface-container flex items-center justify-center rounded-2xl">
                  <span className="material-symbols-outlined text-primary text-3xl">link_off</span>
                </div>
                <h3 className="text-xl font-bold text-on-surface font-headline">Disconnected NGOs</h3>
                <p className="text-on-surface-variant leading-relaxed">Help organizations operate in silos, preventing efficient resource sharing and coverage.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 px-6 max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-primary mb-16 font-headline">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 border-t-2 border-dashed border-outline-variant -z-10"></div>
            <div className="flex flex-col items-center text-center space-y-4 pt-8 md:pt-0">
              <div className="w-16 h-16 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xl relative shadow-md">1</div>
              <h4 className="font-bold text-lg font-headline">Report via WhatsApp / Web</h4>
              <p className="text-sm text-on-surface-variant">Simple messaging interface for instant access.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4 pt-8 md:pt-0">
              <div className="w-16 h-16 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xl relative shadow-md">2</div>
              <h4 className="font-bold text-lg font-headline">Smart analysis</h4>
              <p className="text-sm text-on-surface-variant">AI-driven system prioritizes case urgency immediately.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4 pt-8 md:pt-0">
              <div className="w-16 h-16 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xl relative shadow-md">3</div>
              <h4 className="font-bold text-lg font-headline">NGO Notification</h4>
              <p className="text-sm text-on-surface-variant">Closest verified partner is alerted in seconds.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4 pt-8 md:pt-0">
              <div className="w-16 h-16 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xl relative shadow-md">4</div>
              <h4 className="font-bold text-lg font-headline">Help arrives</h4>
              <p className="text-sm text-on-surface-variant">Coordinated response ensures the woman is safe.</p>
            </div>
          </div>
        </section>

        {/* Key Features (Bento Grid) */}
        <section className="px-6 py-20 bg-surface-container">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-primary font-headline">Powerful Features for Safety</h2>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
              <div className="md:col-span-3 bg-white p-8 rounded-3xl shadow-sm space-y-4 hover:shadow-md transition-shadow">
                <span className="material-symbols-outlined text-secondary text-4xl">route</span>
                <h3 className="text-2xl font-bold font-headline">Smart Case Routing</h3>
                <p className="text-on-surface-variant">Automated matching of cases to the most relevant and nearby NGO partners based on expertise and availability.</p>
              </div>
              <div className="md:col-span-3 bg-secondary-container/30 p-8 rounded-3xl space-y-4 hover:bg-secondary-container/40 transition-colors">
                <span className="material-symbols-outlined text-secondary text-4xl">devices_other</span>
                <h3 className="text-2xl font-bold font-headline">Multi-channel Access</h3>
                <p className="text-on-surface-variant">Connect via WhatsApp, SMS, Web, or our direct helplines. No app download required for immediate help.</p>
              </div>
              <div className="md:col-span-2 bg-primary-container/10 p-8 rounded-3xl space-y-4 hover:bg-primary-container/15 transition-colors">
                <span className="material-symbols-outlined text-primary text-4xl">dashboard</span>
                <h3 className="text-xl font-bold font-headline">Real-time Dashboard</h3>
                <p className="text-sm text-on-surface-variant">Live monitoring for administrators to track response health.</p>
              </div>
              <div className="md:col-span-2 bg-white p-8 rounded-3xl shadow-sm space-y-4 hover:shadow-md transition-shadow">
                <span className="material-symbols-outlined text-secondary text-4xl">encrypted</span>
                <h3 className="text-xl font-bold font-headline">Privacy-first</h3>
                <p className="text-sm text-on-surface-variant">Consent-based data sharing and end-to-end encryption for all reporting.</p>
              </div>
              <div className="md:col-span-2 bg-white p-8 rounded-3xl shadow-sm space-y-4 hover:shadow-md transition-shadow">
                <span className="material-symbols-outlined text-primary text-4xl">translate</span>
                <h3 className="text-xl font-bold font-headline">Bilingual Support</h3>
                <p className="text-sm text-on-surface-variant">Full availability in English and Hindi to bridge the accessibility gap.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section className="py-24 px-6 max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-16 text-primary font-headline">Measurable Difference</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <p className="text-5xl font-extrabold text-secondary mb-2 font-headline">1,500+</p>
              <p className="text-on-surface-variant font-medium text-lg">Cases Handled Safely</p>
            </div>
            <div>
              <p className="text-5xl font-extrabold text-secondary mb-2 font-headline">60+</p>
              <p className="text-on-surface-variant font-medium text-lg">NGOs Connected</p>
            </div>
            <div>
              <p className="text-5xl font-extrabold text-secondary mb-2 font-headline">40%</p>
              <p className="text-on-surface-variant font-medium text-lg">Faster Response Time</p>
            </div>
          </div>
        </section>

        {/* For NGOs Section */}
        <section className="mx-6 md:mx-auto max-w-7xl mb-20 bg-stone-900 rounded-[3rem] overflow-hidden text-white shadow-2xl">
          <div className="grid lg:grid-cols-2 gap-0">
            <div className="p-12 md:p-20 flex flex-col justify-center space-y-8">
              <h2 className="text-4xl font-bold leading-tight font-headline">Scale Your Impact with Saheli Dashboard</h2>
              <p className="text-stone-400 text-lg leading-relaxed">
                Join our network to access a streamlined case management system, coordinated volunteer dispatch, and detailed impact analytics. 
              </p>
              <div>
                <Link to="/login" className="inline-block bg-secondary-container text-on-secondary-container px-10 py-5 rounded-full font-bold text-lg hover:scale-[1.03] transition-transform duration-200">
                  Join as NGO Partner
                </Link>
              </div>
            </div>
            <div className="relative min-h-[400px]">
              <img alt="Team collaborating" className="absolute inset-0 w-full h-full object-cover opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZ51jD0TER6VN45-ru2MbSgFDbjNDx53jqfocgRkwOWLZ8zaS6-6IFp5FuQfi2o2KAlyOb1qv63EBdf4jH5auxtavKgU1qveEkHZsH1b8bXa3Mdj5LUf-OnV4m9sB3K-xSqZ1TSGNHtj4Vc-ZngR5SHAePykguNu3htO8LwHL4G2dSEVr4Tovj6RsHpHvxZLNGVgp5tUTMU6fJL5PDx-zPtom-QkdzPPhlVWfMIxnN-y9MXHV6dQWvsfvmoTGPoTqImAze-9v6Cg"/>
            </div>
          </div>
        </section>

        {/* Trust & Safety Section */}
        <section className="px-6 py-20 max-w-4xl mx-auto text-center">
          <div className="bg-surface-container-low p-12 rounded-[2.5rem] space-y-6 shadow-sm">
            <span className="material-symbols-outlined text-primary text-6xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
            <h2 className="text-3xl font-bold font-headline">Your Privacy is Our Priority</h2>
            <p className="text-on-surface-variant leading-relaxed text-lg">
              We employ bank-grade encryption and strict data protocols. Your information is only shared with verified partners after your explicit consent. Every NGO in our network undergoes a rigorous 3-step verification process.
            </p>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-6 py-24 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-5xl font-extrabold text-primary font-headline">Need Help or Want to Help?</h2>
            <p className="text-xl text-on-surface-variant font-medium">We are here to ensure no woman has to face a crisis alone.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-6 pt-4">
              <Link to="/report" className="bg-primary text-on-primary px-12 py-5 rounded-3xl font-bold text-xl shadow-xl hover:bg-primary-container transition-colors">
                Report Now
              </Link>
              <Link to="/login" className="bg-surface-container-high text-on-surface px-12 py-5 rounded-3xl font-bold text-xl hover:bg-surface-container-highest transition-colors">
                Partner With Us
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-stone-50 dark:bg-stone-950 w-full py-12 px-8">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center space-y-6">
          <div className="text-xl font-bold text-primary font-headline tracking-tight">Saheli Connect</div>
          <div className="flex flex-wrap justify-center gap-8 text-sm font-medium">
            <a className="text-stone-600 dark:text-stone-400 hover:text-secondary hover:underline transition-colors" href="#">Privacy Policy</a>
            <a className="text-stone-600 dark:text-stone-400 hover:text-secondary hover:underline transition-colors" href="#">Terms of Service</a>
            <a className="text-stone-600 dark:text-stone-400 hover:text-secondary hover:underline transition-colors" href="#">NGO Partnerships</a>
            <a className="text-stone-600 dark:text-stone-400 hover:text-secondary hover:underline transition-colors" href="#">Contact Us</a>
          </div>
          <p className="text-stone-500 text-sm mt-4">© 2024 Saheli Connect. Empowering Communities.</p>
        </div>
      </footer>

      {/* Floating Action Button (FAB) */}
      <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-40">
        <Link to="/report" className="bg-gradient-to-br from-primary to-primary-container text-on-primary w-16 h-16 rounded-2xl shadow-2xl flex items-center justify-center hover:scale-110 transition-transform active:scale-90">
          <span className="material-symbols-outlined text-3xl">chat</span>
        </Link>
      </div>
    </div>
  );
}
