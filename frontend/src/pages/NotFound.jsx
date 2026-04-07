import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center space-y-6">
      <div className="w-24 h-24 bg-error-container text-on-error-container rounded-full flex items-center justify-center">
        <span className="material-symbols-outlined text-5xl">warning</span>
      </div>
      <div className="space-y-2 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-primary font-headline">404 - Page Not Found</h1>
        <p className="text-lg text-on-surface-variant font-medium">The page you are looking for does not exist or has been moved.</p>
        <p className="text-sm text-zinc-500 italic">इस पेज को नहीं खोजा जा सका।</p>
      </div>
      <Link to="/" className="bg-primary text-white px-8 py-4 rounded-3xl font-bold hover:bg-primary-container transition-colors shadow-lg">
        Go Back Home
      </Link>
    </div>
  );
}
