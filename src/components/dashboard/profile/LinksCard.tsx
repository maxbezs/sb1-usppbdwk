import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { GripVertical, Trash2, AlertCircle } from 'lucide-react';
import { AutosaveInput } from '../../AutosaveInput';
import { useProfileStore } from '../../../store/profileStore';
import { CardHeader } from './CardHeader';

interface SocialLink {
  id: string;
  title: string;
  url: string;
}

const MAX_LINKS = 20;

export function LinksCard() {
  const { profile, updateLinks } = useProfileStore();
  const [linkError, setLinkError] = React.useState<string | null>(null);

  const handleAddLink = () => {
    if ((profile?.social_links?.length || 0) >= MAX_LINKS) {
      setLinkError(`You can only add up to ${MAX_LINKS} links`);
      setTimeout(() => setLinkError(null), 3000);
      return;
    }

    const newLinks = [
      ...(profile?.social_links || []),
      {
        id: crypto.randomUUID(),
        title: '',
        url: ''
      }
    ];
    updateLinks(newLinks);
  };

  const handleRemoveLink = (id: string) => {
    const newLinks = (profile?.social_links || []).filter(link => link.id !== id);
    updateLinks(newLinks);
    setLinkError(null);
  };

  const handleLinkChange = (id: string, field: keyof SocialLink, value: string) => {
    const newLinks = (profile?.social_links || []).map(link =>
      link.id === id ? { ...link, [field]: value } : link
    );
    updateLinks(newLinks);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(profile?.social_links || []);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    updateLinks(items);
  };

  return (
    <div className="glass-card-dark">
      <CardHeader
        title="Links"
        subtitle="Where can people find you and your work online?"
        isExpanded={true}
        onToggle={() => {}}
        onAdd={handleAddLink}
        showToggle={false}
      />

      <div className="px-8 pb-8 space-y-6">
        {linkError && (
          <div className="flex items-center gap-2 text-red-400 bg-red-400/10 p-3 rounded-lg">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{linkError}</span>
          </div>
        )}

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="links">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4"
              >
                {(profile?.social_links || []).map((link, index) => (
                  <Draggable key={link.id} draggableId={link.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10"
                      >
                        <div {...provided.dragHandleProps}>
                          <GripVertical className="w-6 h-6 text-white/50" />
                        </div>
                        <div className="flex-1 grid grid-cols-2 gap-4">
                          <AutosaveInput
                            value={link.title}
                            field={`links.${link.id}.title`}
                            placeholder="Link Title"
                          />
                          <AutosaveInput
                            value={link.url}
                            field={`links.${link.id}.url`}
                            placeholder="URL"
                          />
                        </div>
                        <button
                          onClick={() => handleRemoveLink(link.id)}
                          className="p-2 text-white/50 hover:text-white/70 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}