"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import styles from "./lightbox.module.css";
import Image from "next/image";

interface LightboxProps {
    images: string[];
    initialIndex?: number;
    isOpen: boolean;
    onClose: () => void;
}

export default function Lightbox({ images, initialIndex = 0, isOpen, onClose }: LightboxProps) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
            setCurrentIndex(initialIndex);
        } else {
            document.body.style.overflow = "auto";
        }
    }, [isOpen, initialIndex]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowLeft") handlePrev();
            if (e.key === "ArrowRight") handleNext();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, currentIndex]);

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div 
                className={styles.overlay}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                role="dialog"
                aria-modal="true"
                aria-label="Resim görüntüleyici"
            >
                <div className={styles.content} onClick={(e) => e.stopPropagation()}>
                    <button 
                        className={styles.closeBtn} 
                        onClick={onClose}
                        aria-label="Kapat"
                    >
                        <X size={24} />
                    </button>

                    {images.length > 1 && (
                        <>
                            <button 
                                className={styles.navBtnPrev} 
                                onClick={handlePrev}
                                aria-label="Önceki resim"
                            >
                                <ChevronLeft size={32} />
                            </button>
                            <button 
                                className={styles.navBtnNext} 
                                onClick={handleNext}
                                aria-label="Sonraki resim"
                            >
                                <ChevronRight size={32} />
                            </button>
                        </>
                    )}

                    <motion.div 
                        key={currentIndex}
                        className={styles.imageWrapper}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Image
                            src={images[currentIndex]}
                            alt={`Lightbox image ${currentIndex + 1}`}
                            fill
                            className={styles.image}
                            quality={100}
                        />
                    </motion.div>

                    <div className={styles.footer}>
                        <span className={styles.counter}>
                            {currentIndex + 1} / {images.length}
                        </span>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
