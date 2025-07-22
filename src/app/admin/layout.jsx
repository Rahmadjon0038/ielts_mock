'use client';
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      // Tokenni decode qilish (jsonwebtoken o‘rniga)
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const decoded = JSON.parse(jsonPayload);

      if (decoded?.role !== 'admin') {
        router.push('/not-authorized');
      } else {
        setIsAuthorized(true);
      }
    } catch (error) {
      console.error('Token decoding error:', error);
      router.push('/login');
    }
  }, [router]);

  if (!isAuthorized) return null;

  return <>{children}</>;
}
