"use client";

import { useEffect, useRef, useState, useCallback } from 'react';

export function useMutationAudio(enabled: boolean = false) {
  const observerRef = useRef<MutationObserver | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = useCallback((text: string) => {
    if (!enabled || typeof window === 'undefined' || !window.speechSynthesis) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0; // Normal conversational speed
    utterance.pitch = 1.1; 
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  }, [enabled]);

  // This function watches a specific DOM element for silent text changes
  const observeElement = useCallback((elementId: string, prefixMessage?: string) => {
    if (!enabled || typeof window === 'undefined') return;

    const target = document.getElementById(elementId);
    if (!target) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList' || mutation.type === 'characterData') {
          const newText = target.innerText;
          if (newText.trim() !== '') {
            speak(prefixMessage ? `${prefixMessage} ${newText}` : newText);
          }
          break; // Only speak once per batch of DOM mutations
        }
      }
    });

    observerRef.current.observe(target, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }, [enabled, speak]);

  useEffect(() => {
    return () => {
      if (observerRef.current) observerRef.current.disconnect();
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return { speak, observeElement, isSpeaking };
}
