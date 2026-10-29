// Anonimowe zdarzenia kontaktu (formularz, Instagram, e-mail, telefon, trasa) → licznik w WP
// (wtyczka tools/wp-plugin/iovi-leads) + mail z powiadomieniem. Bez cookies i danych osobowych,
// więc działa także bez zgody na GA.
import { Resend } from "resend";

const TYPES = {
	formularz: "Wysłany formularz kontaktowy",
	instagram: "Klik w Instagram",
	email: "Klik w e-mail",
	telefon: "Klik w telefon",
	trasa: "Klik w trasę (Mapy Google)",
} as const;
type LeadType = keyof typeof TYPES;

// Na te zdarzenia idzie mail od razu; pozostałe tylko liczymy.
const NOTIFY: LeadType[] = ["formularz", "instagram"];

const resend = process.env.RESEND_API_KEY
	? new Resend(process.env.RESEND_API_KEY)
	: null;

// Prosty limit na instancję: max 20 zdarzeń / min z jednego IP (ochrona licznika i skrzynki).
const hits = new Map<string, number[]>();
function limited(ip: string) {
	const now = Date.now();
	const recent = (hits.get(ip) || []).filter((t) => now - t < 60_000);
	recent.push(now);
	hits.set(ip, recent);
	if (hits.size > 5000) hits.clear();
	return recent.length > 20;
}

const clip = (v: unknown, n: number) => (typeof v === "string" ? v.slice(0, n) : "");

export async function POST(request: Request) {
	const ua = request.headers.get("user-agent") || "";
	if (/bot|crawl|spider|lighthouse|headless/i.test(ua)) {
		return new Response(null, { status: 204 });
	}
	const ip = (request.headers.get("x-forwarded-for") || "").split(",")[0].trim();
	if (limited(ip)) return new Response(null, { status: 429 });

	let body: Record<string, unknown>;
	try {
		body = JSON.parse(await request.text());
	} catch {
		return new Response(null, { status: 400 });
	}
	const type = body.type as LeadType;
	if (!(type in TYPES)) return new Response(null, { status: 400 });

	const event = {
		type,
		page_path: clip(body.page_path, 255),
		placement: clip(body.placement, 80),
		referrer: clip(body.referrer, 255),
	};

	const tasks: Promise<unknown>[] = [];
	if (process.env.WORDPRESS_URL && process.env.LEADS_SECRET) {
		tasks.push(
			fetch(`${process.env.WORDPRESS_URL.replace(/\/$/, "")}/wp-json/iovi/v1/lead`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"X-Iovi-Secret": process.env.LEADS_SECRET,
				},
				body: JSON.stringify(event),
				cache: "no-store",
			}),
		);
	}
	if (resend && process.env.LEADS_NOTIFY_EMAIL && NOTIFY.includes(type)) {
		tasks.push(
			resend.emails.send({
				from: `iovi-ink.pl <${process.env.EMAIL_FROM}>`,
				to: process.env.LEADS_NOTIFY_EMAIL.split(",").map((e) => e.trim()),
				subject: `Lead: ${TYPES[type]} (${event.page_path || "/"})`,
				// Zwykły tekst zamiast HTML — Gmail rzadziej wrzuca takie maile do "Ofert".
				text: [
					`${TYPES[type]} na iovi-ink.pl`,
					"",
					`Podstrona: https://iovi-ink.pl${event.page_path}`,
					`Miejsce na stronie: ${event.placement || "—"}`,
					`Wejście z: ${event.referrer || "bezpośrednio / nieznane"}`,
					`Czas: ${new Date().toLocaleString("pl-PL", { timeZone: "Europe/Warsaw" })}`,
					"",
					"Liczniki: panel WordPress → Leady",
				].join("\n"),
			}),
		);
	}

	const results = await Promise.allSettled(tasks);
	for (const r of results) {
		if (r.status === "rejected") console.error("lead-event:", r.reason);
	}
	return new Response(null, { status: 204 });
}
