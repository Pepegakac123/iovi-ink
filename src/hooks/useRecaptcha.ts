"use client";

import { useCallback } from "react";

declare global {
	interface Window {
		grecaptcha: any;
	}
}

export const useRecaptcha = () => {
	const executeRecaptcha = useCallback(
		async (action: string = "submit"): Promise<string> => {
			return new Promise((resolve, reject) => {
				if (!window.grecaptcha) {
					reject("reCAPTCHA not loaded");
					return;
				}

				window.grecaptcha.ready(() => {
					window.grecaptcha
						.execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY, { action })
						.then((token: string) => {
							resolve(token);
						})
						.catch((error: any) => {
							reject(error);
						});
				});
			});
		},
		[],
	);

	return { executeRecaptcha };
};
