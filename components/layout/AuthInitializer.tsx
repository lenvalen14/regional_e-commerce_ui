'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetProfileQuery } from '@/features/auth/authApi';
import { setCredentials, selectCurrentToken, selectCurrentUser } from '@/features/auth/authSlice';

export default function AuthInitializer() {
  const [isMounted, setIsMounted] = useState(false);
  
  const dispatch = useDispatch();
  const token = useSelector(selectCurrentToken);
  const user = useSelector(selectCurrentUser);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { data: userResponse, isSuccess } = useGetProfileQuery(undefined, {
    skip: !isMounted || !token || !!user,
  });

  useEffect(() => {
    if (isMounted && isSuccess && userResponse?.data) {
      dispatch(setCredentials({ user: userResponse.data, token: token! }));
    }
  }, [isMounted, isSuccess, userResponse, dispatch, token]);
  
  return null;
}
