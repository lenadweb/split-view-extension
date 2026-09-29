import { useCallback, useEffect, useRef, useState } from 'react';

export function useWindowTabs() {
    const [tabs, setTabs] = useState<chrome.tabs.Tab[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const refresh = useCallback(async () => {
        try {
            const result = await chrome.tabs.query({ currentWindow: true });
            setTabs(result.sort((a, b) => a.index - b.index));
            setLoadError(false);
        } catch {
            setLoadError(true);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void refresh();
        const schedule = () => {
            if (timer.current) clearTimeout(timer.current);
            timer.current = setTimeout(() => {
                void refresh();
            }, 100);
        };
        const events = [
            chrome.tabs.onCreated,
            chrome.tabs.onRemoved,
            chrome.tabs.onMoved,
            chrome.tabs.onUpdated,
            chrome.tabs.onActivated,
            chrome.tabs.onAttached,
            chrome.tabs.onDetached,
        ];
        events.forEach((event) => event.addListener(schedule));
        return () => {
            if (timer.current) clearTimeout(timer.current);
            events.forEach((event) => event.removeListener(schedule));
        };
    }, [refresh]);

    return { tabs, loading, loadError, refresh };
}
