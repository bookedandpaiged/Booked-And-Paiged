'use client';

import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const DataContext = createContext(null);

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
}

export default function DataProvider({ children }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const saveTimer = useRef(null);
  const pendingData = useRef(null);

  // Load data on mount
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/data');
        if (!res.ok) throw new Error('Failed to load');
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error('Load error:', err);
        setError(err.message);
        setData({});
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Save function with throttling
  const save = useCallback(async (newData) => {
    pendingData.current = newData;

    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
    }

    saveTimer.current = setTimeout(async () => {
      const dataToSave = pendingData.current;
      if (!dataToSave) return;

      setSaving(true);
      try {
        const res = await fetch('/api/data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSave),
        });
        if (!res.ok) throw new Error('Failed to save');
        setLastSaved(new Date());
      } catch (err) {
        console.error('Save error:', err);
        setError('Failed to save. Changes may be lost.');
      } finally {
        setSaving(false);
      }
    }, 1500); // 1.5 second throttle
  }, []);

  // Update data and trigger save
  const updateData = useCallback((updater) => {
    setData((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      save(next);
      return next;
    });
  }, [save]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (saveTimer.current) {
        clearTimeout(saveTimer.current);
      }
    };
  }, []);

  return (
    <DataContext.Provider value={{ data, loading, error, saving, lastSaved, updateData }}>
      {children}
    </DataContext.Provider>
  );
}
