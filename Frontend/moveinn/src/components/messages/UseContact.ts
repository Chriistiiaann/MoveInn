import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@/context/authcontext';
import { API_CHAT_GET_CONTACTS } from '@/utils/endpoints/config';

export interface Contact {
  otherUserId: string;
  otherUserName: string;
  otherUserAvatar: string;
  lastMessage: string;
  lastMessageAt: string;
}

export const useContacts = () => {
  const { user, token } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id || !token) return;

    const fetchContacts = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await axios.get<Contact[]>(
          API_CHAT_GET_CONTACTS(user.id),
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("data", data)
        setContacts(data);
      } catch (err: any) {
        if (err.response?.status === 404) {
          setContacts([]);
          setError(null);
        } else {
          console.error('Error fetching contacts:', err);
          setError(err.message || 'Error fetching contacts');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [user?.id, token]);

  return { contacts, loading, error };
};
