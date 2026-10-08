"use client";

import { getGreetings } from "@/lib/utils";
import { useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
    const interval = setInterval(callback, 60000)
    return () => clearInterval(interval)
}

function getSnapshot() {
    const hour = new Date().getHours();
    return getGreetings(hour)
}

function getServerSnapshot() {
    return null
}

export function Greeting() {
    const greeting = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
    return (
        <>{greeting ?? "Hey There!"}</>
    )
}