
import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
      <p className="text-lg text-muted-foreground mb-6">
        Sorry, the page you are looking for doesn't exist.
      </p>
      <Link 
        to="/" 
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
      >
        Go Home
      </Link>
    </div>
  );
}
