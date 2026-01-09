"use client";

import React, { useState, useEffect, useRef } from "react";

interface LazyLoadWrapperProps {
	children: React.ReactNode;
	threshold?: number; // 0.0 to 1.0
	rootMargin?: string; // e.g. "200px"
	minHeight?: string; // Placeholder height to prevent CLS
}

export const LazyLoadWrapper: React.FC<LazyLoadWrapperProps> = ({
	children,
	threshold = 0.1,
	rootMargin = "200px",
	minHeight = "400px",
}) => {
	const [isVisible, setIsVisible] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (isVisible) return; // Already loaded

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIsVisible(true);
					observer.disconnect();
				}
			},
			{
				threshold,
				rootMargin,
			},
		);

		if (ref.current) {
			observer.observe(ref.current);
		}

		return () => {
			observer.disconnect();
		};
	}, [isVisible, threshold, rootMargin]);

	return (
		<div ref={ref} style={{ minHeight }} className="w-full">
			{isVisible ? children : null}
		</div>
	);
};
