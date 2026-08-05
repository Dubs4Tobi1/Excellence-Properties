import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

type Target = 'zylus' | 'home' | 'blue-earth' | 'listing';

export default function ListingForm({ onSuccess }: { onSuccess?: (row: any) => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [target, setTarget] = useState<Target>('listing');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePublish(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Get authenticated user
    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userData?.user) {
      setLoading(false);
      setError('You must be signed in to publish.');
      return;
    }
    const owner_id = userData.user.id;

    const payload = {
      title,
      description,
      target,
      published: true,
      owner_id
    };

    const { data, error: insertErr } = await supabase
      .from('listings')
      .insert([payload]);

    setLoading(false);

    if (insertErr) {
      console.error('Insert error', insertErr);
      setError(insertErr.message);
      return;
    }

    if (onSuccess) onSuccess(data?.[0]);
    // reset basic fields (optional)
    setTitle('');
    setDescription('');
    setTarget('listing');
  }

  return (
    <form onSubmit={handlePublish}>
      <div>
        <label>Title</label>
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Listing title"
        />
      </div>

      <div>
        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="A short description"
        />
      </div>

      <div>
        <label>Publish to</label>
        <select value={target} onChange={(e) => setTarget(e.target.value as Target)}>
          <option value="zylus">Zylus</option>
          <option value="home">Home</option>
          <option value="blue-earth">Blue Earth</option>
          <option value="listing">Listing</option>
        </select>
      </div>

      <div>
        <button type="submit" disabled={loading}>
          {loading ? 'Publishing...' : 'Publish'}
        </button>
      </div>

      {error && <div style={{ color: 'red' }}>{error}</div>}
    </form>
  );
}
