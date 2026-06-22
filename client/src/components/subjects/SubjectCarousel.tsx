'use client';
import { Subject } from "@/types/subject";
import { SubjectCard } from "./SubjectCard";
import { useState } from "react";
import { GhostCard } from "./GhostCard";
import { motion, useMotionValue, useTransform } from "framer-motion";



export function SubjectCarousel({ subjects }: { subjects: Subject[] }) {
    const [centerIndex, setCenterIndex] = useState(0);
    const n = subjects.length;

    const wrap = (i: number) => (i % n + n) % n; //loops the carousel


    const center = subjects[wrap(centerIndex)];
    const left = n > 2 ? subjects[wrap(centerIndex - 1)] : null;
    const right = n > 1 ? subjects[wrap(centerIndex + 1)] : null;

    const THRESHOLD = 100; //For framer motion drag. (100px)
    const x = useMotionValue(0);
    const glow = useTransform(x, [-150, 0, 150], [0, 1, 0]);

    return (
        <motion.div
            className="carousel-stage"
            drag='x'
            dragConstraints={{ left: 0, right: 0 }}
            style={{ x }}
            dragElastic={0.2}
            onDragEnd={(e, info) => {
                if (info.offset.x < -THRESHOLD) {
                    setCenterIndex(wrap(centerIndex + 1))
                }
                else if (info.offset.x > THRESHOLD) {
                    setCenterIndex(wrap(centerIndex - 1))
                }
            }}>

            <button type="button" onClick={() => setCenterIndex(wrap(centerIndex - 1))}
                className="carousel-prev"> {'<'} </button>
            {left ? <SubjectCard subject={left} variant="side" /> : <GhostCard />}

            <motion.div className="center-glow-wrapper" style={{ opacity: glow }}>
                <SubjectCard subject={center} variant='center' />
            </motion.div>

            {right ? <SubjectCard subject={right} variant="side" /> : <GhostCard />}
            <button onClick={() => setCenterIndex(wrap(centerIndex + 1))} className="carousel-next"> {'>'} </button>

        </motion.div>
    )
}
