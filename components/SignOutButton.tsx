'use client';

import { signOut } from 'next-auth/react';

export default function SignOutButton() {
   return (
      <button
         onClick={() => signOut({ callbackUrl: '/login' })}
         className='rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 transition'
      >
         Sign out
      </button>
   );
}
