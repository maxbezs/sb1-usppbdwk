import React, { useEffect } from 'react';
import { ChevronDown, Trash2 } from 'lucide-react';
import { useProfileStore } from '../../../store/profileStore';
import { CardHeader } from './CardHeader';

interface ContactDetail {
  id: string;
  type: 'Phone' | 'Telegram' | 'Email' | 'Address' | 'Calendar link' | 'Other';
  customType?: string;
  value: string;
}

const CONTACT_TYPES = ['Phone', 'Telegram', 'Email', 'Address', 'Calendar link', 'Other'] as const;
const MAX_CONTACTS = 10;

export function ContactCard() {
  const { profile, updateContacts } = useProfileStore();
  const [contacts, setContacts] = React.useState<ContactDetail[]>([]);
  const [isExpanded, setIsExpanded] = React.useState(false);

  // Initialize contacts from profile
  useEffect(() => {
    if (profile?.contacts) {
      setContacts(profile.contacts);
    }
  }, [profile?.contacts]);

  const handleAddContact = () => {
    if (!isExpanded) {
      setIsExpanded(true);
      return;
    }

    if (contacts.length >= MAX_CONTACTS) return;
    
    const newContacts = [
      ...contacts,
      {
        id: crypto.randomUUID(),
        type: 'Phone',
        value: '',
        order: contacts.length
      }
    ];
    setContacts(newContacts);
    updateContacts(newContacts);
  };

  const handleRemoveContact = (id: string) => {
    const newContacts = contacts.filter(contact => contact.id !== id);
    setContacts(newContacts);
    updateContacts(newContacts);
  };

  const handleContactChange = (id: string, field: keyof ContactDetail | 'customType', value: any) => {
    const updatedContacts = contacts.map(contact => {
      if (contact.id !== id) return contact;
      
      if (field === 'customType') {
        return { ...contact, customType: value };
      }
      
      if (field === 'type' && value !== 'Other') {
        const { customType, ...rest } = contact;
        return { ...rest, type: value };
      }
      
      return { ...contact, [field]: value };
    });

    setContacts(updatedContacts);
    updateContacts(updatedContacts);
  };

  return (
    <div className="glass-card-dark">
      <CardHeader
        title="Contact"
        subtitle="Add your preferred contact methods"
        isExpanded={isExpanded}
        onToggle={() => setIsExpanded(!isExpanded)}
        onAdd={handleAddContact}
      />

      {isExpanded && (
        <div className="px-8 pb-8 space-y-6">
          <div className="space-y-4">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10"
              >
                <div className="relative flex-1">
                  <select
                    value={contact.type}
                    onChange={(e) => handleContactChange(contact.id, 'type', e.target.value)}
                    className="w-48 px-4 py-3 bg-white/10 rounded-xl border border-white/20 text-white appearance-none cursor-pointer"
                  >
                    {CONTACT_TYPES.map((type) => (
                      <option key={type} value={type} className="bg-gray-900">
                        {type}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
                </div>
                
                {contact.type === 'Other' && (
                  <div className="flex-1">
                    <input
                      type="text"
                      value={contact.customType || ''}
                      onChange={(e) => handleContactChange(contact.id, 'customType', e.target.value)}
                      placeholder="Custom type..."
                      maxLength={20}
                      className="w-full px-4 py-3 bg-white/10 rounded-xl border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/30"
                    />
                  </div>
                )}
                
                <div className="flex-[2]">
                  <input
                    type="text"
                    value={contact.value}
                    onChange={(e) => handleContactChange(contact.id, 'value', e.target.value)}
                    maxLength={100}
                    placeholder="Enter details..."
                    className="w-full px-4 py-3 bg-white/10 rounded-xl border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/30"
                  />
                </div>
                <button
                  onClick={() => handleRemoveContact(contact.id)}
                  className="p-2 text-white/50 hover:text-white/70 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}