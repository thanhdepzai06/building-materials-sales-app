/**
 * src/hooks/useSimulationHistory.ts
 * Quan ly lich su cac lan mo phong vat lieu (Tinh nang 5).
 * Luu vao AsyncStorage -> xem lai duoc sau khi tat app.
 *
 * Chuan PROG3002: custom hook, tra ve API ro rang, khong dung 'any'.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import type { SimulationRecord } from '../types';

/** Khoa luu lich su trong AsyncStorage */
const STORAGE_KEY = '@vlxd_sales/simulations_v1';

/** So ban ghi toi da giu lai - tranh phinh bo nho */
const MAX_RECORDS = 50;

/** Du lieu can de tao 1 ban ghi moi (id va thoi gian do hook tu sinh) */
export type NewSimulationInput = Omit<
  SimulationRecord,
  'id' | 'createdAt' | 'isFavorite'
>;

interface UseSimulationHistoryResult {
  records: SimulationRecord[];
  /** So ban ghi da danh dau yeu thich */
  favoriteCount: number;
  hydrated: boolean;
  addRecord: (input: NewSimulationInput) => void;
  removeRecord: (id: string) => void;
  toggleFavorite: (id: string) => void;
  clearHistory: () => void;
}

/** Sinh id don gian nhung du duy nhat cho pham vi do an */
const generateId = (): string =>
  `sim-${Date.now()}-${Math.floor(Math.random() * 100000)}`;

/**
 * Hook quan ly lich su mo phong.
 * Co the dung o nhieu man hinh khac nhau - moi noi se co state rieng,
 * nhung cung doc/ghi tren 1 khoa AsyncStorage duy nhat.
 */
export const useSimulationHistory = (): UseSimulationHistoryResult => {
  const [records, setRecords] = useState<SimulationRecord[]>([]);
  const [hydrated, setHydrated] = useState<boolean>(false);

  /* ---- Doc lich su khi mount ---- */
  useEffect(() => {
    let mounted = true;

    const load = async (): Promise<void> => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!mounted) {
          return;
        }
        if (raw) {
          const parsed: unknown = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            setRecords(parsed as SimulationRecord[]);
            setHydrated(true);
            return;
          }
        }
        setRecords([]);
      } catch {
        setRecords([]);
      } finally {
        if (mounted) {
          setHydrated(true);
        }
      }
    };

    void load();
    return (): void => {
      mounted = false;
    };
  }, []);

  /* ---- Ghi xuong AsyncStorage moi khi thay doi ---- */
  useEffect(() => {
    if (!hydrated) {
      return;
    }
    const persist = async (): Promise<void> => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(records));
      } catch {
        // Ghi loi -> bo qua
      }
    };
    void persist();
  }, [records, hydrated]);

  /* ---- Actions ---- */
  const addRecord = useCallback((input: NewSimulationInput): void => {
    const record: SimulationRecord = {
      ...input,
      id: generateId(),
      createdAt: new Date().toISOString(),
      isFavorite: false,
    };
    // Ban ghi moi nhat len dau, cat bot neu vuot gioi han
    setRecords((prev: SimulationRecord[]): SimulationRecord[] =>
      [record, ...prev].slice(0, MAX_RECORDS),
    );
  }, []);

  const removeRecord = useCallback((id: string): void => {
    setRecords((prev: SimulationRecord[]): SimulationRecord[] =>
      prev.filter((r: SimulationRecord): boolean => r.id !== id),
    );
  }, []);

  const toggleFavorite = useCallback((id: string): void => {
    setRecords((prev: SimulationRecord[]): SimulationRecord[] =>
      prev.map((r: SimulationRecord): SimulationRecord =>
        r.id === id ? { ...r, isFavorite: !r.isFavorite } : r,
      ),
    );
  }, []);

  const clearHistory = useCallback((): void => {
    setRecords([]);
  }, []);

  const favoriteCount = useMemo<number>(
    () =>
      records.filter((r: SimulationRecord): boolean => r.isFavorite).length,
    [records],
  );

  return {
    records,
    favoriteCount,
    hydrated,
    addRecord,
    removeRecord,
    toggleFavorite,
    clearHistory,
  };
};
